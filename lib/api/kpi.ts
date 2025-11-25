// Phase 1: High-Impact Quick Win KPIs
const getGrossProfitMargin = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetch(`/api/kpi/gross-profit-margin?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getSalesGrowthRate = async (period: string = 'monthly') => {
  return fetch(`/api/kpi/sales-growth-rate?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getInventoryTurnover = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetch(`/api/kpi/inventory-turnover?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getCustomerLifetimeValue = async (customerId?: string) => {
  const params = customerId ? `?customer_id=${customerId}` : '';
  return fetch(`/api/kpi/customer-lifetime-value${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

// Phase 2: Advanced Analytics KPIs
const getNetProfitMargin = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetch(`/api/kpi/net-profit-margin?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getCustomerAcquisitionCost = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetch(`/api/kpi/customer-acquisition-cost?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getCustomerRetentionRate = async (period: string = 'monthly') => {
  return fetch(`/api/kpi/customer-retention-rate?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getSalesForecast = async (periods: number = 3, daysAhead: number = 30) => {
  const params = new URLSearchParams();
  params.append('periods', periods.toString());
  params.append('days_ahead', daysAhead.toString());
  
  return fetch(`/api/kpi/sales-forecast?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getAbcAnalysis = async () => {
  return fetch('/api/kpi/abc-analysis', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

// Phase 3: Strategic Intelligence KPIs
const getReturnOnInvestment = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return fetch(`/api/kpi/return-on-investment?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getCustomerChurnRate = async (period: string = 'monthly') => {
  return fetch(`/api/kpi/customer-churn-rate?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getPredictiveAnalytics = async (horizon: number = 90) => {
  return fetch(`/api/kpi/predictive-analytics?horizon=${horizon}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getSeasonalTrends = async () => {
  return fetch('/api/kpi/seasonal-trends', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

const getCustomerSegmentation = async () => {
  return fetch('/api/kpi/customer-segmentation', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

// Dashboard Summary
const getKpiDashboard = async (period?: string) => {
  const params = period ? `?period=${period}` : '';
  return fetch(`/api/kpi/dashboard${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
};

// Export all functions
export {
  // Phase 1
  getGrossProfitMargin,
  getSalesGrowthRate,
  getInventoryTurnover,
  getCustomerLifetimeValue,
  
  // Phase 2
  getNetProfitMargin,
  getCustomerAcquisitionCost,
  getCustomerRetentionRate,
  getSalesForecast,
  getAbcAnalysis,
  
  // Phase 3
  getReturnOnInvestment,
  getCustomerChurnRate,
  getPredictiveAnalytics,
  getSeasonalTrends,
  getCustomerSegmentation,
  
  // Dashboard
  getKpiDashboard
};