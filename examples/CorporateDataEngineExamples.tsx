/**
 * Corporate Data Engine Usage Examples
 * 
 * This file demonstrates how to use the complete data engine system
 * for the UHAI Africa corporate dashboard
 */

import React from 'react';
import { CorporateDataProvider, useCorporateData } from '@/contexts/CorporateDataContext';
import { CorporateAPI } from '@/lib/api/corporate';
import { DataInitializer } from '@/lib/data/initializer';

// ========================================
// EXAMPLE 1: Basic Dashboard with Data Engine
// ========================================

const BasicDashboardExample: React.FC = () => {
  return (
    <CorporateDataProvider>
      <DashboardContent />
    </CorporateDataProvider>
  );
};

const DashboardContent: React.FC = () => {
  const {
    billers,
    warehouses,
    dashboardData,
    smartActivationMetrics,
    customerSegmentation,
    revenueBreakdown,
    loading,
    errors,
    selectedBiller,
    setSelectedBiller,
    setSelectedWarehouse,
    refreshData,
  } = useCorporateData();

  if (loading.hierarchy || loading.dashboard) {
    return <div>Loading dashboard data...</div>;
  }

  if (errors.hierarchy || errors.dashboard) {
    return <div>Error: {errors.hierarchy || errors.dashboard}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">UHAI Africa Corporate Dashboard</h1>
        <button onClick={refreshData} className="px-4 py-2 bg-blue-600 text-white rounded">
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      {dashboardData?.metrics && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">
              KES {dashboardData.metrics.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData.metrics.totalOrders || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Customers</h3>
            <p className="text-2xl font-bold text-purple-600">
              {dashboardData.metrics.totalCustomers || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Avg Order Value</h3>
            <p className="text-2xl font-bold text-orange-600">
              KES {dashboardData.metrics.avgOrderValue?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      )}

      {/* Hierarchical Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hierarchical Filters</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">Biller</label>
            <select
              value={selectedBiller}
              onChange={(e) => setSelectedBiller(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Billers</option>
              {billers.map((biller) => (
                <option key={biller.id} value={biller.id.toString()}>
                  {biller.name || biller.company_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Warehouse</label>
            <select
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Warehouses</option>
              {warehouses
                .filter(w => selectedBiller === 'all' || w.biller_id?.toString() === selectedBiller)
                .map((warehouse) => (
                  <option key={warehouse.warehouse_id || warehouse.id} value={(warehouse.warehouse_id || warehouse.id).toString()}>
                    {warehouse.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Smart Activation Metrics */}
      {smartActivationMetrics && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Smart Activation Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold">{smartActivationMetrics.totalGroups}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Groups</p>
              <p className="text-2xl font-bold">{smartActivationMetrics.activeGroups}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Activation Rate</p>
              <p className="text-2xl font-bold">{smartActivationMetrics.avgActivationRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Segmentation */}
      {customerSegmentation.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customer Segmentation</h2>
          <div className="space-y-4">
            {customerSegmentation.map((segment) => (
              <div key={segment.segment} className="border rounded p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{segment.segment}</h3>
                  <span className="text-2xl font-bold">KES {segment.revenue?.toLocaleString() || 0}</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Count:</span> {segment.count}
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Order:</span> KES {segment.avgOrderValue?.toLocaleString() || 0}
                  </div>
                  <div>
                    <span className="text-gray-600">Growth:</span> {segment.growthRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Breakdown */}
      {revenueBreakdown.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Breakdown</h2>
          <div className="space-y-4">
            {revenueBreakdown.map((revenue) => (
              <div key={revenue.warehouseId} className="border rounded p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{revenue.warehouse}</h3>
                  <span className="text-2xl font-bold text-green-600">
                    KES {revenue.totalRevenue?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex space-x-4 text-sm">
                    <span>Growth: {revenue.growthRate}%</span>
                    <span>Market Share: {revenue.marketShare}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// EXAMPLE 2: Direct API Usage
// ========================================

const DirectAPIExample: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const loadDataDirectly = async () => {
    setLoading(true);
    try {
      const result = await CorporateAPI.getCorporateDashboardData({
        selectedBiller: 'all',
        selectedWarehouse: 'all',
        dateRange: '30d',
      });
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Direct API Usage Example</h1>
      <button
        onClick={loadDataDirectly}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load Data Directly'}
      </button>
      
      {data && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Raw API Response</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// ========================================
// EXAMPLE 3: Data Initialization
// ========================================

const DataInitializationExample: React.FC = () => {
  const [status, setStatus] = React.useState<string>('Ready');

  const initializeAllData = async () => {
    setStatus('Initializing...');
    
    try {
      // Initialize hierarchy data
      const hierarchyData = await DataInitializer.initializeHierarchyData();
      console.log('Hierarchy data:', hierarchyData);
      
      // Initialize dashboard data
      const dashboardData = await DataInitializer.initializeDashboardData({
        selectedBiller: 'all',
        selectedWarehouse: 'all',
        dateRange: '30d',
      });
      console.log('Dashboard data:', dashboardData);
      
      // Initialize analytics data
      const analyticsData = await DataInitializer.initializeAnalyticsData({
        type: 'revenue',
      });
      console.log('Analytics data:', analyticsData);
      
      setStatus('All data initialized successfully!');
      
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearCache = () => {
    DataInitializer.clearCache();
    setStatus('Cache cleared');
  };

  const getCacheStats = () => {
    const stats = DataInitializer.getCacheStats();
    console.log('Cache stats:', stats);
    setStatus(`Cache size: ${stats.size} entries`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Initialization Example</h1>
      <p className="mb-4">Status: {status}</p>
      
      <div className="space-x-2">
        <button
          onClick={initializeAllData}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Initialize All Data
        </button>
        <button
          onClick={clearCache}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          Clear Cache
        </button>
        <button
          onClick={getCacheStats}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Get Cache Stats
        </button>
      </div>
    </div>
  );
};

// ========================================
// EXAMPLE 4: Real-time Updates
// ========================================

const RealTimeExample: React.FC = () => {
  const [updates, setUpdates] = React.useState<string[]>([]);

  const setupRealTimeUpdates = () => {
    const unsubscribe = DataInitializer.setupRealtimeSync({
      onDashboardUpdate: (data) => {
        const message = `Dashboard updated at ${new Date().toLocaleTimeString()}`;
        setUpdates(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 updates
        console.log('Dashboard updated:', data);
      },
      onSalesUpdate: (data) => {
        const message = `Sales data updated at ${new Date().toLocaleTimeString()}`;
        setUpdates(prev => [message, ...prev.slice(0, 9)]);
        console.log('Sales updated:', data);
      },
      onCustomerUpdate: (data) => {
        const message = `Customer data updated at ${new Date().toLocaleTimeString()}`;
        setUpdates(prev => [message, ...prev.slice(0, 9)]);
        console.log('Customers updated:', data);
      },
    });

    return unsubscribe;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Real-time Updates Example</h1>
      <button
        onClick={setupRealTimeUpdates}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Start Real-time Updates
      </button>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Recent Updates</h2>
        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
          {updates.length === 0 ? (
            <p className="text-gray-600">No updates yet. Click "Start Real-time Updates" to begin.</p>
          ) : (
            <ul className="space-y-1">
              {updates.map((update, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {update}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// ========================================
// MAIN EXAMPLE COMPONENT
// ========================================

const CorporateDataEngineExample: React.FC = () => {
  const [activeExample, setActiveExample] = React.useState<'basic' | 'direct' | 'init' | 'realtime'>('basic');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          UHAI Africa Corporate Data Engine
        </h1>
        
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveExample('basic')}
              className={`px-4 py-2 rounded ${
                activeExample === 'basic' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Basic Dashboard
            </button>
            <button
              onClick={() => setActiveExample('direct')}
              className={`px-4 py-2 rounded ${
                activeExample === 'direct' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Direct API
            </button>
            <button
              onClick={() => setActiveExample('init')}
              className={`px-4 py-2 rounded ${
                activeExample === 'init' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Data Initialization
            </button>
            <button
              onClick={() => setActiveExample('realtime')}
              className={`px-4 py-2 rounded ${
                activeExample === 'realtime' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Real-time Updates
            </button>
          </div>
        </div>

        {/* Content */}
        <CorporateDataProvider>
          {activeExample === 'basic' && <BasicDashboardExample />}
          {activeExample === 'direct' && <DirectAPIExample />}
          {activeExample === 'init' && <DataInitializationExample />}
          {activeExample === 'realtime' && <RealTimeExample />}
        </CorporateDataProvider>
      </div>
    </div>
  );
};

export default CorporateDataEngineExample;

// Export individual examples for testing
export {
  BasicDashboardExample,
  DirectAPIExample,
  DataInitializationExample,
  RealTimeExample,
};