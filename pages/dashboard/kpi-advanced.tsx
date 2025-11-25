import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share2,
  Filter,
  Settings,
  RefreshCw,
  Zap,
  Brain,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

import { AdvancedLayout } from '../../components/AdvancedLayout';
import { AdvancedKpiCard } from '../../components/AdvancedKpiCard';
import { AdvancedChart } from '../../components/AdvancedChart';
import { useKpi } from '../../contexts/KpiContext';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { useDataCache } from '../../hooks/useAutoRefresh';

interface KpiData {
  phase_1: {
    gross_profit_margin: number;
    sales_growth_rate: number;
    inventory_turnover: number;
    customer_lifetime_value: number;
  };
  phase_2: {
    net_profit_margin: number;
    customer_acquisition_cost: number;
    customer_retention_rate: number;
    sales_forecast_30_days: number;
  };
  phase_3: {
    return_on_investment: number;
    customer_churn_rate: number;
    predictive_analytics_90_days: any;
  };
  period: {
    start_date: string;
    end_date: string;
    generated_at: string;
  };
}

interface PhaseData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  kpis: Array<{
    key: string;
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    interpretation: string;
    trend: 'up' | 'down' | 'stable';
    previousValue?: number;
    targetValue?: number;
    chartData?: Array<{ date: string; value: number }>;
  }>;
}

