/**
 * Advanced Real-Time Data Synchronization System
 * Combines SWR and TanStack Query for optimal performance
 * Based on 2025 research findings
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import useSWR, { SWRConfig } from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedKPIDashboard } from '../utils/advancedKPIEngine';
import { 
  WifiIcon, 
  WifiOffIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Enhanced WebSocket Manager with Auto-Reconnection
class RealTimeWebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Function[]> = new Map();
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  private lastPingTime: number = 0;
  private lastPongTime: number = 0;

  constructor(
    private url: string,
    private onStateChange?: (state: string) => void,
    private onError?: (error: Event) => void
  ) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setConnectionState('connecting');
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.setConnectionState('connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.subscribe('connection', () => {
          this.send({ type: 'ping', timestamp: Date.now() });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.setConnectionState('disconnected');
        this.stopHeartbeat();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.setConnectionState('error');
        this.onError?.(error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.setConnectionState('error');
    }
  }

  private handleMessage(data: any) {
    const handlers = this.messageHandlers.get(data.type) || [];
    handlers.forEach(handler => handler(data));
    
    // Handle ping/pong for heartbeat
    if (data.type === 'pong') {
      this.lastPongTime = Date.now();
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() });
        
        // Check if we haven't received a pong in 30 seconds
        if (this.lastPongTime && Date.now() - this.lastPongTime > 30000) {
          console.warn('Heartbeat timeout, reconnecting...');
          this.reconnect();
        }
      }
    }, 10000); // Send ping every 10 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.setConnectionState('error');
    }
  }

  private reconnect() {
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  private setConnectionState(state: typeof this.connectionState) {
    this.connectionState = state;
    this.onStateChange?.(state);
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  subscribe(eventType: string, handler: Function) {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }
    this.messageHandlers.get(eventType)!.push(handler);
  }

  unsubscribe(eventType: string, handler: Function) {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setConnectionState('disconnected');
  }

  getConnectionState() {
    return this.connectionState;
  }
}

// Data Synchronization Hook that combines SWR and TanStack Query
interface UseRealTimeSyncOptions {
  enabled?: boolean;
  refreshInterval?: number;
  realTimeEnabled?: boolean;
  fallBackToPolling?: boolean;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

interface SyncStatus {
  isConnected: boolean;
  lastSyncTime: Date | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  errorCount: number;
  latency: number;
}

export function useRealTimeSync(
  endpoints: string[],
  options: UseRealTimeSyncOptions = {}
) {
  const {
    enabled = true,
    refreshInterval = 5000,
    realTimeEnabled = true,
    fallBackToPolling = true,
    onConnectionChange,
    onError
  } = options;

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSyncTime: null,
    connectionQuality: 'disconnected',
    errorCount: 0,
    latency: 0
  });

  const wsManagerRef = useRef<RealTimeWebSocketManager | null>(null);
  const queryClient = useQueryClient();
  const startTimeRef = useRef<number>(0);

  // Initialize WebSocket connection
  useEffect(() => {
    if (realTimeEnabled && enabled) {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      
      wsManagerRef.current = new RealTimeWebSocketManager(
        wsUrl,
        (state) => {
          const isConnected = state === 'connected';
          setSyncStatus(prev => ({
            ...prev,
            isConnected,
            connectionQuality: isConnected ? 'excellent' : 'disconnected'
          }));
          onConnectionChange?.(isConnected);
        },
        (error) => {
          setSyncStatus(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1
          }));
          onError?.(error as Error);
        }
      );

      wsManagerRef.current.connect();

      // Subscribe to real-time updates
      wsManagerRef.current.subscribe('kpi_update', (data) => {
        queryClient.setQueryData(['kpi-data', data.metricId], (oldData: any) => ({
          ...oldData,
          ...data.updates,
          lastUpdated: new Date()
        }));
      });

      wsManagerRef.current.subscribe('batch_update', (data) => {
        data.updates.forEach((update: any) => {
          queryClient.setQueryData(['kpi-data', update.metricId], (oldData: any) => ({
            ...oldData,
            ...update,
            lastUpdated: new Date()
          }));
        });
      });

      return () => {
        wsManagerRef.current?.disconnect();
      };
    }
  }, [realTimeEnabled, enabled, queryClient, onConnectionChange, onError]);

  // SWR configuration for fallback polling
  const swrConfig = useMemo(() => ({
    refreshInterval: realTimeEnabled && syncStatus.isConnected ? 0 : refreshInterval,
    revalidateOnFocus: !syncStatus.isConnected,
    revalidateOnReconnect: true,
    dedupingInterval: syncStatus.isConnected ? 1000 : 3000,
    errorRetryCount: fallBackToPolling ? 3 : 0,
    errorRetryInterval: 5000,
    onSuccess: (data: any, key: string) => {
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        errorCount: Math.max(0, prev.errorCount - 1)
      }));
    },
    onError: (error: Error) => {
      setSyncStatus(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }));
      onError?.(error);
    }
  }), [realTimeEnabled, syncStatus.isConnected, refreshInterval, fallBackToPolling, onError]);

  // Fetch data using SWR
  const fetcher = useCallback(async (url: string) => {
    startTimeRef.current = Date.now();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    
    const latency = Date.now() - startTimeRef.current;
    setSyncStatus(prev => ({
      ...prev,
      latency
    }));
    
    return data;
  }, []);

  const swrData = useSWR(
    enabled && endpoints.length > 0 ? endpoints : null,
    fetcher,
    swrConfig
  );

  // TanStack Query for critical updates
  const criticalQuery = useQuery({
    queryKey: ['critical-kpi-data'],
    queryFn: async () => {
      const response = await fetch('/api/kpi/critical');
      if (!response.ok) throw new Error('Failed to fetch critical data');
      return response.json();
    },
    enabled: enabled,
    refetchInterval: syncStatus.isConnected ? false : refreshInterval,
    staleTime: syncStatus.isConnected ? 1000 * 60 * 5 : 0,
    gcTime: 1000 * 60 * 10
  });

  // Sync status with additional metrics
  const enhancedSyncStatus: SyncStatus = {
    ...syncStatus,
    isConnected: syncStatus.isConnected && wsManagerRef.current?.getConnectionState() === 'connected',
    latency: syncStatus.latency || (criticalQuery.dataTimestamp ? Date.now() - criticalQuery.dataTimestamp : 0)
  };

  return {
    data: {
      ...swrData.data,
      critical: criticalQuery.data
    },
    status: {
      ...swrData,
      critical: criticalQuery
    },
    syncStatus: enhancedSyncStatus,
    mutate: queryClient.invalidateQueries,
    refetch: () => {
      queryClient.refetchQueries({ queryKey: ['kpi-data'] });
      return criticalQuery.refetch();
    }
  };
}

// Real-time Dashboard Status Component
interface RealTimeStatusProps {
  syncStatus: SyncStatus;
  className?: string;
}

export function RealTimeStatus({ syncStatus, className = '' }: RealTimeStatusProps) {
  const getStatusColor = () => {
    switch (syncStatus.connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus.connectionQuality) {
      case 'excellent':
      case 'good':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'poor':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <WifiOffIcon className="w-4 h-4" />;
    }
  };

  const getConnectionStatus = () => {
    if (syncStatus.isConnected) {
      return 'Connected';
    }
    return syncStatus.connectionQuality === 'disconnected' ? 'Disconnected' : 'Connecting...';
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {getConnectionStatus()}
        </span>
      </div>
      
      {syncStatus.lastSyncTime && (
        <div className="flex items-center space-x-1 text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span className="text-xs">
            Last sync: {syncStatus.lastSyncTime.toLocaleTimeString()}
          </span>
        </div>
      )}
      
      {syncStatus.latency > 0 && (
        <div className="text-xs text-gray-500">
          {syncStatus.latency}ms
        </div>
      )}
      
      {syncStatus.errorCount > 0 && (
        <div className="flex items-center space-x-1 text-red-600">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span className="text-xs">
            {syncStatus.errorCount} errors
          </span>
        </div>
      )}
    </div>
  );
}

// Connection Quality Indicator
interface ConnectionQualityProps {
  quality: SyncStatus['connectionQuality'];
  latency: number;
  className?: string;
}

export function ConnectionQualityIndicator({ quality, latency, className = '' }: ConnectionQualityProps) {
  const getQualityColor = () => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getQualityLabel = () => {
    switch (quality) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'poor': return 'Poor';
      default: return 'Disconnected';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <motion.div
            key={bar}
            className={`w-1 rounded-full ${
              (quality === 'excellent' && bar <= 4) ||
              (quality === 'good' && bar <= 3) ||
              (quality === 'poor' && bar <= 2)
                ? getQualityColor()
                : 'bg-gray-200'
            }`}
            initial={{ height: 4 }}
            animate={{ 
              height: bar === 4 ? 16 : bar === 3 ? 12 : bar === 2 ? 8 : 4 
            }}
            transition={{ duration: 0.3, delay: bar * 0.1 }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600">{getQualityLabel()}</span>
      {latency > 0 && (
        <span className="text-xs text-gray-400">({latency}ms)</span>
      )}
    </div>
  );
}

// Main Real-time Sync Provider
interface RealTimeSyncProviderProps {
  children: React.ReactNode;
  config?: {
    wsUrl?: string;
    fallbackEnabled?: boolean;
    heartbeatInterval?: number;
  };
}

export function RealTimeSyncProvider({ children, config = {} }: RealTimeSyncProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  const swrConfig = useMemo(() => ({
    provider: () => new Map(),
    fetcher: async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 3000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    ...config
  }), [config]);

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={swrConfig}>
        {children}
      </SWRConfig>
    </QueryClientProvider>
  );
}

export { RealTimeWebSocketManager };