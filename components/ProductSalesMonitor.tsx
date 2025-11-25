import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeSync } from './RealTimeSyncProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Star,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  stock: number;
  rating: number;
  reviews: number;
  lastSold: Date;
  trend: 'up' | 'down' | 'stable';
  change24h: number;
}

interface ProductMetrics {
  totalProducts: number;
  totalRevenue: number;
  topSellingProduct: string;
  averageRating: number;
  productsLowStock: number;
  newProducts24h: number;
  revenueGrowth: number;
  salesGrowth: number;
  conversionRate: number;
  profitMargin: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const ProductSalesMonitor: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sales');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Real-time sync for product updates
  const { data: realTimeData, isConnected } = useRealTimeSync({
    channel: 'products',
    onMessage: handleRealTimeProductUpdate
  });

  function handleRealTimeProductUpdate(message: any) {
    if (message.type === 'PRODUCT_UPDATE') {
      setProducts(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.id === message.data.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], ...message.data };
        }
        return updated;
      });
    }
  }

  // Generate mock product data
  const generateMockProducts = useCallback(() => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty'];
    const productNames = [
      'Premium Wireless Headphones', 'Smartphone Case', 'Running Shoes', 'Yoga Mat',
      'Coffee Maker', 'Bluetooth Speaker', 'Fitness Tracker', 'Backpack',
      'Tablet Stand', 'Water Bottle', 'Desk Lamp', 'Wireless Charger',
      'Gaming Mouse', 'Phone Stand', 'Laptop Sleeve', 'USB Cable',
      'Power Bank', 'Earbuds Case', 'Car Charger', 'Screen Protector',
      'Bluetooth Tracker', 'Key Finder', 'Smart Watch', 'Fitness Band'
    ];

    const products: Product[] = Array.from({ length: 24 }, (_, i) => ({
      id: `PROD-${1000 + i}`,
      name: productNames[i % productNames.length] + (i > 23 ? ` ${Math.floor(i/24) + 1}` : ''),
      category: categories[i % categories.length],
      price: Math.floor(Math.random() * 200) + 20,
      sales: Math.floor(Math.random() * 1000) + 50,
      revenue: 0, // Will be calculated
      stock: Math.floor(Math.random() * 200) + 10,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      reviews: Math.floor(Math.random() * 500) + 10,
      lastSold: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
      change24h: (Math.random() - 0.5) * 40 // -20% to +20%
    }));

    // Calculate revenue for each product
    products.forEach(product => {
      product.revenue = product.sales * product.price;
    });

    return products.sort((a, b) => b.sales - a.sales);
  }, []);

  // Calculate metrics
  const calculateMetrics = useCallback((productsData: Product[]): ProductMetrics => {
    const totalRevenue = productsData.reduce((sum, p) => sum + p.revenue, 0);
    const totalSales = productsData.reduce((sum, p) => sum + p.sales, 0);
    const avgRating = productsData.reduce((sum, p) => sum + p.rating, 0) / productsData.length;
    const lowStockProducts = productsData.filter(p => p.stock < 20).length;
    
    // Mock growth calculations (in real app, compare with previous period)
    const revenueGrowth = (Math.random() - 0.3) * 20; // -6% to +14%
    const salesGrowth = (Math.random() - 0.4) * 30; // -12% to +18%
    
    return {
      totalProducts: productsData.length,
      totalRevenue,
      topSellingProduct: productsData[0]?.name || 'N/A',
      averageRating: avgRating,
      productsLowStock: lowStockProducts,
      newProducts24h: Math.floor(Math.random() * 5) + 1,
      revenueGrowth,
      salesGrowth,
      conversionRate: Math.random() * 10 + 5, // 5-15%
      profitMargin: Math.random() * 30 + 20 // 20-50%
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      setMetrics(calculateMetrics(mockProducts));
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 45000); // Refresh every 45 seconds
    return () => clearInterval(interval);
  }, [generateMockProducts, calculateMetrics]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => categoryFilter === 'all' || product.category === categoryFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.sales - a.sales;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return b.price - a.price;
        case 'stock':
          return a.stock - b.stock; // Low stock first
        default:
          return 0;
      }
    });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Prepare chart data
  const categorySalesData = Object.entries(
    products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.sales;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, sales]) => ({ name: category, sales, revenue: products.filter(p => p.category === category).reduce((sum, p) => sum + p.revenue, 0) }));

  const topProductsData = products.slice(0, 10).map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    sales: product.sales,
    revenue: product.revenue,
    rating: product.rating
  }));

  const stockLevelData = products.map(product => ({
    name: product.name.substring(0, 10),
    stock: product.stock,
    sales: product.sales,
    lowStock: product.stock < 20
  }));

  const trendData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    sales: Math.floor(Math.random() * 100) + 20,
    revenue: Math.floor(Math.random() * 5000) + 1000
  }));

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
            {isConnected ? 'Live Product Updates' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="sales">Sort by Sales</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock (Low First)</option>
          </select>
          
          <button className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            <Download className="w-4 h-4 inline mr-1" />
            Export
          </button>
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
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.totalProducts}</p>
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
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.averageRating.toFixed(1)}</p>
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
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Items</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.productsLowStock}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sales Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products by Sales */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top 10 Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stock vs Sales Correlation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Stock vs Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stock" name="Stock" />
              <YAxis dataKey="sales" name="Sales" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="sales" fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 24-Hour Sales Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">24-Hour Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Product List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm ${product.stock < 20 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                        {product.stock}
                      </span>
                      {product.stock < 20 && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">{product.rating}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : product.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    )}
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

export default ProductSalesMonitor;