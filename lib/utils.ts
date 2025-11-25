// Utility functions for the KPI Dashboard

/**
 * Format numbers with appropriate units and precision
 */
export const formatValue = (
  value: number,
  type: 'currency' | 'percentage' | 'number' | 'ratio' = 'number',
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    
    case 'percentage':
      return `${value.toFixed(1)}%`;
    
    case 'ratio':
      return value.toFixed(2);
    
    case 'number':
    default:
      return new Intl.NumberFormat(locale).format(value);
  }
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Determine trend direction based on value change
 */
export const getTrendDirection = (
  current: number,
  previous: number,
  positiveIsGood: boolean = true
): 'up' | 'down' | 'stable' => {
  const change = calculatePercentageChange(current, previous);
  const threshold = 0.1; // 0.1% threshold for considering it a trend
  
  if (Math.abs(change) < threshold) return 'stable';
  
  if (positiveIsGood) {
    return change > 0 ? 'up' : 'down';
  } else {
    return change < 0 ? 'up' : 'down';
  }
};

/**
 * Get color based on performance threshold
 */
export const getPerformanceColor = (
  value: number,
  thresholds: { good: number; fair: number },
  type: 'higher' | 'lower' = 'higher'
): string => {
  switch (type) {
    case 'higher':
      if (value >= thresholds.good) return 'text-green-600 dark:text-green-400';
      if (value >= thresholds.fair) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    
    case 'lower':
      if (value <= thresholds.good) return 'text-green-600 dark:text-green-400';
      if (value <= thresholds.fair) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

/**
 * Generate mock data for testing and demonstration
 */
export const generateMockData = (
  baseValue: number,
  days: number = 7,
  variation: number = 0.1
): Array<{ date: string; value: number }> => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add variation around the base value
    const randomFactor = (Math.random() - 0.5) * variation * 2;
    const value = baseValue * (1 + randomFactor);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(0, Math.round(value * 100) / 100)
    });
  }
  
  return data;
};

/**
 * Debounce function for search and input handling
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
};

/**
 * Validate date range
 */
export const validateDateRange = (
  startDate: Date,
  endDate: Date,
  maxDays: number = 365
): { valid: boolean; error?: string } => {
  if (startDate > endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > maxDays) {
    return { 
      valid: false, 
      error: `Date range cannot exceed ${maxDays} days` 
    };
  }
  
  return { valid: true };
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (
  data: Array<Record<string, any>>,
  filename: string = 'kpi-data.csv'
): void => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Color palette for charts and UI elements
 */
export const colorPalettes = {
  default: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  blue: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  green: ['#047857', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
  warm: ['#DC2626', '#F59E0B', '#FB923C', '#FCA5A5', '#FECACA'],
  cool: ['#0891B2', '#06B6D4', '#67E8F9', '#A5F3FC', '#CFFAFE']
};

/**
 * Get color from palette by index
 */
export const getColorFromPalette = (
  palette: keyof typeof colorPalettes = 'default',
  index: number
): string => {
  const colors = colorPalettes[palette];
  return colors[index % colors.length];
};

/**
 * Convert hex color to RGBA with opacity
 */
export const hexToRgba = (hex: string, opacity: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Check if value is within acceptable range
 */
export const isValidValue = (
  value: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return !isNaN(value) && isFinite(value);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};