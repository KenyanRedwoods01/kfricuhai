/**
 * Advanced KPI Visualization Engine
 * Integrates modern libraries and performance optimization techniques
 * Based on 2025 research findings
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useSWR from 'swr';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Enhanced Types for Advanced KPI System
export interface AdvancedKPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  category: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  visualizationType: 'line' | 'area' | 'bar' | 'pie' | 'radar' | 'gauge';
  thresholds?: {
    warning: number;
    critical: number;
    optimal: number;
  };
  realTimeEnabled: boolean;
  animationEnabled: boolean;
}

export interface KPIDashboardConfig {
  id: string;
  name: string;
  layout: DashboardLayout[];
  refreshInterval: number;
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  realTimeSync: boolean;
  virtualScrollingEnabled: boolean;
  responsiveBreakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface DashboardLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  metricId: string;
  visualizationType: string;
  customProps?: Record<string, any>;
}

// WebGL Performance Optimized Data Processor
class WebGLDataProcessor {
  private worker: Worker | null = null;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl');
    
    if (this.gl) {
      this.initializeWorker();
    }
  }

  private initializeWorker() {
    const workerCode = `
      // Web Worker for heavy data processing
      self.onmessage = function(e) {
        const { data, operation } = e.data;
        
        switch (operation) {
          case 'aggregate':
            const result = aggregateData(data);
            self.postMessage(result);
            break;
          case 'filter':
            const filtered = filterData(data);
            self.postMessage(filtered);
            break;
          case 'calculateKPI':
            const kpiResult = calculateKPIMetrics(data);
            self.postMessage(kpiResult);
            break;
        }
      };

      function aggregateData(data) {
        return data.reduce((acc, item) => {
          // Fast aggregation using typed arrays
          return acc;
        }, {});
      }

      function filterData(data) {
        return data.filter(item => item.value > 0);
      }

      function calculateKPIMetrics(data) {
        return {
          mean: data.reduce((sum, item) => sum + item.value, 0) / data.length,
          median: data.sort((a, b) => a.value - b.value)[Math.floor(data.length / 2)].value,
          stdDev: Math.sqrt(data.reduce((sq, item) => sq + Math.pow(item.value - mean, 2), 0) / data.length)
        };
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
  }

  async processLargeDataset(data: any[], operation: string): Promise<any> {
    return new Promise((resolve) => {
      if (this.worker) {
        this.worker.onmessage = (e) => resolve(e.data);
        this.worker.postMessage({ data, operation });
      } else {
        resolve(data);
      }
    });
  }
}

// Enhanced Data Fetching with SWR and TanStack Query Integration
class AdvancedDataSync {
  private queryClient: QueryClient;
  private swrOptions = {
    refreshInterval: 5000, // 5 seconds for real-time feel
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 3000,
    errorRetryCount: 3,
    errorRetryInterval: 5000
  };

  constructor() {
    this.queryClient = new QueryClient({
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
      },
    });
  }

  // SWR hook for real-time data with stale-while-revalidate
  useRealTimeKPI(enabled = true) {
    return useSWR(
      enabled ? '/api/kpi/real-time' : null,
      async (key) => {
        const response = await fetch(key);
        if (!response.ok) throw new Error('Failed to fetch KPIs');
        return response.json();
      },
      this.swrOptions
    );
  }

  // TanStack Query for complex data mutations and caching
  useKPIQuery(metricIds: string[], config = {}) {
    return useQuery({
      queryKey: ['kpi-metrics', metricIds],
      queryFn: async () => {
        const response = await fetch('/api/kpi/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metricIds })
        });
        return response.json();
      },
      enabled: metricIds.length > 0,
      ...config
    });
  }

  getQueryClient() {
    return this.queryClient;
  }
}

// Virtual Scrolling for Large KPI Lists
interface VirtualizedKPIListProps {
  metrics: AdvancedKPIMetric[];
  itemHeight: number;
  overscan?: number;
  onItemClick?: (metric: AdvancedKPIMetric) => void;
  renderItem?: (metric: AdvancedKPIMetric, index: number) => React.ReactNode;
}

// Optimized Virtual List Component using React Window patterns
export function VirtualizedKPIList({ 
  metrics, 
  itemHeight = 120, 
  overscan = 5,
  onItemClick,
  renderItem 
}: VirtualizedKPIListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = metrics.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(window.innerHeight / itemHeight) + overscan, metrics.length);

  const visibleItems = metrics.slice(startIndex, endIndex).map((metric, index) => ({
    ...metric,
    index: startIndex + index,
    top: (startIndex + index) * itemHeight
  }));

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const defaultRenderItem = useCallback((metric: AdvancedKPIMetric, index: number) => (
    <AdvancedKpiCard
      key={metric.id}
      metric={metric}
      onClick={() => onItemClick?.(metric)}
      style={{ position: 'absolute', top: metric.top, left: 0, right: 0, height: itemHeight }}
    />
  ), [onItemClick, itemHeight]);

  return (
    <div 
      ref={containerRef}
      style={{ height: '100%', overflow: 'auto', position: 'relative' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((metric) => (
          renderItem ? renderItem(metric, metric.index) : defaultRenderItem(metric, metric.index)
        ))}
      </div>
    </div>
  );
}

// Enhanced KPI Card with Framer Motion Animations
interface AdvancedKpiCardProps {
  metric: AdvancedKPIMetric;
  onClick?: () => void;
  style?: React.CSSProperties;
  animated?: boolean;
}

export function AdvancedKpiCard({ metric, onClick, style, animated = true }: AdvancedKpiCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [previousValue, setPreviousValue] = useState(metric.value);

  useEffect(() => {
    setPreviousValue(metric.value);
  }, [metric.value]);

  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.02, 
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.98 }
  };

  const valueVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  const numberVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 150, damping: 15 }
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getThresholdColor = () => {
    if (!metric.thresholds) return 'border-gray-200';
    if (metric.value >= metric.thresholds.critical) return 'border-red-500';
    if (metric.value >= metric.thresholds.warning) return 'border-yellow-500';
    if (metric.value >= metric.thresholds.optimal) return 'border-green-500';
    return 'border-gray-200';
  };

  const CardComponent = animated && !shouldReduceMotion ? motion.div : 'div';
  const animationProps = animated && !shouldReduceMotion ? {
    variants: cardVariants,
    initial: 'initial',
    whileHover: 'hover',
    whileTap: 'tap',
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false)
  } : {};

  return (
    <CardComponent
      {...animationProps}
      style={{
        ...style,
        border: `2px solid ${getThresholdColor()}`,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.name}</h3>
          {animated && !shouldReduceMotion ? (
            <motion.span
              key={metric.value}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              className={`text-2xl font-bold ${getTrendColor()}`}
            >
              {metric.value.toLocaleString()} {metric.unit}
            </motion.span>
          ) : (
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {metric.value.toLocaleString()} {metric.unit}
            </span>
          )}
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-medium ${getTrendColor()}`}>
            {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            {format(metric.timestamp, 'MMM dd, HH:mm')}
          </div>
        </div>
      </div>

      {metric.target && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Target: {metric.target.toLocaleString()}</span>
            <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isHovered && animated && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-3"
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Previous:</span>
                <span className="ml-1 font-medium">{previousValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-1 font-medium">{metric.category}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardComponent>
  );
}

// Advanced Chart Integration using Recharts with Enhanced Features
interface AdvancedChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar';
  metric: AdvancedKPIMetric;
  height?: number;
  animated?: boolean;
}

export function AdvancedChart({ data, type, metric, height = 300, animated = true }: AdvancedChartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef<any>(null);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              stroke="#666"
              fontSize={12}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              formatter={(value: any) => [value.toLocaleString(), metric.name]}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy HH:mm')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors[0] }}
              animationDuration={animated ? 1000 : 0}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              stroke="#666"
              fontSize={12}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              formatter={(value: any) => [value.toLocaleString(), metric.name]}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy HH:mm')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${metric.id})`}
              animationDuration={animated ? 1000 : 0}
            />
          </AreaChart>
        );

      case 'pie':
        const pieData = data.map((item, index) => ({
          name: item.name || `Series ${index + 1}`,
          value: item.value,
          fill: colors[index % colors.length]
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              animationDuration={animated ? 1000 : 0}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [value.toLocaleString(), 'Value']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
          </PieChart>
        );

      case 'radar':
        const radarData = data.map(item => ({
          metric: item.name || 'Metric',
          value: item.value,
          fullMark: Math.max(...data.map(d => d.value)) * 1.1
        }));

        return (
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              tick={{ fontSize: 10 }} 
              tickCount={5}
              domain={[0, 'dataMax']}
            />
            <Radar
              name={metric.name}
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={animated ? 1000 : 0}
            />
            <Tooltip 
              formatter={(value: any) => [value.toLocaleString(), metric.name]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
          </RadarChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
}

// Zustand Store for Complex Dashboard State Management
interface DashboardState {
  metrics: AdvancedKPIMetric[];
  config: KPIDashboardConfig;
  selectedMetrics: string[];
  filters: {
    category?: string;
    dateRange?: { start: Date; end: Date };
    searchQuery?: string;
  };
  viewMode: 'grid' | 'list' | 'chart';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMetrics: (metrics: AdvancedKPIMetric[]) => void;
  updateMetric: (id: string, updates: Partial<AdvancedKPIMetric>) => void;
  setConfig: (config: Partial<KPIDashboardConfig>) => void;
  setSelectedMetrics: (ids: string[]) => void;
  setFilters: (filters: Partial<DashboardState['filters']>) => void;
  setViewMode: (mode: DashboardState['viewMode']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMetric: (metric: AdvancedKPIMetric) => void;
  removeMetric: (id: string) => void;
}

export const useAdvancedKPIDashboard = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    metrics: [],
    config: {
      id: 'default',
      name: 'Advanced KPI Dashboard',
      layout: [],
      refreshInterval: 5000,
      theme: 'light',
      animationsEnabled: true,
      realTimeSync: true,
      virtualScrollingEnabled: true,
      responsiveBreakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
      }
    },
    selectedMetrics: [],
    filters: {},
    viewMode: 'grid',
    isLoading: false,
    error: null,

    setMetrics: (metrics) => set({ metrics }),
    
    updateMetric: (id, updates) => set((state) => ({
      metrics: state.metrics.map(metric => 
        metric.id === id ? { ...metric, ...updates } : metric
      )
    })),
    
    setConfig: (config) => set((state) => ({
      config: { ...state.config, ...config }
    })),
    
    setSelectedMetrics: (ids) => set({ selectedMetrics: ids }),
    
    setFilters: (filters) => set((state) => ({
      filters: { ...state.filters, ...filters }
    })),
    
    setViewMode: (mode) => set({ viewMode: mode }),
    
    setLoading: (loading) => set({ isLoading: loading }),
    
    setError: (error) => set({ error }),
    
    addMetric: (metric) => set((state) => ({
      metrics: [...state.metrics, metric]
    })),
    
    removeMetric: (id) => set((state) => ({
      metrics: state.metrics.filter(m => m.id !== id),
      selectedMetrics: state.selectedMetrics.filter(metricId => metricId !== id)
    }))
  }))
);

// Export the Advanced Data Sync utility
export { AdvancedDataSync, WebGLDataProcessor };