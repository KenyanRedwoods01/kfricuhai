import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeSync } from './RealTimeSyncProvider';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Users,
  Star,
  Gift,
  Crown,
  TrendingUp,
  TrendingDown,
  Award,
  Heart,
  Target,
  Calendar,
  CreditCard,
  ShoppingBag,
  Repeat,
  Download,
  Filter,
  RefreshCw,
  Zap,
  ThumbsUp,
  Trophy
} from 'lucide-react';
import { format, subDays, subWeeks } from 'date-fns';

interface LoyaltyCustomer {
  id: string;
  name: string;
  email: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  lifetimeValue: number;
  totalOrders: number;
  lastPurchase: Date;
  joinDate: Date;
  referralCount: number;
  engagementScore: number;
  categoryPreferences: string[];
  avgOrderValue: number;
  retentionRate: number;
  churnRisk: 'low' | 'medium' | 'high';
}

interface LoyaltyMetrics {
  totalMembers: number;
  activeMembers: number;
  newMembers24h: number;
  averagePoints: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  tierDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
  };
  averageLifetimeValue: number;
  retentionRate: number;
  referralRate: number;
  engagementScore: number;
  churnRate: number;
  pointsRedemptionRate: number;
}

const tierColors = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
  diamond: '#b9f2ff'
};

