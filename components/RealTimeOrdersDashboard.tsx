import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeSync } from './RealTimeSyncProvider';
import {
  AreaChart,
  Area,
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
  LineChart,
  Line
} from 'recharts';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { format, subHours, subDays } from 'date-fns';

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  paymentMethod: 'card' | 'cash' | 'digital_wallet';
  deliveryTime?: Date;
}

interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersToday: number;
  revenueGrowth: number;
  orderGrowth: number;
  averageFulfillmentTime: number;
}

const statusColors = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444'
};

const priorityColors = {
  low: '#6b7280',
  medium: '#f59e0b',
  high: '#ef4444'
};

const RealTimeOrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Real-time sync
  const { data: realTimeData, isConnected } = useRealTimeSync({
    channel: 'orders',
    onMessage: handleRealTimeOrderUpdate
  });

  function handleRealTimeOrderUpdate(message: any) {
    if (message.type === 'ORDER_UPDATE') {
      setOrders(prev => {
        const updated = [...prev];
        const index = updated.findIndex(o => o.id === message.data.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], ...message.data };
        } else {
          updated.unshift(message.data);
        }
        return updated.slice(0, 100); // Keep only latest 100 orders
      });
    }
  }

  // Generate mock data for demonstration
  const generateMockData = useCallback(() => {
    const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const priorities: Order['priority'][] = ['low', 'medium', 'high'];
    const paymentMethods: Order['paymentMethod'][] = ['card', 'cash', 'digital_wallet'];
    const customerNames = [
      'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'David Johnson',
      'Lisa Garcia', 'James Miller', 'Jennifer Taylor', 'Robert Anderson', 'Emily Martinez'
    ];

    const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
      id: `ORD-${Date.now()}-${i}`,
      customerId: `CUST-${1000 + i}`,
      customerName: customerNames[i % customerNames.length],
      total: Math.floor(Math.random() * 500) + 50,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: Math.floor(Math.random() * 10) + 1,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      deliveryTime: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000) : undefined
    }));

    return mockOrders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, []);

  // Calculate metrics
  const calculateMetrics = useCallback((orderData: Order[]): OrderMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const ordersToday = orderData.filter(o => o.timestamp >= today).length;
    const ordersYesterday = orderData.filter(o => o.timestamp >= yesterday && o.timestamp < today).length;
    
    const completedToday = orderData.filter(o => o.status === 'delivered' && o.timestamp >= today).length;
    const completedYesterday = orderData.filter(o => o.status === 'delivered' && o.timestamp >= yesterday && o.timestamp < today).length;

    const totalRevenue = orderData.reduce((sum, o) => sum + o.total, 0);
    const totalRevenueYesterday = orderData
      .filter(o => o.timestamp >= yesterday && o.timestamp < today)
      .reduce((sum, o) => sum + o.total, 0);

    const avgOrderValue = orderData.length > 0 ? totalRevenue / orderData.length : 0;

    return {
      totalOrders: orderData.length,
      pendingOrders: orderData.filter(o => o.status === 'pending').length,
      completedOrders: orderData.filter(o => o.status === 'delivered').length,
      cancelledOrders: orderData.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      averageOrderValue: avgOrderValue,
      ordersToday,
      revenueGrowth: totalRevenueYesterday > 0 ? ((totalRevenue - totalRevenueYesterday) / totalRevenueYesterday) * 100 : 0,
      orderGrowth: ordersYesterday > 0 ? ((ordersToday - ordersYesterday) / ordersYesterday) * 100 : 0,
      averageFulfillmentTime: 2.5 // Mock average
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const mockOrders = generateMockData();
      setOrders(mockOrders);
      setMetrics(calculateMetrics(mockOrders));
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [generateMockData, calculateMetrics]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Prepare chart data
  const orderStatusData = Object.entries(
    orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ name: status, value: count }));

  const hourlyOrdersData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    return {
      hour: format(hour, 'HH:00'),
      orders: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 2000) + 500
    };
  });

  const paymentMethodData = Object.entries(
    orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([method, count]) => ({ name: method, value: count }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Live Updates Active' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.totalOrders}</p>
                  <div className="ml-2 flex items-center">
                    {metrics.orderGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metrics.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metrics.orderGrowth).toFixed(1)}%
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
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
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
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.pendingOrders}</p>
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
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${metrics.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Orders Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hourly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.name as keyof typeof statusColors]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {filteredOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${order.total}</p>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-2 py-1 text-xs rounded-full text-white"
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {order.status}
                    </span>
                    {order.priority === 'high' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RealTimeOrdersDashboard;