# UHAI Africa Corporate Data Engine

A comprehensive data integration layer for the UHAI Africa corporate dashboard, providing real-time access to business data through tRPC and Laravel API integration.

## 🏗️ Architecture Overview

```
Frontend Components
    ↓
CorporateDataContext (State Management)
    ↓
CorporateAPI (tRPC Client)
    ↓
Laravel API Endpoints
    ↓
Database (MySQL)
```

## 📁 Project Structure

```
/nextjs/
├── src/
│   ├── server/api/
│   │   ├── routers/
│   │   │   └── corporate.ts          # Main tRPC router with all queries
│   │   ├── root.ts                   # Root router combining all routers
│   │   └── trpc.ts                   # tRPC configuration
│   ├── lib/
│   │   ├── api/
│   │   │   └── corporate.ts          # API client and helper functions
│   │   ├── config/
│   │   │   └── api.ts                # API configuration settings
│   │   └── data/
│   │       └── initializer.ts        # Data initialization utilities
│   ├── contexts/
│   │   └── CorporateDataContext.tsx  # React context for data management
│   ├── pages/api/trpc/[trpc].ts      # Next.js API route handler
│   └── components/
│       └── CorporateDashboardWithData.tsx  # Data-integrated dashboard
└── examples/
    └── CorporateDataEngineExamples.tsx  # Usage examples and demos
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TRPC_URL=http://localhost:3000/api/trpc
DATABASE_URL=mysql://user:password@localhost:3306/uhai_africa
```

### 2. Basic Usage with CorporateDataProvider

```tsx
import React from 'react';
import { CorporateDataProvider } from '@/contexts/CorporateDataContext';

const App = () => {
  return (
    <CorporateDataProvider>
      <YourDashboardComponent />
    </CorporateDataProvider>
  );
};
```

### 3. Using Data in Components

```tsx
import { useCorporateData } from '@/contexts/CorporateDataContext';

const DashboardComponent = () => {
  const {
    billers,
    warehouses,
    dashboardData,
    smartActivationMetrics,
    customerSegmentation,
    revenueBreakdown,
    selectedBiller,
    selectedWarehouse,
    setSelectedBiller,
    setSelectedWarehouse,
    refreshData,
    loading,
    errors,
  } = useCorporateData();

  if (loading.hierarchy || loading.dashboard) {
    return <div>Loading...</div>;
  }

  if (errors.hierarchy || errors.dashboard) {
    return <div>Error: {errors.hierarchy || errors.dashboard}</div>;
  }

  return (
    <div>
      <h1>Corporate Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={dashboardData?.metrics?.totalRevenue} />
        <KpiCard title="Total Orders" value={dashboardData?.metrics?.totalOrders} />
        <KpiCard title="Total Customers" value={dashboardData?.metrics?.totalCustomers} />
        <KpiCard title="Avg Order Value" value={dashboardData?.metrics?.avgOrderValue} />
      </div>
    </div>
  );
};
```

## 🔧 Core Components

### 1. CorporateAPI Class

The main API client for interacting with the Laravel backend:

```tsx
import { CorporateAPI } from '@/lib/api/corporate';

// Fetch billers
const billers = await CorporateAPI.getBillers();

// Fetch warehouses with biller filter
const warehouses = await CorporateAPI.getWarehouses(101);

// Fetch filtered dashboard data
const dashboardData = await CorporateAPI.getCorporateDashboardData({
  selectedBiller: '101',
  selectedWarehouse: '1001',
  dateRange: '30d',
});

// Get smart activation metrics
const metrics = await CorporateAPI.getSmartActivationMetrics({
  selectedBiller: '101',
  selectedWarehouse: '1001',
});
```

### 2. DataInitializer

Handles data initialization, caching, and real-time updates:

```tsx
import { DataInitializer } from '@/lib/data/initializer';

// Initialize all dashboard data
const dashboardData = await DataInitializer.initializeDashboardData({
  selectedBiller: 'all',
  selectedWarehouse: 'all',
  dateRange: '30d',
});

// Initialize hierarchy data (billers, warehouses, customers)
const hierarchyData = await DataInitializer.initializeHierarchyData();

// Clear cache
DataInitializer.clearCache();

// Set up real-time updates
const unsubscribe = DataInitializer.setupRealtimeSync({
  onDashboardUpdate: (data) => console.log('Dashboard updated:', data),
  onSalesUpdate: (data) => console.log('Sales updated:', data),
});
```

### 3. CorporateDataContext

React context providing centralized data management:

```tsx
const {
  // Data state
  billers,
  warehouses,
  customers,
  dashboardData,
  smartActivationMetrics,
  customerSegmentation,
  revenueBreakdown,
  
  // Filter state
  selectedBiller,
  selectedWarehouse,
  dateRange,
  
  // Loading & error states
  loading,
  errors,
  
  // Actions
  setSelectedBiller,
  setSelectedWarehouse,
  setDateRange,
  refreshData,
  clearCache,
  
  // Utilities
  getFilteredWarehouses,
  getCurrentBiller,
  getCurrentWarehouse,
} = useCorporateData();
```