const tierPoints = {
  bronze: 1000,
  silver: 5000,
  gold: 15000,
  platinum: 50000,
  diamond: 100000
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const LoyaltyProgramDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([]);
  const [metrics, setMetrics] = useState<LoyaltyMetrics | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('lifetimeValue');
  const [loading, setLoading] = useState(true);

  // Real-time sync for loyalty updates
  const { data: realTimeData, isConnected } = useRealTimeSync({
    channel: 'loyalty',
    onMessage: handleRealTimeLoyaltyUpdate
  });

  function handleRealTimeLoyaltyUpdate(message: any) {
    if (message.type === 'LOYALTY_UPDATE') {
      setCustomers(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === message.data.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], ...message.data };
        }
        return updated;
      });
    }
  }

  // Generate mock loyalty data
  const generateMockCustomers = useCallback(() => {
    const names = [
      'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'David Johnson',
      'Lisa Garcia', 'James Miller', 'Jennifer Taylor', 'Robert Anderson', 'Emily Martinez',
      'Christopher Lee', 'Jessica White', 'Matthew Harris', 'Ashley Clark', 'Daniel Lewis',
      'Amanda Walker', 'Kevin Hall', 'Nicole Young', 'Ryan Allen', 'Michelle King'
    ];
    
    const tiers: LoyaltyCustomer['tier'][] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty'];
    
    const customers: LoyaltyCustomer[] = Array.from({ length: 100 }, (_, i) => {
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const lifetimeValue = tier === 'diamond' ? Math.random() * 20000 + 50000 :
                           tier === 'platinum' ? Math.random() * 10000 + 20000 :
                           tier === 'gold' ? Math.random() * 5000 + 10000 :
                           tier === 'silver' ? Math.random() * 2000 + 5000 :
                           Math.random() * 1000 + 1000;
      
      const totalOrders = Math.floor(lifetimeValue / (100 + Math.random() * 200));
      const joinDate = subDays(new Date(), Math.floor(Math.random() * 365));
      const lastPurchase = subDays(new Date(), Math.floor(Math.random() * 30));
      
      return {
        id: `CUST-${1000 + i}`,
        name: names[i % names.length] + (i > 19 ? ` ${Math.floor(i/20) + 1}` : ''),
        email: `user${i}@example.com`,
        tier,
        points: Math.floor(Math.random() * tierPoints[tier]),
        lifetimeValue: Math.round(lifetimeValue),
        totalOrders,
        lastPurchase,
        joinDate,
        referralCount: Math.floor(Math.random() * 10),
        engagementScore: Math.round(Math.random() * 100),
        categoryPreferences: categories.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1),
        avgOrderValue: Math.round(lifetimeValue / totalOrders || 0),
        retentionRate: Math.round((Math.random() * 40 + 60) * 10) / 10,
        churnRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      };
    });

    return customers.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }, []);

  // Calculate metrics
  const calculateMetrics = useCallback((customersData: LoyaltyCustomer[]): LoyaltyMetrics => {
    const totalMembers = customersData.length;
    const activeMembers = customersData.filter(c => {
      const daysSinceLastPurchase = (new Date().getTime() - c.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastPurchase <= 30;
    }).length;

    const tierDistribution = customersData.reduce((acc, customer) => {
      acc[customer.tier] = (acc[customer.tier] || 0) + 1;
      return acc;
    }, {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0
    });

    const averagePoints = customersData.reduce((sum, c) => sum + c.points, 0) / totalMembers;
    const totalPointsIssued = customersData.reduce((sum, c) => sum + c.points, 0);
    const totalPointsRedeemed = Math.floor(totalPointsIssued * 0.3); // Mock 30% redemption rate
    const averageLifetimeValue = customersData.reduce((sum, c) => sum + c.lifetimeValue, 0) / totalMembers;
    const retentionRate = customersData.reduce((sum, c) => sum + c.retentionRate, 0) / totalMembers;
    const referralRate = customersData.reduce((sum, c) => sum + c.referralCount, 0) / totalMembers;
    const engagementScore = customersData.reduce((sum, c) => sum + c.engagementScore, 0) / totalMembers;
    const churnRate = 100 - retentionRate;
    const pointsRedemptionRate = (totalPointsRedeemed / totalPointsIssued) * 100;

    // Mock new members (in real app, count join dates in last 24h)
    const newMembers24h = Math.floor(Math.random() * 10) + 1;

    return {
      totalMembers,
      activeMembers,
      newMembers24h,
      averagePoints: Math.round(averagePoints),
      totalPointsIssued,
      totalPointsRedeemed,
      tierDistribution,
      averageLifetimeValue: Math.round(averageLifetimeValue),
      retentionRate: Math.round(retentionRate * 10) / 10,
      referralRate: Math.round(referralRate * 10) / 10,
      engagementScore: Math.round(engagementScore),
      churnRate: Math.round(churnRate * 10) / 10,
      pointsRedemptionRate: Math.round(pointsRedemptionRate * 10) / 10
    };
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const mockCustomers = generateMockCustomers();
      setCustomers(mockCustomers);
      setMetrics(calculateMetrics(mockCustomers));
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [generateMockCustomers, calculateMetrics]);

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => tierFilter === 'all' || customer.tier === tierFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'lifetimeValue':
          return b.lifetimeValue - a.lifetimeValue;
        case 'points':
          return b.points - a.points;
        case 'engagement':
          return b.engagementScore - a.engagementScore;
        case 'retention':
          return b.retentionRate - a.retentionRate;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        default:
          return 0;
      }
    });

  // Prepare chart data
  const tierDistributionData = metrics ? Object.entries(metrics.tierDistribution).map(([tier, count]) => ({
    name: tier.charAt(0).toUpperCase() + tier.slice(1),
    value: count,
    percentage: ((count / metrics.totalMembers) * 100).toFixed(1)
  })) : [];

  const monthlyGrowthData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    return {
      month: format(month, 'MMM'),
      members: Math.floor(Math.random() * 50) + 100,
      points: Math.floor(Math.random() * 10000) + 50000,
      engagement: Math.floor(Math.random() * 30) + 60
    };
  });

  const engagementScoreData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return {
      day: format(day, 'EEE'),
      score: Math.floor(Math.random() * 20) + 70
    };
  });

  const churnRiskData = Object.entries(
    customers.reduce((acc, customer) => {
      acc[customer.churnRisk] = (acc[customer.churnRisk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([risk, count]) => ({
    name: risk.charAt(0).toUpperCase() + risk.slice(1),
    value: count,
    fill: risk === 'high' ? '#ef4444' : risk === 'medium' ? '#f59e0b' : '#10b981'
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
            {isConnected ? 'Live Loyalty Updates' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Tiers</option>
            <option value="diamond">Diamond</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="lifetimeValue">Sort by LTV</option>
            <option value="points">Sort by Points</option>
            <option value="engagement">Sort by Engagement</option>
            <option value="retention">Sort by Retention</option>
            <option value="orders">Sort by Orders</option>
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
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.totalMembers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{metrics.newMembers24h} today</p>
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
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Lifetime Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${metrics.averageLifetimeValue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Retention: {metrics.retentionRate}%</p>
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
                <Star className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metrics.totalPointsIssued.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600">
                  {metrics.pointsRedemptionRate.toFixed(1)}% redeemed
                </p>
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
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement Score</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.engagementScore}/100</p>
                <p className="text-sm text-green-600">Active: {metrics.activeMembers}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Member Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="members" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tier Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {tierDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={tierColors[entry.name.toLowerCase() as keyof typeof tierColors] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Churn Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Churn Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={churnRiskData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {churnRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Members Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Loyalty Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  LTV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Retention
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Churn Risk
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.slice(0, 15).map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                      style={{ backgroundColor: tierColors[customer.tier] }}
                    >
                      {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${customer.lifetimeValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${customer.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{customer.engagementScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${customer.retentionRate >= 80 ? 'text-green-600' : customer.retentionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {customer.retentionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.churnRisk === 'low' ? 'bg-green-100 text-green-800' :
                      customer.churnRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {customer.churnRisk}
                    </span>
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

export default LoyaltyProgramDashboard;