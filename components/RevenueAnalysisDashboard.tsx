import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeSync } from './RealTimeSyncProvider';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CreditCard,
  Wallet,
  Building2
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface RevenueData {
  date: string;
  revenue: number;
  profit: number;
  costs: number;
  orders: number;
  avgOrderValue: number;
  target: number;
  growth: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  totalProfit: number;
  totalCosts: number;
  revenueGrowth: number;
  profitGrowth: number;
  avgOrderValue: number;
  revenueTarget: number;
  targetAchievement: number;
  monthlyRecurringRevenue: number;
  customerLifetimeValue: number;
  churnRate: number;
  grossMargin: number;
  netMargin: number;
  cashFlow: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const RevenueAnalysisDashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [viewType, setViewType] = useState<'revenue' | 'profit' | 'comparison'>('revenue');
  const [loading, setLoading] = useState(true);

  // Real-time sync for revenue updates
  const { data: realTimeData, isConnected } = useRealTimeSync({
    channel: 'revenue',
    onMessage: handleRealTimeRevenueUpdate
  });

  function handleRealTimeRevenueUpdate(message: any) {
    if (message.type === 'REVENUE_UPDATE') {
      setRevenueData(prev => {
        const updated = [...prev];
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayIndex = updated.findIndex(d => d.date === today);
        
        if (todayIndex !== -1) {
          updated[todayIndex] = { ...updated[todayIndex], ...message.data };
        }
        return updated;
      });
    }
  }

  // Generate mock revenue data
  const generateRevenueData = useCallback((days: number) => {
    const data: RevenueData[] = [];
    let baseRevenue = 5000;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Add some randomness and trends
      const trend = Math.sin(i / 7) * 0.2 + Math.cos(i / 14) * 0.1; // Weekly and bi-weekly cycles
      const randomFactor = (Math.random() - 0.5) * 0.3;
      const revenue = Math.max(0, baseRevenue * (1 + trend + randomFactor));
      
      const costs = revenue * (0.3 + Math.random() * 0.2); // 30-50% of revenue
      const profit = revenue - costs;
      const orders = Math.floor(revenue / (50 + Math.random() * 50)); // Orders based on revenue
      const avgOrderValue = orders > 0 ? revenue / orders : 0;
      const target = baseRevenue * 1.1; // 10% above base
      const growth = i === days - 1 ? 0 : ((revenue - data[data.length - 1]?.revenue || 0) / (data[data.length - 1]?.revenue || 1)) * 100;
      
      data.push({
        date: dateStr,
        revenue: Math.round(revenue),
        profit: Math.round(profit),
        costs: Math.round(costs),
        orders,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        target: Math.round(target),
        growth: Math.round(growth * 100) / 100
      });
      
      baseRevenue = revenue; // Update base for next iteration
    }
    
    return data;
  }, []);

  // Calculate metrics
  const calculateMetrics = useCallback((data: RevenueData[]): RevenueMetrics => {
    if (data.length === 0) {
      return {
        totalRevenue: 0,
        totalProfit: 0,
        totalCosts: 0,
        revenueGrowth: 0,
        profitGrowth: 0,
        avgOrderValue: 0,
        revenueTarget: 0,
        targetAchievement: 0,
        monthlyRecurringRevenue: 0,
        customerLifetimeValue: 0,
        churnRate: 0,
        grossMargin: 0,
        netMargin: 0,
        cashFlow: 0
      };
    }

    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
    const totalCosts = data.reduce((sum, d) => sum + d.costs, 0);
    const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (compare with previous period)
    const midPoint = Math.floor(data.length / 2);
    const currentPeriod = data.slice(midPoint);
    const previousPeriod = data.slice(0, midPoint);
    
    const currentRevenue = currentPeriod.reduce((sum, d) => sum + d.revenue, 0);
    const previousRevenue = previousPeriod.reduce((sum, d) => sum + d.revenue, 0);
    const currentProfit = currentPeriod.reduce((sum, d) => sum + d.profit, 0);
    const previousProfit = previousPeriod.reduce((sum, d) => sum + d.profit, 0);

    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const profitGrowth = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0;

    const totalTarget = data.reduce((sum, d) => sum + d.target, 0);
    const targetAchievement = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

    // Mock additional metrics
    const grossMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const netMargin = totalRevenue > 0 ? ((totalProfit * 0.8) / totalRevenue) * 100 : 0; // Assume 20% operational costs

    return {
      totalRevenue,
      totalProfit,
      totalCosts,
      revenueGrowth,
      profitGrowth,
      avgOrderValue,
      revenueTarget: totalTarget,
      targetAchievement,
      monthlyRecurringRevenue: totalRevenue * 12 / data.length * 30, // Extrapolate to monthly
      customerLifetimeValue: avgOrderValue * 12, // Mock CLV
      churnRate: Math.random() * 10 + 2, // 2-12%
      grossMargin,
      netMargin,
      cashFlow: totalProfit * 0.7 // Assume 70% of profit is cash flow
    };
  }, []);

  // Load data based on time range
  const loadData = useCallback(() => {
    setLoading(true);
    let days = 30;
    switch (timeRange) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      case '1y':
        days = 365;
        break;
    }
    
    const data = generateRevenueData(days);
    setRevenueData(data);
    setMetrics(calculateMetrics(data));
    setLoading(false);
  }, [timeRange, generateRevenueData, calculateMetrics]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Revenue by category data (mock)
  const revenueByCategory = [
    { name: 'Product Sales', value: 60, amount: metrics ? metrics.totalRevenue * 0.6 : 0 },
    { name: 'Services', value: 25, amount: metrics ? metrics.totalRevenue * 0.25 : 0 },
    { name: 'Subscriptions', value: 10, amount: metrics ? metrics.totalRevenue * 0.10 : 0 },
    { name: 'Other', value: 5, amount: metrics ? metrics.totalRevenue * 0.05 : 0 }
  ];

  // Monthly comparison data
  const monthlyComparison = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    return {
      month: format(month, 'MMM'),
      revenue: Math.floor(Math.random() * 50000) + 100000,
      target: Math.floor(Math.random() * 20000) + 120000,
      profit: Math.floor(Math.random() * 20000) + 30000
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Live Revenue Tracking' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewType('revenue')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'revenue'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewType('profit')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'profit'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Profit
            </button>
            <button
              onClick={() => setViewType('comparison')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'comparison'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Comparison
            </button>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <button className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            <Download className="w-4 h-4 inline mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                  <div className="ml-2 flex items-center">
                    {metrics.revenueGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metrics.revenueGrowth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Achievement</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {metrics.targetAchievement.toFixed(1)}%
                  </p>
                  <div className="ml-2">
                    {metrics.targetAchievement >= 100 ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${(metrics.totalProfit * 0.8).toLocaleString()}
                  </p>
                  <div className="ml-2 flex items-center">
                    {metrics.profitGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metrics.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metrics.profitGrowth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${metrics.avgOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Secondary Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Margin</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{metrics.grossMargin.toFixed(1)}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Margin</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{metrics.netMargin.toFixed(1)}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MRR</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ${Math.round(metrics.monthlyRecurringRevenue).toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cash Flow</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ${Math.round(metrics.cashFlow).toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {viewType === 'revenue' ? 'Revenue Trend' : viewType === 'profit' ? 'Profit Trend' : 'Revenue vs Profit'}
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md">
                {timeRange}
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            {viewType === 'comparison' ? (
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" />
                <Area type="monotone" dataKey="profit" fill="#10b981" fillOpacity={0.3} stroke="#10b981" />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" />
              </ComposedChart>
            ) : viewType === 'revenue' ? (
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            ) : (
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
              <Bar dataKey="target" fill="#f59e0b" />
              <Bar dataKey="profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Revenue Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Revenue Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Costs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Achievement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {revenueData.slice(-10).reverse().map((day, index) => (
                <tr key={day.date} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {format(new Date(day.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${day.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                    ${day.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    ${day.costs.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {day.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${day.avgOrderValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${day.target.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm ${day.revenue >= day.target ? 'text-green-600' : 'text-red-600'}`}>
                        {((day.revenue / day.target) * 100).toFixed(1)}%
                      </span>
                      {day.revenue >= day.target ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 ml-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueAnalysisDashboard;