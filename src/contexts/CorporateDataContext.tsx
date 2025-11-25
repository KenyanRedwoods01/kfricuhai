import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DataInitializer } from '@/lib/data/initializer';
import { CorporateAPI } from '@/lib/api/corporate';
import type {
  Biller,
  Warehouse,
  Customer,
  SmartActivationMetrics,
  CustomerSegmentation,
  RevenueBreakdown,
} from '@/server/api/routers/corporate';

interface CorporateDataContextType {
  // Data state
  billers: Biller[];
  warehouses: Warehouse[];
  customers: Customer[];
  
  // Dashboard state
  dashboardData: any;
  smartActivationMetrics: SmartActivationMetrics | null;
  customerSegmentation: CustomerSegmentation[];
  revenueBreakdown: RevenueBreakdown[];
  
  // Filters
  selectedBiller: string;
  selectedWarehouse: string;
  dateRange: string;
  
  // Loading states
  loading: {
    hierarchy: boolean;
    dashboard: boolean;
    analytics: boolean;
  };
  
  // Error states
  errors: {
    hierarchy: string | null;
    dashboard: string | null;
    analytics: string | null;
  };
  
  // Actions
  setSelectedBiller: (value: string) => void;
  setSelectedWarehouse: (value: string) => void;
  setDateRange: (value: string) => void;
  refreshData: () => void;
  clearCache: () => void;
  
  // Utility functions
  getFilteredWarehouses: () => Warehouse[];
  getCurrentBiller: () => Biller | undefined;
  getCurrentWarehouse: () => Warehouse | undefined;
}

const CorporateDataContext = createContext<CorporateDataContextType | undefined>(undefined);

interface CorporateDataProviderProps {
  children: ReactNode;
}

export const CorporateDataProvider: React.FC<CorporateDataProviderProps> = ({ children }) => {
  // State management
  const [billers, setBillers] = useState<Biller[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [smartActivationMetrics, setSmartActivationMetrics] = useState<SmartActivationMetrics | null>(null);
  const [customerSegmentation, setCustomerSegmentation] = useState<CustomerSegmentation[]>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([]);
  
  const [selectedBiller, setSelectedBiller] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  
  const [loading, setLoading] = useState({
    hierarchy: true,
    dashboard: true,
    analytics: true,
  });
  
  const [errors, setErrors] = useState({
    hierarchy: null as string | null,
    dashboard: null as string | null,
    analytics: null as string | null,
  });

  // Filter functions
  const getFilteredWarehouses = () => {
    return warehouses.filter(warehouse => {
      const matchesBiller = selectedBiller === 'all' || warehouse.biller_id?.toString() === selectedBiller;
      const matchesWarehouse = selectedWarehouse === 'all' || warehouse.warehouse_id?.toString() === selectedWarehouse;
      return matchesBiller && matchesWarehouse;
    });
  };

  const getCurrentBiller = () => {
    return billers.find(b => b.id.toString() === selectedBiller);
  };

  const getCurrentWarehouse = () => {
    return warehouses.find(w => w.warehouse_id?.toString() === selectedWarehouse);
  };

  // Handle filter changes
  const handleBillerChange = (value: string) => {
    setSelectedBiller(value);
    // Reset warehouse selection when biller changes
    setSelectedWarehouse('all');
  };

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };

  // Data loading functions
  const loadHierarchyData = async () => {
    try {
      setLoading(prev => ({ ...prev, hierarchy: true }));
      setErrors(prev => ({ ...prev, hierarchy: null }));
      
      const hierarchyData = await DataInitializer.initializeHierarchyData();
      
      setBillers(hierarchyData.billers);
      setWarehouses(hierarchyData.warehouses);
      setCustomers(hierarchyData.customers);
      
      if (hierarchyData.error) {
        setErrors(prev => ({ ...prev, hierarchy: hierarchyData.error }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load hierarchy data';
      setErrors(prev => ({ ...prev, hierarchy: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, hierarchy: false }));
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      setErrors(prev => ({ ...prev, dashboard: null }));
      
      const filters = {
        selectedBiller,
        selectedWarehouse,
        dateRange,
      };
      
      const dashboardResult = await DataInitializer.initializeDashboardData(filters);
      
      setDashboardData(dashboardResult.dashboard);
      setSmartActivationMetrics(dashboardResult.smartActivation);
      setCustomerSegmentation(dashboardResult.customerSegmentation);
      setRevenueBreakdown(dashboardResult.revenueBreakdown);
      
      if (dashboardResult.error) {
        setErrors(prev => ({ ...prev, dashboard: dashboardResult.error }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setErrors(prev => ({ ...prev, dashboard: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // Refresh all data
  const refreshData = async () => {
    DataInitializer.clearCache();
    await Promise.all([
      loadHierarchyData(),
      loadDashboardData(),
    ]);
  };

  // Clear cache
  const clearCache = () => {
    DataInitializer.clearCache();
  };

  // Initial data load
  useEffect(() => {
    loadHierarchyData();
  }, []);

  // Load dashboard data when filters change
  useEffect(() => {
    loadDashboardData();
  }, [selectedBiller, selectedWarehouse, dateRange]);

  // Set up real-time updates
  useEffect(() => {
    const unsubscribe = DataInitializer.setupRealtimeSync({
      onDashboardUpdate: (data) => {
        setDashboardData(data);
      },
    });

    return unsubscribe;
  }, []);

  const contextValue: CorporateDataContextType = {
    // Data state
    billers,
    warehouses,
    customers,
    
    // Dashboard state
    dashboardData,
    smartActivationMetrics,
    customerSegmentation,
    revenueBreakdown,
    
    // Filters
    selectedBiller,
    selectedWarehouse,
    dateRange,
    
    // Loading states
    loading,
    errors,
    
    // Actions
    setSelectedBiller: handleBillerChange,
    setSelectedWarehouse: handleWarehouseChange,
    setDateRange,
    refreshData,
    clearCache,
    
    // Utility functions
    getFilteredWarehouses,
    getCurrentBiller,
    getCurrentWarehouse,
  };

  return (
    <CorporateDataContext.Provider value={contextValue}>
      {children}
    </CorporateDataContext.Provider>
  );
};

export const useCorporateData = (): CorporateDataContextType => {
  const context = useContext(CorporateDataContext);
  if (context === undefined) {
    throw new Error('useCorporateData must be used within a CorporateDataProvider');
  }
  return context;
};

export default CorporateDataProvider;