const KPI_DASHBOARD: React.FC = () => {
  const { state, actions } = useKpi();
  const { isRefreshing, lastUpdateTime, error: refreshError } = useAutoRefresh({
    enabled: true,
    interval: 300000, // 5 minutes
  });
  
  const { saveToCache, getFromCache } = useDataCache();
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['phase_1', 'phase_2', 'phase_3']);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load cached data on mount
  useEffect(() => {
    const cachedData = getFromCache('kpi_dashboard');
    if (cachedData) {
      actions.setData(cachedData);
    } else {
      actions.refreshData();
    }
  }, []);

  // Cache data when it changes
  useEffect(() => {
    if (state.data) {
      saveToCache('kpi_dashboard', state.data);
    }
  }, [state.data, saveToCache]);

  // Handle period change
  useEffect(() => {
    if (autoRefresh) {
      actions.setPeriod(selectedPeriod);
      actions.refreshData();
    }
  }, [selectedPeriod, autoRefresh, actions]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Generate mock chart data for demonstration
  const generateChartData = (baseValue: number, days: number = 7) => {
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
  };

  // Mock previous values for comparison
  const mockPreviousValues = {
    gross_profit_margin: 22.5,
    sales_growth_rate: 15.2,
    inventory_turnover: 4.2,
    customer_lifetime_value: 4200,
    net_profit_margin: 12.8,
    customer_acquisition_cost: 280,
    customer_retention_rate: 68,
    return_on_investment: 18.5,
    customer_churn_rate: 8.2
  };

  // Define phases data
  const phasesData: PhaseData[] = [
    {
      id: 'phase_1',
      title: 'Phase 1: High-Impact Quick Wins',
      description: 'Immediate impact KPIs that provide quick insights into business performance',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      kpis: [
        {
          key: 'gross_profit_margin',
          title: 'Gross Profit Margin',
          value: state.data?.phase_1?.gross_profit_margin || 25.5,
          unit: '%',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'bg-blue-500',
          interpretation: 'Excellent profitability - Strong pricing power and cost control',
          trend: 'up',
          previousValue: mockPreviousValues.gross_profit_margin,
          targetValue: 30,
          chartData: generateChartData(25.5)
        },
        {
          key: 'sales_growth_rate',
          title: 'Sales Growth Rate',
          value: state.data?.phase_1?.sales_growth_rate || 18.7,
          unit: '%',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'bg-green-500',
          interpretation: 'Strong growth momentum - Market expansion successful',
          trend: 'up',
          previousValue: mockPreviousValues.sales_growth_rate,
          targetValue: 20,
          chartData: generateChartData(18.7)
        },
        {
          key: 'inventory_turnover',
          title: 'Inventory Turnover',
          value: state.data?.phase_1?.inventory_turnover || 5.2,
          unit: 'times',
          icon: <ShoppingCart className="w-6 h-6" />,
          color: 'bg-purple-500',
          interpretation: 'Excellent inventory management - Efficient stock turnover',
          trend: 'up',
          previousValue: mockPreviousValues.inventory_turnover,
          targetValue: 6,
          chartData: generateChartData(5.2)
        },
        {
          key: 'customer_lifetime_value',
          title: 'Customer Lifetime Value',
          value: state.data?.phase_1?.customer_lifetime_value || 4850,
          unit: 'currency',
          icon: <Users className="w-6 h-6" />,
          color: 'bg-orange-500',
          interpretation: 'High-value customers - Focus on retention strategies',
          trend: 'up',
          previousValue: mockPreviousValues.customer_lifetime_value,
          targetValue: 5000,
          chartData: generateChartData(4850)
        }
      ]
    },
    {
      id: 'phase_2',
      title: 'Phase 2: Advanced Analytics',
      description: 'Advanced KPIs providing deeper insights into business operations',
      icon: <Target className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      kpis: [
        {
          key: 'net_profit_margin',
          title: 'Net Profit Margin',
          value: state.data?.phase_2?.net_profit_margin || 15.3,
          unit: '%',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-indigo-500',
          interpretation: 'Excellent overall profitability - Strong financial health',
          trend: 'up',
          previousValue: mockPreviousValues.net_profit_margin,
          targetValue: 18,
          chartData: generateChartData(15.3)
        },
        {
          key: 'customer_acquisition_cost',
          title: 'Customer Acquisition Cost',
          value: state.data?.phase_2?.customer_acquisition_cost || 245,
          unit: 'currency',
          icon: <Users className="w-6 h-6" />,
          color: 'bg-emerald-500',
          interpretation: 'Efficient acquisition costs - Good marketing ROI',
          trend: 'down',
          previousValue: mockPreviousValues.customer_acquisition_cost,
          targetValue: 200,
          chartData: generateChartData(245)
        },
        {
          key: 'customer_retention_rate',
          title: 'Customer Retention Rate',
          value: state.data?.phase_2?.customer_retention_rate || 72,
          unit: '%',
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'bg-emerald-500',
          interpretation: 'Good customer loyalty - Strong retention performance',
          trend: 'up',
          previousValue: mockPreviousValues.customer_retention_rate,
          targetValue: 80,
          chartData: generateChartData(72)
        },
        {
          key: 'sales_forecast_30_days',
          title: 'Sales Forecast (30 days)',
          value: state.data?.phase_2?.sales_forecast_30_days || 125000,
          unit: 'currency',
          icon: <Calendar className="w-6 h-6" />,
          color: 'bg-cyan-500',
          interpretation: 'Positive sales projection - Strong pipeline momentum',
          trend: 'up',
          chartData: generateChartData(125000)
        }
      ]
    },
    {
      id: 'phase_3',
      title: 'Phase 3: Strategic Intelligence',
      description: 'Strategic KPIs for long-term planning and competitive advantage',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      kpis: [
        {
          key: 'return_on_investment',
          title: 'Return on Investment',
          value: state.data?.phase_3?.return_on_investment || 22.1,
          unit: '%',
          icon: <BarChart3 className="w-6 h-6" />,
          color: 'bg-yellow-500',
          interpretation: 'Excellent ROI performance - Strong investment returns',
          trend: 'up',
          previousValue: mockPreviousValues.return_on_investment,
          targetValue: 25,
          chartData: generateChartData(22.1)
        },
        {
          key: 'customer_churn_rate',
          title: 'Customer Churn Rate',
          value: state.data?.phase_3?.customer_churn_rate || 6.8,
          unit: '%',
          icon: <TrendingDownIcon className="w-6 h-6" />,
          color: 'bg-red-500',
          interpretation: 'Low churn rate - Excellent customer satisfaction',
          trend: 'down',
          previousValue: mockPreviousValues.customer_churn_rate,
          targetValue: 5,
          chartData: generateChartData(6.8)
        },
        {
          key: 'predictive_analytics_90_days',
          title: 'Predictive Analytics (90 days)',
          value: state.data?.phase_3?.predictive_analytics_90_days?.summary?.total_predicted_revenue || 375000,
          unit: 'currency',
          icon: <Brain className="w-6 h-6" />,
          color: 'bg-violet-500',
          interpretation: 'Strong predictive insights - Positive growth trajectory',
          trend: 'up',
          chartData: generateChartData(375000)
        }
      ]
    }
  ];

  // Filter phases based on selection
  const filteredPhases = phasesData.filter(phase => selectedPhases.includes(phase.id));

  // Handle phase toggle
  const togglePhase = (phaseId: string) => {
    setSelectedPhases(prev => 
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  // Refresh handler
  const handleRefresh = () => {
    actions.refreshData();
  };

  // Export handler
  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting dashboard data...');
  };

  // Share handler
  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing dashboard...');
  };

  if (state.loading) {
    return (
      <AdvancedLayout theme={theme} autoRefresh={autoRefresh}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading KPI Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching the latest business intelligence data...
            </p>
          </div>
        </div>
      </AdvancedLayout>
    );
  }

  if (state.error) {
    return (
      <AdvancedLayout theme={theme} autoRefresh={autoRefresh}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
              Error Loading Dashboard
            </h2>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{state.error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdvancedLayout>
    );
  }

  return (
    <AdvancedLayout 
      theme={theme} 
      autoRefresh={autoRefresh}
      title="KPI Dashboard - Business Intelligence"
      description="Comprehensive business intelligence dashboard with real-time KPIs and analytics"
    >
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                KPI Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive business intelligence analytics • Last updated: {state.lastUpdated?.toLocaleString() || 'Never'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Current Year</option>
                <option value="custom">Custom Range</option>
              </select>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title="Toggle filters"
                >
                  <Filter className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button 
                  onClick={handleExport}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Export data"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Share dashboard"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Phases:</span>
                {phasesData.map(phase => (
                  <label key={phase.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPhases.includes(phase.id)}
                      onChange={() => togglePhase(phase.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className={`text-sm ${phase.color}`}>{phase.title.split(':')[0]}</span>
                  </label>
                ))}
                
                <div className="flex items-center space-x-2 ml-auto">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-refresh</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Sections */}
        {filteredPhases.map((phase, phaseIndex) => (
          <div key={phase.id} className="space-y-6">
            {/* Phase Header */}
            <div className={`rounded-xl border-2 p-6 ${phase.bgColor}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${phase.color}`}>
                  {phase.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {phase.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {phase.description}
                  </p>
                </div>
              </div>
              
              {/* Phase Metrics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {phase.kpis.map(kpi => (
                  <div key={kpi.key} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</span>
                      {kpi.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : kpi.trend === 'down' ? (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {kpi.unit === 'currency' ? formatCurrency(kpi.value) : kpi.value.toLocaleString()}
                        {kpi.unit !== 'currency' && kpi.unit !== 'times' && kpi.unit}
                      </span>
                      {kpi.previousValue && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({((kpi.value - kpi.previousValue) / kpi.previousValue * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {phase.kpis.map(kpi => (
                <AdvancedKpiCard
                  key={kpi.key}
                  title={kpi.title}
                  value={kpi.value}
                  unit={kpi.unit}
                  previousValue={kpi.previousValue}
                  targetValue={kpi.targetValue}
                  interpretation={kpi.interpretation}
                  icon={kpi.icon}
                  color={kpi.color}
                  trend={kpi.trend}
                  period={selectedPeriod}
                  lastUpdated={state.lastUpdated}
                  loading={state.loading}
                  error={state.error}
                  onRefresh={handleRefresh}
                  onViewDetails={() => console.log('View details for:', kpi.key)}
                  formatValue={kpi.unit === 'currency' ? formatCurrency : undefined}
                  chartData={kpi.chartData}
                  theme={theme}
                  animated={true}
                  showTrend={true}
                  showComparison={true}
                />
              ))}
            </div>

            {/* Charts Section for Phase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedChart
                type="area"
                data={phase.kpis.slice(0, 3).map(kpi => ({
                  name: kpi.title.split(' ')[0],
                  value: kpi.value
                }))}
                title={`${phase.title.split(':')[0]} Overview`}
                subtitle="Performance trends and comparisons"
                height={300}
                theme={theme}
                formatValue={phase.kpis[0].unit === 'currency' ? formatCurrency : undefined}
                animated={true}
                gradient={true}
              />
              
              <AdvancedChart
                type="bar"
                data={phase.kpis.map(kpi => ({
                  name: kpi.title.split(' ')[0],
                  value: kpi.value
                }))}
                title={`${phase.title.split(':')[0]} Metrics`}
                subtitle="Key performance indicators comparison"
                height={300}
                theme={theme}
                formatValue={phase.kpis[0].unit === 'currency' ? formatCurrency : undefined}
                animated={true}
              />
            </div>
          </div>
        ))}

        {/* Dashboard Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Overall business performance overview
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overall Performance</h3>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Excellent</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Strong performance across all key metrics
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Areas of Focus</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Continue customer retention efforts</li>
                <li>• Monitor inventory turnover rates</li>
                <li>• Optimize acquisition costs</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next Actions</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Review pricing strategy quarterly</li>
                <li>• Implement predictive analytics</li>
                <li>• Expand customer segmentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdvancedLayout>
  );
};

export default KPI_DASHBOARD;