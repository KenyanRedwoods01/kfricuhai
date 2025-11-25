/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TRPC_URL: process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:3000/api/trpc',
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

  // Cache settings
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000,     // 5 minutes
    MEDIUM: 15 * 60 * 1000,   // 15 minutes
    LONG: 30 * 60 * 1000,     // 30 minutes
  },

  // Default filters
  DEFAULT_FILTERS: {
    dateRange: '30d',
    selectedBiller: 'all',
    selectedWarehouse: 'all',
  },

  // Customer types for segmentation
  CUSTOMER_TYPES: {
    STUDENTS: 'Students',
    VILLAGERS: 'Villagers',
    HOUSEHOLDS: 'Households',
    GENERAL: 'General',
  },

  // Smart activation types
  SMART_ACTIVATIONS: {
    STUDENT_GROUPS: 'student_groups',
    HOUSEHOLD_CLUSTERS: 'household_clusters',
    VILLAGE_COOPERATIVES: 'village_cooperatives',
  },

  // KPI types
  KPI_TYPES: {
    GROSS_PROFIT_MARGIN: 'gross-profit-margin',
    SALES_GROWTH_RATE: 'sales-growth-rate',
    INVENTORY_TURNOVER: 'inventory-turnover',
    CUSTOMER_LIFETIME_VALUE: 'customer-lifetime-value',
    NET_PROFIT_MARGIN: 'net-profit-margin',
    CUSTOMER_ACQUISITION_COST: 'customer-acquisition-cost',
    CUSTOMER_RETENTION_RATE: 'customer-retention-rate',
    SALES_FORECAST: 'sales-forecast',
    ABC_ANALYSIS: 'abc-analysis',
    RETURN_ON_INVESTMENT: 'return-on-investment',
    CUSTOMER_CHURN_RATE: 'customer-churn-rate',
    PREDICTIVE_ANALYTICS: 'predictive-analytics',
    SEASONAL_TRENDS: 'seasonal-trends',
    CUSTOMER_SEGMENTATION: 'customer-segmentation',
  },

  // Report types
  REPORT_TYPES: {
    REVENUE: 'revenue',
    CUSTOMER: 'customer',
    ACTIVATION: 'activation',
    PERFORMANCE: 'performance',
  },

  // Business rules
  BUSINESS_RULES: {
    MIN_WAREHOUSE_REVENUE: 10000,
    MIN_CUSTOMER_COUNT: 10,
    MIN_ORDER_COUNT: 5,
    LOYALTY_THRESHOLD: 100,
    ACTIVATION_RATE_THRESHOLD: 75,
  },

  // Formatting
  FORMATTING: {
    CURRENCY: 'KES',
    DATE_FORMAT: 'yyyy-MM-dd',
    DECIMAL_PLACES: 2,
    PERCENTAGE_MULTIPLIER: 100,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 500,
    PRELOAD_PAGES: 2,
  },

  // Real-time settings
  REALTIME: {
    UPDATE_INTERVAL: 30000, // 30 seconds
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000, // 2 seconds
  },
} as const;

export type APIConfig = typeof API_CONFIG;