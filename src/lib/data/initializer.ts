import { CorporateAPI } from './corporate';
import { API_CONFIG } from '../config/api';
import type {
  Biller,
  Warehouse,
  Customer,
  SmartActivationMetrics,
  CustomerSegmentation,
  RevenueBreakdown,
  AnalyticsReport,
} from '@/server/api/routers/corporate';

/**
 * Data Initialization Utility
 * Provides functions to fetch and initialize real data for components
 */

export class DataInitializer {
  private static initialized = false;
  private static cache = new Map<string, any>();

  /**
   * Initialize all corporate dashboard data
   */
  static async initializeDashboardData(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
    dateRange?: string;
  }) {
    try {
      const cacheKey = `dashboard-${JSON.stringify(filters)}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      console.log('🔄 Initializing dashboard data...', filters);

      const dashboardData = await CorporateAPI.getCorporateDashboardData(filters);
      const smartActivationMetrics = await CorporateAPI.getSmartActivationMetrics(filters);
      const customerSegmentation = await CorporateAPI.getProcessedCustomerSegmentation(filters);
      const revenueBreakdown = await CorporateAPI.getProcessedRevenueBreakdown(filters);

      const result = {
        dashboard: dashboardData,
        smartActivation: smartActivationMetrics,
        customerSegmentation,
        revenueBreakdown,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log('✅ Dashboard data initialized successfully');
      return result;

    } catch (error) {
      console.error('❌ Error initializing dashboard data:', error);
      return {
        dashboard: null,
        smartActivation: null,
        customerSegmentation: [],
        revenueBreakdown: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Initialize billers and warehouses for hierarchical filtering
   */
  static async initializeHierarchyData() {
    try {
      const [billers, warehouses, customers] = await Promise.all([
        CorporateAPI.getBillers(),
        CorporateAPI.getWarehouses(),
        CorporateAPI.getCustomers(),
      ]);

      // Build hierarchical structure
      const hierarchicalData = {
        billers: billers as Biller[],
        warehouses: warehouses as Warehouse[],
        customers: customers as Customer[],
        warehouseByBiller: this.groupWarehousesByBiller(warehouses as Warehouse[]),
        customersByWarehouse: this.groupCustomersByWarehouse(customers as Customer[]),
        loading: false,
        error: null,
      };

      console.log('✅ Hierarchy data initialized successfully');
      return hierarchicalData;

    } catch (error) {
      console.error('❌ Error initializing hierarchy data:', error);
      return {
        billers: [],
        warehouses: [],
        customers: [],
        warehouseByBiller: {},
        customersByWarehouse: {},
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load hierarchy data',
      };
    }
  }

  /**
   * Initialize analytics data for reports
   */
  static async initializeAnalyticsData(filters: {
    warehouseId?: number;
    type?: string;
  }) {
    try {
      const [reports, salesData, kpiData] = await Promise.all([
        CorporateAPI.getAnalyticsReports(filters),
        CorporateAPI.getSalesData(filters),
        CorporateAPI.getKPIData(),
      ]);

      const analyticsData = {
        reports: reports as AnalyticsReport[],
        sales: salesData,
        kpis: kpiData,
        loading: false,
        error: null,
      };

      console.log('✅ Analytics data initialized successfully');
      return analyticsData;

    } catch (error) {
      console.error('❌ Error initializing analytics data:', error);
      return {
        reports: [],
        sales: [],
        kpis: {},
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load analytics data',
      };
    }
  }

  /**
   * Generate empty state data when no real data is available
   */
  static generateEmptyStateData() {
    return {
      metrics: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
      },
      smartActivation: {
        totalGroups: 0,
        activeGroups: 0,
        avgActivationRate: 0,
        totalMembers: 0,
        avgRevenue: 0,
        topPerformingGroup: '',
        growthRate: 0,
      } as SmartActivationMetrics,
      customerSegmentation: [
        {
          segment: 'University Students',
          count: 0,
          revenue: 0,
          avgOrderValue: 0,
          loyaltyScore: 0,
          growthRate: 0,
          warehouseDistribution: {},
        },
        {
          segment: 'Rural Villagers',
          count: 0,
          revenue: 0,
          avgOrderValue: 0,
          loyaltyScore: 0,
          growthRate: 0,
          warehouseDistribution: {},
        },
        {
          segment: 'Urban Households',
          count: 0,
          revenue: 0,
          avgOrderValue: 0,
          loyaltyScore: 0,
          growthRate: 0,
          warehouseDistribution: {},
        },
      ] as CustomerSegmentation[],
      revenueBreakdown: [] as RevenueBreakdown[],
      reports: [] as AnalyticsReport[],
      loading: false,
      error: null,
    };
  }

  /**
   * Helper function to group warehouses by biller
   */
  private static groupWarehousesByBiller(warehouses: Warehouse[]) {
    return warehouses.reduce((acc, warehouse) => {
      const billerId = warehouse.biller_id || 'unknown';
      if (!acc[billerId]) {
        acc[billerId] = [];
      }
      acc[billerId].push(warehouse);
      return acc;
    }, {} as Record<string, Warehouse[]>);
  }

  /**
   * Helper function to group customers by warehouse
   */
  private static groupCustomersByWarehouse(customers: Customer[]) {
    return customers.reduce((acc, customer) => {
      const warehouseId = customer.assigned.toString();
      if (!acc[warehouseId]) {
        acc[warehouseId] = [];
      }
      acc[warehouseId].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);
  }

  /**
   * Clear all cached data
   */
  static clearCache() {
    this.cache.clear();
    CorporateAPI.clearCache();
    console.log('🧹 Data cache cleared');
  }

  /**
   * Refresh specific data type
   */
  static async refreshData(type: 'dashboard' | 'hierarchy' | 'analytics', filters?: any) {
    const cacheKey = `${type}-${JSON.stringify(filters || {})}`;
    this.cache.delete(cacheKey);
    
    switch (type) {
      case 'dashboard':
        return await this.initializeDashboardData(filters || {});
      case 'hierarchy':
        return await this.initializeHierarchyData();
      case 'analytics':
        return await this.initializeAnalyticsData(filters || {});
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }

  /**
   * Check if data is fresh (within cache duration)
   */
  static isDataFresh(cacheKey: string, maxAge = API_CONFIG.CACHE_DURATION.MEDIUM) {
    const cached = this.cache.get(cacheKey);
    if (!cached || !cached.lastUpdated) return false;
    
    const age = Date.now() - cached.lastUpdated.getTime();
    return age < maxAge;
  }

  /**
   * Set up real-time data synchronization
   */
  static setupRealtimeSync(callbacks: {
    onDashboardUpdate?: (data: any) => void;
    onSalesUpdate?: (data: any) => void;
    onCustomerUpdate?: (data: any) => void;
  }) {
    const subscriptions = CorporateAPI.subscribeToUpdates();
    
    let unsubscribers: (() => void)[] = [];

    if (callbacks.onDashboardUpdate) {
      const unsub = subscriptions.onDashboardUpdate(callbacks.onDashboardUpdate);
      unsubscribers.push(unsub);
    }

    // Set up interval-based updates for other data types
    const interval = setInterval(async () => {
      try {
        const [salesData, customerData] = await Promise.all([
          CorporateAPI.getSalesData({}),
          CorporateAPI.getCustomers(),
        ]);
        
        if (callbacks.onSalesUpdate) {
          callbacks.onSalesUpdate(salesData);
        }
        
        if (callbacks.onCustomerUpdate) {
          callbacks.onCustomerUpdate(customerData);
        }
      } catch (error) {
        console.error('Error in real-time sync:', error);
      }
    }, API_CONFIG.REALTIME.UPDATE_INTERVAL);

    unsubscribers.push(() => clearInterval(interval));

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        lastUpdated: value.lastUpdated,
        hasData: !!value,
      })),
    };
  }
}

export default DataInitializer;