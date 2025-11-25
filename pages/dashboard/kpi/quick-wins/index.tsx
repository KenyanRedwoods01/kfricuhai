import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity
} from 'lucide-react';
import { AdvancedLayout } from '../../../components/AdvancedLayout';

const QuickWinsKPI: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  // Phase 1: High-Impact Quick Wins KPIs
  const quickWinsKPIs = [
    {
      key: 'gross_profit_margin',
      title: 'Gross Profit Margin',
      value: 25.5,
      unit: '%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-500',
      interpretation: 'Excellent profitability - Strong pricing power and cost control',
      trend: 'up' as const,
      target: 30,
      chartData: generateMockChartData(25.5, 7)
    },
    {
      key: 'sales_growth_rate',
      title: 'Sales Growth Rate',
      value: 18.7,
      unit: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      interpretation: 'Strong growth momentum - Market expansion successful',
      trend: 'up' as const,
      target: 20,
      chartData: generateMockChartData(18.7, 7)
    },
    {
      key: 'inventory_turnover',
      title: 'Inventory Turnover',
      value: 5.2,
      unit: 'times',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-purple-500',
      interpretation: 'Excellent inventory management - Efficient stock turnover',
      trend: 'up' as const,
      target: 6,
      chartData: generateMockChartData(5.2, 7)
    },
    {
      key: 'customer_lifetime_value',
      title: 'Customer Lifetime Value',
      value: 4850,
      unit: 'currency',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-500',
      interpretation: 'High-value customers - Focus on retention strategies',
      trend: 'up' as const,
      target: 5000,
      chartData: generateMockChartData(4850, 7)
    }
  ];

  function generateMockChartData(baseValue: number, days: number = 7) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add some variation to simulate realistic data
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const value = baseValue * (1 + variation);
      
      data.push({
        date: date.toLocaleDateString(),
        value: Math.max(0, value)
      });
    }
    
    return data;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <AdvancedLayout 
      title="KPI Quick Wins - High-Impact Metrics"
      description="Immediate impact KPIs that provide quick insights into business performance"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Zap className="w-10 h-10 mr-4" />
                Phase 1: High-Impact Quick Wins
              </h1>
              <p className="text-green-100 text-lg">
                Immediate impact KPIs that provide quick insights into business performance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Target className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quick Wins Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                High-impact metrics for immediate business improvement
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Current Year</option>
              </select>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {quickWinsKPIs.map((kpi) => (
            <div 
              key={kpi.key}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`${kpi.color} text-white p-3 rounded-lg`}>
                  {kpi.icon}
                </div>
                <div className="flex items-center space-x-2">
                  {kpi.trend === 'up' ? (
                    <ArrowUp className="w-5 h-5 text-green-500" />
                  ) : kpi.trend === 'down' ? (
                    <ArrowDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 
                    kpi.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    +{((kpi.value / 22.5 - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {kpi.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {kpi.unit === 'currency' ? formatCurrency(kpi.value) : 
                     kpi.unit === 'percentage' ? formatPercentage(kpi.value) :
                     kpi.value.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">{kpi.unit}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {kpi.interpretation}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Target:</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {kpi.unit === 'currency' ? formatCurrency(kpi.target) : kpi.target}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-lg bg-green-500 text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quick Wins Action Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Immediate actions to maximize these high-impact metrics
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Performance Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Overall Score:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Excellent (89%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Targets Met:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">3 of 4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Trend Direction:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">All Improving ↗</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Next Actions
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Optimize pricing strategy to improve gross margin</li>
                <li>• Expand customer acquisition channels</li>
                <li>• Implement inventory optimization algorithms</li>
                <li>• Launch customer loyalty program</li>
                <li>• Review and adjust targets quarterly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdvancedLayout>
  );
};

export default QuickWinsKPI;