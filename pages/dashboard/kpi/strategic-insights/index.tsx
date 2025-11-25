import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Brain,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Target,
  AlertTriangle
} from 'lucide-react';
import { AdvancedLayout } from '../../../components/AdvancedLayout';

const StrategicInsightsKPI: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  // Phase 3: Strategic Intelligence KPIs
  const strategicInsightsKPIs = [
    {
      key: 'return_on_investment',
      title: 'Return on Investment',
      value: 22.1,
      unit: '%',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-yellow-500',
      interpretation: 'Excellent ROI performance - Strong investment returns',
      trend: 'up' as const,
      target: 25,
      chartData: generateMockChartData(22.1, 7)
    },
    {
      key: 'customer_churn_rate',
      title: 'Customer Churn Rate',
      value: 6.8,
      unit: '%',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      interpretation: 'Low churn rate - Excellent customer satisfaction',
      trend: 'down' as const,
      target: 5,
      chartData: generateMockChartData(6.8, 7)
    },
    {
      key: 'predictive_analytics_90_days',
      title: 'Predictive Analytics (90 days)',
      value: 375000,
      unit: 'currency',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-violet-500',
      interpretation: 'Strong predictive insights - Positive growth trajectory',
      trend: 'up' as const,
      chartData: generateMockChartData(375000, 7)
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
      title="Strategic Intelligence - Long-term Planning"
      description="Strategic KPIs for long-term planning and competitive advantage analysis"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Brain className="w-10 h-10 mr-4" />
                Phase 3: Strategic Intelligence
              </h1>
              <p className="text-purple-100 text-lg">
                Strategic KPIs for long-term planning and competitive advantage analysis
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
                Strategic Intelligence Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Long-term strategic insights for sustainable competitive advantage
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Current Year</option>
              </select>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strategicInsightsKPIs.map((kpi) => (
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
                    <ArrowDown className="w-5 h-5 text-green-500" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 
                    kpi.trend === 'down' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}{((Math.abs(kpi.value - 20) / 20) * 100).toFixed(1)}%
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

        {/* Strategic Planning Section */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-lg bg-purple-500 text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Strategic Planning & Future Roadmap
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Long-term strategic initiatives and competitive intelligence
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Strategic Goals
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Achieve 25%+ ROI by Q4 2025</li>
                <li>• Reduce churn to below 5%</li>
                <li>• Expand predictive capabilities</li>
                <li>• Build competitive moats</li>
                <li>• Drive sustainable growth</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Strategic Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Strategic Score:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Market Position:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">Top 10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Innovation Index:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">9.2/10</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-violet-500" />
                AI Strategic Insights
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Market expansion opportunities identified</li>
                <li>• Competitive landscape analysis complete</li>
                <li>• Risk mitigation strategies developed</li>
                <li>• Growth trajectory projections positive</li>
                <li>• Innovation pipeline optimized</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 90-Day Predictive Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-violet-500" />
            90-Day Predictive Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                {formatCurrency(375000)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                +18.5%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Projection</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                94%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confidence Level</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
            <p className="text-sm text-violet-800 dark:text-violet-200">
              <strong>AI Insight:</strong> Based on historical patterns and market trends, the business is positioned for significant growth over the next 90 days. Key drivers include seasonal demand increases, new product launches, and expanded market reach.
            </p>
          </div>
        </div>
      </div>
    </AdvancedLayout>
  );
};

export default StrategicInsightsKPI;