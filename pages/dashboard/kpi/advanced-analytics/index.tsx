import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Brain
} from 'lucide-react';
import { AdvancedLayout } from '../../../components/AdvancedLayout';

const AdvancedAnalyticsKPI: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  // Phase 2: Advanced Analytics KPIs
  const advancedAnalyticsKPIs = [
    {
      key: 'net_profit_margin',
      title: 'Net Profit Margin',
      value: 15.3,
      unit: '%',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-indigo-500',
      interpretation: 'Excellent overall profitability - Strong financial health',
      trend: 'up' as const,
      target: 18,
      chartData: generateMockChartData(15.3, 7)
    },
    {
      key: 'customer_acquisition_cost',
      title: 'Customer Acquisition Cost',
      value: 245,
      unit: 'currency',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-emerald-500',
      interpretation: 'Efficient acquisition costs - Good marketing ROI',
      trend: 'down' as const,
      target: 200,
      chartData: generateMockChartData(245, 7)
    },
    {
      key: 'customer_retention_rate',
      title: 'Customer Retention Rate',
      value: 72,
      unit: '%',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-emerald-500',
      interpretation: 'Good customer loyalty - Strong retention performance',
      trend: 'up' as const,
      target: 80,
      chartData: generateMockChartData(72, 7)
    },
    {
      key: 'sales_forecast_30_days',
      title: 'Sales Forecast (30 days)',
      value: 125000,
      unit: 'currency',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-cyan-500',
      interpretation: 'Positive sales projection - Strong pipeline momentum',
      trend: 'up' as const,
      chartData: generateMockChartData(125000, 7)
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
      title="Advanced Analytics - Operational Insights"
      description="Advanced KPIs providing deeper insights into business operations and performance"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Target className="w-10 h-10 mr-4" />
                Phase 2: Advanced Analytics
              </h1>
              <p className="text-blue-100 text-lg">
                Advanced KPIs providing deeper insights into business operations and performance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Advanced Analytics Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Deep operational insights for strategic decision making
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Current Year</option>
              </select>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {advancedAnalyticsKPIs.map((kpi) => (
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
                    kpi.trend === 'down' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}{((Math.abs(kpi.value - 280) / 280) * 100).toFixed(1)}%
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
                {kpi.target && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Target:</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {kpi.unit === 'currency' ? formatCurrency(kpi.target) : kpi.target}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Insights & Recommendations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Data-driven insights for operational optimization
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Growth Opportunities
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Optimize pricing strategies for better margins</li>
                <li>• Reduce customer acquisition costs by 15%</li>
                <li>• Improve retention rate to 80%+</li>
                <li>• Enhance sales forecasting accuracy</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Analytics Score:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Insights Generated:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy Rate:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">94%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                AI Recommendations
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Implement dynamic pricing model</li>
                <li>• Launch retention campaign for high-value customers</li>
                <li>• Optimize marketing channels based on CAC data</li>
                <li>• Enhance forecasting with seasonal adjustments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdvancedLayout>
  );
};

export default AdvancedAnalyticsKPI;