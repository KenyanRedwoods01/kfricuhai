import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Target,
  Zap,
  Brain,
  Settings,
  HelpCircle,
  ChevronRight,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { AdvancedLayout } from '../components/AdvancedLayout';
import { AdvancedChart } from '../components/AdvancedChart';
import { useKpi } from '../contexts/KpiContext';
import { formatValue, generateMockData } from '../lib/utils';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { state } = useKpi();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [quickStats, setQuickStats] = useState({
    totalRevenue: 0,
    activeCustomers: 0,
    ordersToday: 0,
    pendingTasks: 5
  });

  // Set welcome message based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setWelcomeMessage('Good morning');
    else if (hour < 18) setWelcomeMessage('Good afternoon');
    else setWelcomeMessage('Good evening');
  }, []);

  // Mock data for demonstration
  useEffect(() => {
    setQuickStats({
      totalRevenue: 125000,
      activeCustomers: 1250,
      ordersToday: 45,
      pendingTasks: 8
    });
  }, []);

  // Navigation shortcuts
  const quickActions = [
    {
      title: 'Advanced Analytics',
      description: 'Real-time orders, sales & revenue',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-indigo-500',
      onClick: () => router.push('/advanced-analytics')
    },
    {
      title: 'View All KPIs',
      description: 'Complete KPI dashboard',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-blue-500',
      onClick: () => router.push('/dashboard/kpi-advanced')
    },
    {
      title: 'Phase 1: Quick Wins',
      description: 'High-impact metrics',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-green-500',
      onClick: () => router.push('/dashboard/kpi/quick-wins')
    },
    {
      title: 'Phase 2: Analytics',
      description: 'Advanced insights',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-purple-500',
      onClick: () => router.push('/dashboard/kpi/advanced-analytics')
    },
    {
      title: 'Phase 3: Intelligence',
      description: 'Strategic planning',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-orange-500',
      onClick: () => router.push('/dashboard/kpi/strategic-insights')
    }
  ];

  // Generate chart data
  const revenueChartData = generateMockData(125000, 7, 0.15);
  const customerChartData = generateMockData(1250, 7, 0.08);
  const orderChartData = generateMockData(45, 7, 0.25);

  // System status indicators
  const systemStatus = [
    {
      name: 'Database Connection',
      status: 'healthy',
      uptime: '99.9%'
    },
    {
      name: 'API Response Time',
      status: 'healthy',
      uptime: '< 200ms'
    },
    {
      name: 'Data Sync',
      status: 'healthy',
      uptime: 'Real-time'
    },
    {
      name: 'Backup Status',
      status: 'warning',
      uptime: 'Last: 2h ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <AdvancedLayout
      title="Dashboard - KPI Business Intelligence"
      description="Main dashboard overview with key metrics and navigation"
    >
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {welcomeMessage}, Welcome Back! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Your business intelligence dashboard is ready. Last updated: {state.lastUpdated?.toLocaleString() || 'Loading...'}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatValue(quickStats.totalRevenue, 'currency')}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+12.5% from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quickStats.activeCustomers.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+8.2% growth rate</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Orders Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quickStats.ordersToday}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 dark:text-blue-400">Updated in real-time</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quickStats.pendingTasks}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm text-orange-600 dark:text-orange-400">Requires attention</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${action.color} text-white p-3 rounded-lg`}>
                    {action.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdvancedChart
            type="area"
            data={revenueChartData}
            title="Revenue Trends"
            subtitle="Last 7 days performance"
            height={300}
            formatValue={(value) => formatValue(value, 'currency')}
            theme="light"
            animated={true}
            gradient={true}
          />
          
          <AdvancedChart
            type="line"
            data={customerChartData}
            title="Customer Growth"
            subtitle="Active customer trends"
            height={300}
            theme="light"
            animated={true}
          />
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.uptime}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">KPI Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white">Gross Profit Margin</span>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">25.5%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white">Sales Growth Rate</span>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">+18.7%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white">Inventory Turnover</span>
                </div>
                <span className="font-semibold text-purple-600 dark:text-purple-400">5.2x</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white">Customer LTV</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">$4,850</span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Help & Support</h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/dashboard/help')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">Documentation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900 dark:text-white">Dashboard Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/api-documentation')}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-900 dark:text-white">API Documentation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>Advanced KPI Dashboard v2.0 • Built with Next.js & React • Real-time Business Intelligence</p>
        </div>
      </div>
    </AdvancedLayout>
  );
};

export default Dashboard;