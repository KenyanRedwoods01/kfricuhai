import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  AlertCircle,
  Info,
  Eye,
  Settings,
  Maximize2,
  Download,
  Share
} from 'lucide-react';

interface AdvancedKpiCardProps {
  title: string;
  value: number;
  unit: string;
  previousValue?: number;
  targetValue?: number;
  interpretation: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
  period?: string;
  lastUpdated?: Date;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onViewDetails?: () => void;
  onSettings?: () => void;
  animated?: boolean;
  compact?: boolean;
  showTrend?: boolean;
  showComparison?: boolean;
  formatValue?: (value: number) => string;
  currency?: string;
  chartData?: Array<{ date: string; value: number }>;
  theme?: 'light' | 'dark';
}

export const AdvancedKpiCard: React.FC<AdvancedKpiCardProps> = ({
  title,
  value,
  unit,
  previousValue,
  targetValue,
  interpretation,
  icon,
  color,
  trend,
  period,
  lastUpdated,
  loading = false,
  error = null,
  onRefresh,
  onViewDetails,
  onSettings,
  animated = true,
  compact = false,
  showTrend = true,
  showComparison = true,
  formatValue,
  currency,
  chartData,
  theme = 'light'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [previousValueInternal, setPreviousValueInternal] = useState(value);

  // Format the display value
  const formatDisplayValue = (val: number) => {
    if (formatValue) return formatValue(val);
    if (currency && unit === 'currency') return `${currency} ${val.toLocaleString()}`;
    return val.toLocaleString() + (unit && unit !== 'currency' ? ` ${unit}` : '');
  };

  // Calculate trend percentage
  const calculateTrendPercentage = () => {
    if (!previousValue || previousValue === 0) return 0;
    return ((value - previousValue) / previousValue) * 100;
  };

  const trendPercentage = calculateTrendPercentage();
  const isPositiveTrend = trendPercentage > 0;
  const isNegativeTrend = trendPercentage < 0;

  // Animation effect on value change
  useEffect(() => {
    if (animated && value !== previousValueInternal) {
      setAnimationClass('animate-pulse');
      const timer = setTimeout(() => setAnimationClass(''), 1000);
      setPreviousValueInternal(value);
      return () => clearTimeout(timer);
    }
  }, [value, animated, previousValueInternal]);

  // Get trend icon
  const getTrendIcon = () => {
    if (Math.abs(trendPercentage) < 0.1) return <Minus className="w-4 h-4 text-gray-400" />;
    return trendPercentage > 0 
      ? <TrendingUp className="w-4 h-4 text-green-500" />
      : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  // Progress towards target
  const getProgressPercentage = () => {
    if (!targetValue || targetValue === 0) return 0;
    return Math.min((value / targetValue) * 100, 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-500 text-white p-3 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <button 
            onClick={onRefresh}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">{title}</h3>
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ${isExpanded ? 'col-span-full' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`${color} text-white p-3 rounded-lg`}>
            {icon}
          </div>
          <div className="flex items-center space-x-2">
            {showTrend && getTrendIcon()}
            {onViewDetails && (
              <button 
                onClick={onViewDetails}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {period && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{period}</p>
            )}
          </div>

          <div className={`flex items-baseline space-x-2 ${animationClass}`}>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatDisplayValue(value)}
            </span>
            {unit && unit !== 'currency' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
            )}
          </div>

          {/* Progress towards target */}
          {targetValue && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Target Progress</span>
                <span>{getProgressPercentage().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Trend and comparison */}
          {showComparison && (
            <div className="flex items-center space-x-4 text-sm">
              {previousValue && (
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 dark:text-gray-400">vs</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {formatDisplayValue(previousValue)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isPositiveTrend 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : isNegativeTrend
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {Math.abs(trendPercentage).toFixed(1)}%
                  </span>
                </div>
              )}
              
              {lastUpdated && (
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          {/* Interpretation */}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {interpretation}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                title="Share"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>
            
            {onSettings && (
              <button 
                onClick={onSettings}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && chartData && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Trend Over Time</h4>
            <div className="space-y-2">
              {chartData.slice(-7).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.date}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDisplayValue(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};