## 🏢 Hierarchical Data Structure

The system supports a three-level hierarchy:

```
POS Account (1)
  └── Billers (101, 102, 103...)
       └── Warehouses (1001, 1002, 1003...)
            └── Customers, Sales, etc.
```

### Billers
Regional managers/operators managing multiple warehouses:

```typescript
interface Biller {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  pos_accnt_id: number;
  is_active: boolean;
}
```

### Warehouses
Individual store locations under billers:

```typescript
interface Warehouse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  pos_accnt_id: number;
  biller_id: number;
  warehouse_id: number;
  is_active: boolean;
}
```

### Customers
End customers with segmentation for Smart Activations:

```typescript
interface Customer {
  id: number;
  customer_group_id: number;
  name: string;
  company_name: string;
  email: string;
  phone_number: string;
  // Smart Activation fields
  origin: string;           // For student identification
  MemberNo: string;         // Student ID
  village: string;          // For villagers
  sub_county: string;       // For villagers
  ward: string;             // For villagers
  assigned: number;         // warehouse_id
  pos_accnt_id: number;
}
```

## 🎯 Smart Activations

### Customer Segmentation

1. **Students** - University/college students
   - Identified by `origin` field or `MemberNo` (student ID)
   - Smart student groups for bulk activations

2. **Villagers** - Rural community members
   - Identified by `village`, `sub_county`, `ward` fields
   - Village cooperatives and clusters

3. **Households** - Urban family units
   - Default category for customers not matching above
   - Smart household clusters

### Smart Activation Metrics

```typescript
interface SmartActivationMetrics {
  totalGroups: number;
  activeGroups: number;
  avgActivationRate: number;
  totalMembers: number;
  avgRevenue: number;
  topPerformingGroup: string;
  growthRate: number;
}
```

## 📊 Analytics & KPIs

### Available KPI Types

```typescript
const KPI_TYPES = {
  GROSS_PROFIT_MARGIN: 'gross-profit-margin',
  SALES_GROWTH_RATE: 'sales-growth-rate',
  INVENTORY_TURNOVER: 'inventory-turnover',
  CUSTOMER_LIFETIME_VALUE: 'customer-lifetime-value',
  NET_PROFIT_MARGIN: 'net-profit-margin',
  CUSTOMER_ACQUISITION_COST: 'customer-acquisition-cost',
  CUSTOMER_RETENTION_RATE: 'customer-retention-rate',
  SALES_FORECAST: 'sales-forecast',
  ABC_ANALYSIS: 'abc-analysis',
  RETURN_ON_INVESTMENT: 'return-on-investment',
  CUSTOMER_CHURN_RATE: 'customer-churn-rate',
  PREDICTIVE_ANALYTICS: 'predictive-analytics',
  SEASONAL_TRENDS: 'seasonal-trends',
  CUSTOMER_SEGMENTATION: 'customer-segmentation',
};
```

### Analytics Reports

```typescript
interface AnalyticsReport {
  id: string;
  title: string;
  type: 'revenue' | 'customer' | 'activation' | 'performance';
  generatedAt: Date;
  data: any;
  warehouseIds: number[];
}
```

## ⚡ Real-time Features

### Data Synchronization

```tsx
// Set up real-time updates
const unsubscribe = DataInitializer.setupRealtimeSync({
  onDashboardUpdate: (data) => {
    // Update dashboard state
    setDashboardData(data);
  },
  onSalesUpdate: (data) => {
    // Update sales data
    setSalesData(data);
  },
  onCustomerUpdate: (data) => {
    // Update customer data
    setCustomerData(data);
  },
});

// Clean up
useEffect(() => {
  return unsubscribe;
}, []);
```

### WebSocket Integration (Future Enhancement)

```typescript
// Example WebSocket implementation
class RealtimeConnector {
  private ws: WebSocket;
  
  connect() {
    this.ws = new WebSocket('ws://localhost:3001');
    
    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'dashboard_update':
          // Handle dashboard update
          break;
        case 'sales_update':
          // Handle sales update
          break;
        case 'customer_update':
          // Handle customer update
          break;
      }
    };
  }
}
```

## 🔒 Authentication & Security

### tRPC Middleware

```typescript
// Protected procedure example
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Check authentication
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  // Add user info to context
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
```

### API Authentication

```typescript
// Add authentication headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'X-User-ID': userId,
  'X-POS-Account-ID': posAccountId,
};
```

## 📈 Performance Optimization

### Caching Strategy

