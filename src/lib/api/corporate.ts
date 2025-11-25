import { api } from "@/lib/trpc/client";
import { TRPCClientError } from "@trpc/client";
import type { 
  Biller, 
  Warehouse, 
  Customer, 
  CustomerGroup, 
  Sale,
  SmartActivationMetrics,
  CustomerSegmentation,
  RevenueBreakdown,
  AnalyticsReport
} from "@/server/api/routers/corporate";

// ========================================
// CORPORATE DASHBOARD API HELPERS
// ========================================

export class CorporateAPI {
  private static posAccntId = 1; // Default, should be dynamic based on user

  /**
   * Fetch billers for the current POS account
   */
  static async getBillers() {
    try {
      const { data } = api.corporate.getBillers.useQuery({
        posAccntId: this.posAccntId,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching billers:', error);
      return [];
    }
  }

  /**
   * Fetch warehouses with optional biller filtering
   */
  static async getWarehouses(billerId?: number) {
    try {
      const { data } = api.corporate.getWarehouses.useQuery({
        posAccntId: this.posAccntId,
        billerId,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      return [];
    }
  }

  /**
   * Fetch customers with optional warehouse filtering
   */
  static async getCustomers(warehouseId?: number) {
    try {
      const { data } = api.corporate.getCustomers.useQuery({
        posAccntId: this.posAccntId,
        warehouseId,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  /**
   * Fetch customer groups
   */
  static async getCustomerGroups() {
    try {
      const { data } = api.corporate.getCustomerGroups.useQuery({
        posAccntId: this.posAccntId,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching customer groups:', error);
      return [];
    }
  }

  /**
   * Fetch sales data with filtering options
   */
  static async getSalesData(filters: {
    warehouseId?: number;
    billerId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const { data } = api.corporate.getSalesData.useQuery({
        posAccntId: this.posAccntId,
        ...filters,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  }

  /**
   * Fetch KPI data
   */
  static async getKPIData(kpiType?: string) {
    try {
      const { data } = api.corporate.getKPIData.useQuery({
        kpiType,
      });
      return data || {};
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      return {};
    }
  }

  /**
   * Fetch analytics reports
   */
  static async getAnalyticsReports(filters: {
    warehouseId?: number;
    type?: string;
  }) {
    try {
      const { data } = api.corporate.getAnalyticsReports.useQuery({
        posAccntId: this.posAccntId,
        ...filters,
      });
      return data || [];
    } catch (error) {
      console.error('Error fetching analytics reports:', error);
      return [];
    }
  }

  /**
   * Get complete corporate dashboard data with filtering
   */
  static async getCorporateDashboardData(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
    dateRange?: string;
  }) {
    try {
      const { data } = api.corporate.getCorporateDashboardData.useQuery({
        posAccntId: this.posAccntId,
        ...filters,
      });
      return data;
    } catch (error) {
      console.error('Error fetching corporate dashboard data:', error);
      return null;
    }
  }

  /**
   * Get smart activation metrics
   */
  static async getSmartActivationMetrics(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
  }) {
    try {
      const { data } = api.corporate.getSmartActivationMetrics.useQuery({
        posAccntId: this.posAccntId,
        ...filters,
      });
      return data;
    } catch (error) {
      console.error('Error fetching smart activation metrics:', error);
      return null;
    }
  }

  /**
   * Process and format customer segmentation data
   */
  static async getProcessedCustomerSegmentation(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
  }) {
    try {
      const dashboardData = await this.getCorporateDashboardData(filters);
      if (!dashboardData) return [];

      return dashboardData.metrics?.customerSegmentation || [];
    } catch (error) {
      console.error('Error processing customer segmentation:', error);
      return [];
    }
  }

  /**
   * Process and format revenue breakdown data
   */
  static async getProcessedRevenueBreakdown(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
  }) {
    try {
      const [dashboardData, salesData] = await Promise.all([
        this.getCorporateDashboardData(filters),
        this.getSalesData({
          warehouseId: filters.selectedWarehouse !== 'all' ? 
            parseInt(filters.selectedWarehouse || '0') : undefined,
        }),
      ]);

      if (!dashboardData || !salesData.length) return [];

      // Calculate revenue breakdown by warehouse
      const revenueBreakdown: RevenueBreakdown[] = [];
      const warehouses = dashboardData.warehouses || [];

      warehouses.forEach((warehouse: Warehouse) => {
        const warehouseSales = salesData.filter((sale: any) => 
          sale.warehouse_id === warehouse.id || sale.warehouse_id === warehouse.warehouse_id
        );

        const totalRevenue = warehouseSales.reduce((sum: number, sale: any) => 
          sum + (sale.grand_total || 0), 0
        );

        revenueBreakdown.push({
          warehouse: warehouse.name,
          warehouseId: warehouse.id || warehouse.warehouse_id || 0,
          totalRevenue,
          revenueByCustomerType: {
            students: totalRevenue * 0.35, // Example calculation
            villagers: totalRevenue * 0.25, // Example calculation
            households: totalRevenue * 0.40, // Example calculation
          },
          growthRate: Math.random() * 20 + 10, // Example calculation
          marketShare: warehouses.length > 0 ? 
            (totalRevenue / (warehouses.length * 1000000)) * 100 : 0, // Example calculation
        });
      });

      return revenueBreakdown;
    } catch (error) {
      console.error('Error processing revenue breakdown:', error);
      return [];
    }
  }

  /**
   * Real-time data synchronization helpers
   */
  static subscribeToUpdates() {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll use tRPC subscriptions if available
    return {
      onDashboardUpdate: (callback: (data: any) => void) => {
        // Implement real-time subscription logic here
        const interval = setInterval(async () => {
          const data = await this.getCorporateDashboardData({});
          if (data) callback(data);
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
      },
    };
  }

  /**
   * Error handling utility
   */
  static handleError(error: any) {
    if (error instanceof TRPCClientError) {
      return {
        success: false,
        message: error.message,
        code: error.data?.code || 'UNKNOWN_ERROR'
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Cache management
   */
  static clearCache() {
    // Clear any cached data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('corporate-cache');
      sessionStorage.removeItem('corporate-cache');
    }
  }

  /**
   * Refresh all data
   */
  static async refreshAll(filters: {
    selectedBiller?: string;
    selectedWarehouse?: string;
    dateRange?: string;
  }) {
    // This would trigger a complete data refresh
    // You could implement cache invalidation here
    return await this.getCorporateDashboardData(filters);
  }
}

// ========================================
// REACT HOOKS FOR COMPONENTS
// ========================================

/**
 * Custom hook for corporate dashboard data
 */
export function useCorporateDashboard(filters: {
  selectedBiller?: string;
  selectedWarehouse?: string;
  dateRange?: string;
} = {}) {
  return api.corporate.getCorporateDashboardData.useQuery({
    posAccntId: 1,
    ...filters,
  });
}

/**
 * Custom hook for smart activation metrics
 */
export function useSmartActivationMetrics(filters: {
  selectedBiller?: string;
  selectedWarehouse?: string;
} = {}) {
  return api.corporate.getSmartActivationMetrics.useQuery({
    posAccntId: 1,
    ...filters,
  });
}

/**
 * Custom hook for billers
 */
export function useBillers() {
  return api.corporate.getBillers.useQuery({
    posAccntId: 1,
  });
}

/**
 * Custom hook for warehouses
 */
export function useWarehouses(billerId?: number) {
  return api.corporate.getWarehouses.useQuery({
    posAccntId: 1,
    billerId,
  });
}

/**
 * Custom hook for customers
 */
export function useCustomers(warehouseId?: number) {
  return api.corporate.getCustomers.useQuery({
    posAccntId: 1,
    warehouseId,
  });
}

/**
 * Custom hook for analytics reports
 */
export function useAnalyticsReports(filters: {
  warehouseId?: number;
  type?: string;
} = {}) {
  return api.corporate.getAnalyticsReports.useQuery({
    posAccntId: 1,
    ...filters,
  });
}

// Export everything for easy access
export {
  api,
  CorporateAPI as default,
  type Biller,
  type Warehouse,
  type Customer,
  type CustomerGroup,
  type Sale,
  type SmartActivationMetrics,
  type CustomerSegmentation,
  type RevenueBreakdown,
  type AnalyticsReport,
};