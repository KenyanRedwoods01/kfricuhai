import { useEffect, useCallback, useRef, useState } from 'react';
import { useKpi } from '../contexts/KpiContext';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseAutoRefreshReturn {
  isRefreshing: boolean;
  lastUpdateTime: Date | null;
  error: string | null;
  start: () => void;
  stop: () => void;
  refresh: () => Promise<void>;
  getTimeSinceLastUpdate: () => string;
}

export function useAutoRefresh(options: UseAutoRefreshOptions = {}): UseAutoRefreshReturn {
  const {
    enabled = false,
    interval = 300000, // 5 minutes default
    onSuccess,
    onError,
    retryAttempts = 3,
    retryDelay = 5000,
  } = options;

  const { state, actions } = useKpi();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      await actions.refreshData();
      
      retryCountRef.current = 0;
      onSuccess?.(state.data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      
      // Auto-retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => {
          refresh();
        }, retryDelay);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [actions, state.data, onSuccess, onError, isRefreshing, retryAttempts, retryDelay]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      refresh();
    }, interval);
  }, [interval, refresh]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getTimeSinceLastUpdate = useCallback(() => {
    if (!state.lastUpdated) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - state.lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }, [state.lastUpdated]);

  useEffect(() => {
    if (enabled) {
      start();
      // Initial refresh
      refresh();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, interval, start, stop, refresh]);

  return {
    isRefreshing,
    lastUpdateTime: state.lastUpdated,
    error,
    start,
    stop,
    refresh,
    getTimeSinceLastUpdate,
  };
}

// Hook for handling offline/online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Hook for handling data caching and persistence
export function useDataCache() {
  const { state } = useKpi();
  
  const saveToCache = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(`kpi_cache_${key}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }, []);

  const getFromCache = useCallback((key: string, maxAge: number = 300000) => {
    try {
      const cached = localStorage.getItem(`kpi_cache_${key}`);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const age = Date.now() - new Date(parsed.timestamp).getTime();
      
      if (age > maxAge) {
        localStorage.removeItem(`kpi_cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to get from cache:', error);
      return null;
    }
  }, []);

  const clearCache = useCallback((key?: string) => {
    try {
      if (key) {
        localStorage.removeItem(`kpi_cache_${key}`);
      } else {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('kpi_cache_'));
        keys.forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }, []);

  return {
    saveToCache,
    getFromCache,
    clearCache,
    currentData: state.data,
    lastUpdated: state.lastUpdated
  };
}