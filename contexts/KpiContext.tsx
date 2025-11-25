import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
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

interface KpiState {
  data: KpiData | null;
  loading: boolean;
  error: string | null;
  selectedPeriod: string;
  lastUpdated: Date | null;
  isAutoRefresh: boolean;
  preferences: {
    theme: 'light' | 'dark';
    currency: string;
    dateFormat: string;
    refreshInterval: number;
  };
}

type KpiAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: KpiData }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PERIOD'; payload: string }
  | { type: 'SET_AUTO_REFRESH'; payload: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<KpiState['preferences']> }
  | { type: 'SET_LAST_UPDATED'; payload: Date };

const initialState: KpiState = {
  data: null,
  loading: false,
  error: null,
  selectedPeriod: 'current_month',
  lastUpdated: null,
  isAutoRefresh: false,
  preferences: {
    theme: 'light',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    refreshInterval: 300000, // 5 minutes
  },
};

function kpiReducer(state: KpiState, action: KpiAction): KpiState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { 
        ...state, 
        data: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date()
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PERIOD':
      return { ...state, selectedPeriod: action.payload };
    case 'SET_AUTO_REFRESH':
      return { ...state, isAutoRefresh: action.payload };
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    default:
      return state;
  }
}

interface KpiContextType {
  state: KpiState;
  dispatch: React.Dispatch<KpiAction>;
  actions: {
    setLoading: (loading: boolean) => void;
    setData: (data: KpiData) => void;
    setError: (error: string | null) => void;
    setPeriod: (period: string) => void;
    setAutoRefresh: (enabled: boolean) => void;
    updatePreferences: (preferences: Partial<KpiState['preferences']>) => void;
    refreshData: () => Promise<void>;
  };
}

const KpiContext = createContext<KpiContextType | null>(null);

export function KpiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kpiReducer, initialState);

  const actions = {
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setData: (data: KpiData) => dispatch({ type: 'SET_DATA', payload: data }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setPeriod: (period: string) => dispatch({ type: 'SET_PERIOD', payload: period }),
    setAutoRefresh: (enabled: boolean) => dispatch({ type: 'SET_AUTO_REFRESH', payload: enabled }),
    updatePreferences: (preferences: Partial<KpiState['preferences']>) => 
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences }),
    
    refreshData: async () => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        
        const response = await fetch(`/api/kpi/dashboard?period=${state.selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        const result = await response.json();
        
        if (result.success) {
          actions.setData(result.data);
        } else {
          actions.setError(result.error);
        }
      } catch (err) {
        actions.setError('Failed to fetch KPI data');
        console.error('KPI refresh error:', err);
      }
    },
  };

  return (
    <KpiContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </KpiContext.Provider>
  );
}

export function useKpi() {
  const context = useContext(KpiContext);
  if (!context) {
    throw new Error('useKpi must be used within a KpiProvider');
  }
  return context;
}