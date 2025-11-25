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
  Minus
} from 'lucide-react';

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

interface IndividualKpi {
  value: number;
  interpretation: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

const KpiDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  useEffect(() => {
    fetchKpiData();
  }, [selectedPeriod]);

  const fetchKpiData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/kpi/dashboard?period=${selectedPeriod}`);
      const result = await response.json();
      
      if (result.success) {
        setKpiData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch KPI data');
      console.error('KPI fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (value < threshold) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getKpiConfig = (name: string, value: number, interpretation: string): IndividualKpi => {
    const configs: { [key: string]: any } = {
      'gross_profit_margin': {
        icon: <DollarSign className="w-6 h-6" />,
        color: 'bg-blue-500',
        trend: value >= 20 ? 'up' : value >= 10 ? 'stable' : 'down'
      },
      'sales_growth_rate': {
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'bg-green-500',
        trend: value > 0 ? 'up' : value === 0 ? 'stable' : 'down'
      },
      'inventory_turnover': {
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'bg-purple-500',
        trend: value >= 4 ? 'up' : value >= 2 ? 'stable' : 'down'
      },
      'customer_lifetime_value': {
        icon: <Users className="w-6 h-6" />,
        color: 'bg-orange-500',
        trend: value >= 5000 ? 'up' : value >= 1000 ? 'stable' : 'down'
      },
      'net_profit_margin': {
        icon: <Target className="w-6 h-6" />,
        color: 'bg-indigo-500',
        trend: value >= 10 ? 'up' : value >= 5 ? 'stable' : 'down'
      },
      'customer_retention_rate': {
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'bg-emerald-500',
        trend: value >= 60 ? 'up' : value >= 40 ? 'stable' : 'down'
      },
      'return_on_investment': {
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-yellow-500',
        trend: value >= 15 ? 'up' : value >= 5 ? 'stable' : 'down'
      },
      'customer_churn_rate': {
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'bg-red-500',
        trend: value <= 10 ? 'up' : value <= 20 ? 'stable' : 'down'
      }
    };

    const config = configs[name] || {
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-gray-500',
      trend: 'stable' as const
    };

    return {
      value,
      interpretation,
      icon: config.icon,
      color: config.color,
      trend: config.trend
    };
  };

  const KpiCard: React.FC<{ 
    title: string; 
    name: string; 
    value: number; 
    unit: string;
    interpretation: string;
  }> = ({ title, name, value, unit, interpretation }) => {
    const kpi = getKpiConfig(name, value, interpretation);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`${kpi.color} text-white p-3 rounded-lg`}>
            {kpi.icon}
          </div>
          {getTrendIcon(value, 0)}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : 'N/A'}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{interpretation}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading KPIs</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchKpiData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No KPI data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Dashboard</h1>
              <p className="text-gray-600">
                Comprehensive business intelligence metrics
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current_month">Current Month</option>
                <option value="last_month">Last Month</option>
                <option value="quarter">Current Quarter</option>
                <option value="year">Current Year</option>
              </select>
              <button 
                onClick={fetchKpiData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase 1: High-Impact Quick Wins */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-green-500" />
            Phase 1: High-Impact Quick Wins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Gross Profit Margin"
              name="gross_profit_margin"
              value={kpiData.phase_1.gross_profit_margin}
              unit="%"
              interpretation="Measures profitability after direct costs"
            />
            <KpiCard
              title="Sales Growth Rate"
              name="sales_growth_rate"
              value={kpiData.phase_1.sales_growth_rate}
              unit="%"
              interpretation="Tracks revenue growth over time"
            />
            <KpiCard
              title="Inventory Turnover"
              name="inventory_turnover"
              value={kpiData.phase_1.inventory_turnover}
              unit="times"
              interpretation="Measures inventory efficiency"
            />
            <KpiCard
              title="Customer Lifetime Value"
              name="customer_lifetime_value"
              value={kpiData.phase_1.customer_lifetime_value}
              unit="currency"
              interpretation="Predicts total customer value"
            />
          </div>
        </div>

        {/* Phase 2: Advanced Analytics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
            Phase 2: Advanced Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Net Profit Margin"
              name="net_profit_margin"
              value={kpiData.phase_2.net_profit_margin}
              unit="%"
              interpretation="Overall profitability after all expenses"
            />
            <KpiCard
              title="Customer Acquisition Cost"
              name="customer_acquisition_cost"
              value={kpiData.phase_2.customer_acquisition_cost}
              unit="currency"
              interpretation="Cost to acquire new customers"
            />
            <KpiCard
              title="Customer Retention Rate"
              name="customer_retention_rate"
              value={kpiData.phase_2.customer_retention_rate}
              unit="%"
              interpretation="Percentage of customers retained"
            />
            <KpiCard
              title="Sales Forecast (30 days)"
              name="sales_forecast"
              value={kpiData.phase_2.sales_forecast_30_days}
              unit="currency"
              interpretation="Predicted sales for next 30 days"
            />
          </div>
        </div>

        {/* Phase 3: Strategic Intelligence */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-500" />
            Phase 3: Strategic Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard
              title="Return on Investment"
              name="return_on_investment"
              value={kpiData.phase_3.return_on_investment}
              unit="%"
              interpretation="Return generated from investments"
            />
            <KpiCard
              title="Customer Churn Rate"
              name="customer_churn_rate"
              value={kpiData.phase_3.customer_churn_rate}
              unit="%"
              interpretation="Percentage of customers lost"
            />
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-500 text-white p-3 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                {getTrendIcon(kpiData.phase_3.predictive_analytics_90_days?.trend || 0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">90-Day Predictions</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Predictive analytics for strategic planning
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Trend Direction</div>
                  <div className="text-sm font-medium">
                    {kpiData.phase_3.predictive_analytics_90_days?.summary?.growth_trend || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-indigo-500" />
            Additional Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data Period:</span>
                  <span className="font-medium">{kpiData.period.start_date} to {kpiData.period.end_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(kpiData.period.generated_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total KPIs Tracked:</span>
                  <span className="font-medium text-blue-600">11</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Recommendations
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  • Focus on improving gross profit margin through cost optimization
                </p>
                <p className="text-gray-700">
                  • Increase customer retention efforts to reduce churn
                </p>
                <p className="text-gray-700">
                  • Review inventory turnover to optimize stock levels
                </p>
                <p className="text-gray-700">
                  • Implement predictive analytics for better forecasting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiDashboard;