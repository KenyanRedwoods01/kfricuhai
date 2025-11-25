import React from 'react';
import { useCorporateData } from '@/contexts/CorporateDataContext';
import CorporateDashboard from '@/components/CorporateDashboard';

// Data-integrated dashboard component
const CorporateDashboardWithData: React.FC = () => {
  const {
    billers,
    warehouses,
    dashboardData,
    smartActivationMetrics,
    customerSegmentation,
    revenueBreakdown,
    selectedBiller,
    selectedWarehouse,
    dateRange,
    loading,
    errors,
    setSelectedBiller,
    setSelectedWarehouse,
    setDateRange,
    refreshData,
    getFilteredWarehouses,
    getCurrentBiller,
    getCurrentWarehouse,
  } = useCorporateData();

  // Pass real data to the original component
  const dashboardProps = {
    // Data
    billers,
    warehouses,
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
    setSelectedBiller,
    setSelectedWarehouse,
    setDateRange,
    refreshData,
    
    // Utility functions
    getFilteredWarehouses,
    getCurrentBiller,
    getCurrentWarehouse,
    
    // Override the original component's state management
    useDataEngine: true,
  };

  // Show loading state
  if (loading.hierarchy || loading.dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Corporate Dashboard</h2>
          <p className="text-gray-600">Fetching data from UHAI Africa systems...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errors.hierarchy || errors.dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">
            {errors.hierarchy || errors.dashboard}
          </p>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the dashboard with real data
  return <CorporateDashboard {...dashboardProps} />;
};

export default CorporateDashboardWithData;