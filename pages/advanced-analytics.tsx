import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SWRConfig } from 'swr';
import DashboardBuilder from '../components/DashboardBuilder';
import KPIAnalyticsDashboard from '../components/KPIAnalyticsDashboard';
import RealTimeSyncProvider from '../components/RealTimeSyncProvider';
import PerformanceMonitor from '../components/PerformanceMonitor';
import RealTimeOrdersDashboard from '../components/RealTimeOrdersDashboard';
import ProductSalesMonitor from '../components/ProductSalesMonitor';
import RevenueAnalysisDashboard from '../components/RevenueAnalysisDashboard';
import LoyaltyProgramDashboard from '../components/LoyaltyProgramDashboard';
import NotificationSystem from '../components/NotificationSystem';
import Layout from '../components/Layout';
import { BarChart3, TrendingUp, Users, Bell, Settings } from 'lucide-react';

const queryClient = new QueryClient();

interface TabOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

const tabOptions: TabOption[] = [
  {
    id: 'analytics',
    name: 'KPI Analytics',
    icon: BarChart3,
    description: 'Advanced analytics dashboard with real-time data'
  },
  {
    id: 'orders',
    name: 'Real-time Orders',
    icon: TrendingUp,
    description: 'Live order tracking and management'
  },
  {
    id: 'sales',
    name: 'Product Sales',
    icon: BarChart3,
    description: 'Product performance and sales monitoring'
  },
  {
    id: 'revenue',
    name: 'Revenue Analysis',
    icon: TrendingUp,
    description: 'Revenue trends and financial insights'
  },
  {
    id: 'loyalty',
    name: 'Loyalty Program',
    icon: Users,
    description: 'Customer loyalty and retention metrics'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Customizable notification system'
  },
  {
    id: 'builder',
    name: 'Dashboard Builder',
    icon: Settings,
    description: 'Create custom dashboard layouts'
  }
];

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);

  useEffect(() => {
    // Check for performance mode from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('performance') === 'true') {
      setIsPerformanceMode(true);
    }
  }, []);

  const renderActiveDashboard = () => {
    switch (activeTab) {
      case 'analytics':
        return <KPIAnalyticsDashboard />;
      case 'orders':
        return <RealTimeOrdersDashboard />;
      case 'sales':
        return <ProductSalesMonitor />;
      case 'revenue':
        return <RevenueAnalysisDashboard />;
      case 'loyalty':
        return <LoyaltyProgramDashboard />;
      case 'notifications':
        return <NotificationSystem />;
      case 'builder':
        return <DashboardBuilder />;
      default:
        return <KPIAnalyticsDashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          fetcher: (url: string) => fetch(url).then((res) => res.json()),
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          refreshInterval: 5000, // Refresh every 5 seconds for real-time data
          dedupingInterval: 2000, // Deduplicate requests for 2 seconds
          errorRetryCount: 3,
          errorRetryInterval: 5000,
        }}
      >
        <RealTimeSyncProvider>
          <Head>
            <title>Advanced Analytics Dashboard</title>
            <meta name="description" content="Comprehensive KPI analytics with real-time data visualization" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Advanced Analytics Dashboard
                      </h1>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Real-time insights and comprehensive KPI monitoring
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Live Data</span>
                      </div>
                      
                      <button
                        onClick={() => setIsPerformanceMode(!isPerformanceMode)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isPerformanceMode
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Performance Mode
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex space-x-8 overflow-x-auto">
                    {tabOptions.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Performance Monitor (if enabled) */}
              {isPerformanceMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <PerformanceMonitor compact />
                  </div>
                </motion.div>
              )}

              {/* Dashboard Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tabOptions.find(tab => tab.id === activeTab)?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tabOptions.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>

                {renderActiveDashboard()}
              </motion.div>
            </div>
          </Layout>
        </RealTimeSyncProvider>
      </SWRConfig>
    </QueryClientProvider>
  );
}