```typescript
const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,     // 5 minutes
  MEDIUM: 15 * 60 * 1000,   // 15 minutes
  LONG: 30 * 60 * 1000,     // 30 minutes
};
```

### Data Prefetching

```tsx
// Prefetch critical data
useEffect(() => {
  // Prefetch billers and warehouses on component mount
  CorporateAPI.getBillers();
  CorporateAPI.getWarehouses();
}, []);
```

### Pagination

```typescript
// Handle large datasets
const getPaginatedData = async (page: number, pageSize: number) => {
  const response = await CorporateAPI.getCustomers({
    warehouseId: selectedWarehouseId,
    page,
    pageSize,
  });
  return response;
};
```

## 🧪 Testing

### Mock Data for Testing

```typescript
// Test data generator
const generateTestData = () => ({
  billers: [
    { id: 101, name: 'John Mwangi', pos_accnt_id: 1, is_active: true },
    { id: 102, name: 'Mary Wanjiku', pos_accnt_id: 1, is_active: true },
  ],
  warehouses: [
    { id: 1, name: 'Nairobi Central', biller_id: 101, pos_accnt_id: 1, is_active: true },
    { id: 2, name: 'Mombasa Campus', biller_id: 102, pos_accnt_id: 1, is_active: true },
  ],
});
```

### Unit Tests

```typescript
// Test data processing
describe('CorporateAPI', () => {
  test('should fetch billers correctly', async () => {
    const billers = await CorporateAPI.getBillers();
    expect(billers).toBeInstanceOf(Array);
    expect(billers[0]).toHaveProperty('id');
  });
});
```

## 🚨 Error Handling

### Global Error Handler

```typescript
class ErrorHandler {
  static handleError(error: any) {
    if (error instanceof TRPCClientError) {
      return {
        success: false,
        message: error.message,
        code: error.data?.code || 'UNKNOWN_ERROR',
        retryable: this.isRetryableError(error),
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
  
  private static isRetryableError(error: any) {
    // Define retryable error conditions
    return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
  }
}
```

### Retry Logic

```typescript
const fetchWithRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i === maxRetries - 1) break;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
};
```

## 🔧 Configuration

### API Configuration

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TRPC_URL: process.env.NEXT_PUBLIC_TRPC_URL || 'http://localhost:3000/api/trpc',
  TIMEOUT: 30000,
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000,
    MEDIUM: 15 * 60 * 1000,
    LONG: 30 * 60 * 1000,
  },
  REALTIME: {
    UPDATE_INTERVAL: 30000,
    MAX_RECONNECT_ATTEMPTS: 5,
  },
} as const;
```

## 📋 Migration Guide

### From Mock Data to Real Data

1. **Replace Mock Data Imports**

```tsx
// Before (mock data)
import { mockBillerData } from '@/data/mockData';

// After (real data)
import { useCorporateData } from '@/contexts/CorporateDataContext';
```

2. **Update Data Access Patterns**

```tsx
// Before
const billers = mockBillerData.billers;

// After
const { billers } = useCorporateData();
```

3. **Add Error and Loading States**

```tsx
// Add loading states
if (loading.hierarchy) {
  return <DashboardSkeleton />;
}

if (errors.hierarchy) {
  return <ErrorMessage error={errors.hierarchy} />;
}
```

## 🚀 Deployment

### Environment Variables

```env
# Production
NEXT_PUBLIC_API_URL=https://api.uhai.africa
NEXT_PUBLIC_TRPC_URL=https://app.uhai.africa/api/trpc
DATABASE_URL=mysql://user:pass@prod-db:3306/uhai_africa

# Development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TRPC_URL=http://localhost:3000/api/trpc
DATABASE_URL=mysql://root:password@localhost:3306/uhai_africa_test
```

### Build Optimization

```typescript
// next.config.js
module.exports = {
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          corporate: {
            name: 'corporate',
            chunks: 'all',
            test: /[\\/]src[\\/]server[\\/]api[\\/]routers[\\/]/,
          },
        },
      };
    }
    return config;
  },
};
```

## 🎯 Future Enhancements

1. **WebSocket Integration** - Real-time bidirectional updates
2. **GraphQL API** - More flexible data querying
3. **Microservices** - Split data services by domain
4. **Machine Learning** - Predictive analytics and insights
5. **Mobile App Integration** - React Native components
6. **Advanced Caching** - Redis-based distributed caching
7. **Data Export** - CSV, Excel, PDF generation
8. **Custom Dashboards** - User-configurable dashboards

## 📞 Support

For questions or issues:

1. Check the examples in `/examples/CorporateDataEngineExamples.tsx`
2. Review API documentation in `/src/lib/api/corporate.ts`
3. Examine the Laravel controllers for endpoint details
4. Use the debugging tools in the browser developer console

---

**Built for UHAI Africa by MiniMax Agent** 🚀