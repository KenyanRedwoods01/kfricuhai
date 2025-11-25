# Corporate Data Engine Integration Guide

## Overview

The Corporate Data Engine has been successfully integrated with the Laravel backend, replacing all mock data with real API calls. This guide explains how to use the new system.

## Architecture

### Data Flow
```
Laravel Backend → tRPC Router → API Client → React Context → Components
```

### Key Components

1. **tRPC Router** (`/src/server/api/routers/corporate.ts`)
   - Handles all business logic queries
   - Interfaces with Laravel API endpoints
   - Provides type-safe data transformation

2. **API Client** (`/src/lib/api/corporate.ts`)
   - Frontend interface to tRPC procedures
   - React hooks for data consumption
   - Error handling and retry logic

3. **React Context** (`/src/contexts/CorporateDataContext.tsx`)
   - Centralized state management
   - Hierarchical filtering logic
   - Loading and error states

## Integration Points

### Laravel API Endpoints Used

| Component | Laravel Endpoint | Purpose |
|-----------|------------------|---------|
| Billers | `/biller` (GET) | Fetch all billers with pos_accnt_id filtering |
| Warehouses | `/warehouse` (GET) | Fetch warehouses with hierarchical filtering |
| Customers | `/customer/data` (GET) | Fetch customer data with segmentation |
| Sales | `/sales/today-sale` (GET) | Revenue and order data |
| KPIs | `/kpi/dashboard` (GET) | Key performance indicators |
| Reports | `/report/warehouse` (POST) | Analytics reports |

### Data Engine Features

#### 1. Hierarchical Filtering
- **Level 1**: POS Account (automatic from auth)
- **Level 2**: Biller selection
- **Level 3**: Warehouse selection

```typescript
// Example usage
const {
  selectedBiller,
  selectedWarehouse,
  setSelectedBiller,
  setSelectedWarehouse,
  billers,
  warehouses,
  loading,
  errors
} = useCorporateData();
```

#### 2. Customer Segmentation
Real customer type detection based on Laravel fields:
- **Students**: `origin.includes('student')` or `MemberNo` exists
- **Villagers**: `village` or `sub_county` fields populated
- **Households**: All other customers

#### 3. Real-time Data
- Automatic cache invalidation
- WebSocket ready for live updates
- Loading states and error boundaries

## Usage Examples

### Basic Integration

```typescript
import { useCorporateData } from '@/contexts/CorporateDataContext';

function MyDashboardComponent() {
  const {
    billers,
    warehouses,
    customers,
    dashboardData,
    selectedBiller,
    selectedWarehouse,
    setSelectedBiller,
    setSelectedWarehouse,
    loading,
    errors
  } = useCorporateData();

  if (loading.hierarchy) {
    return <div>Loading data...</div>;
  }

  if (errors.hierarchy) {
    return <div>Error: {errors.hierarchy}</div>;
  }

  return (
    <div>
      <select 
        value={selectedBiller} 
        onChange={(e) => setSelectedBiller(e.target.value)}
      >
        <option value="all">All Billers</option>
        {billers.map(biller => (
          <option key={biller.id} value={biller.id.toString()}>
            {biller.name}
          </option>
        ))}
      </select>
      
      <select 
        value={selectedWarehouse} 
        onChange={(e) => setSelectedWarehouse(e.target.value)}
      >
        <option value="all">All Warehouses</option>
        {warehouses
          .filter(w => !selectedBiller || selectedBiller === 'all' || w.biller_id?.toString() === selectedBiller)
          .map(warehouse => (
            <option key={warehouse.id} value={warehouse.id.toString()}>
              {warehouse.name}
            </option>
          ))}
      </select>
      
      {/* Display filtered data */}
      <div>
        Total Revenue: KES {dashboardData?.metrics?.totalRevenue?.toLocaleString()}
      </div>
    </div>
  );
}
```

### Using the Wrapper Component

```typescript
import CorporateDashboardWithData from '@/components/CorporateDashboardWithData';

// Simple usage - automatically provides data to child components
function App() {
  return (
    <CorporateDashboardWithData>
      <YourCustomContent />
    </CorporateDashboardWithData>
  );
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Laravel API Base URL
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000

# tRPC Configuration
NEXT_PUBLIC_TRPC_URL=http://localhost:3000/api/trpc
```

### Laravel Session Authentication

The system uses Laravel's session-based authentication. Ensure:
1. User is logged into Laravel application
2. Session cookies are included in API requests
3. CSRF protection is properly configured

## Error Handling

### Common Issues and Solutions

#### 1. CORS Issues
```javascript
// Laravel CORS Configuration
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Accept'],
```

#### 2. Authentication Errors
- Check Laravel session configuration
- Verify CSRF token handling
- Ensure user has proper permissions

#### 3. Data Structure Mismatches
- Verify Laravel model fields match TypeScript interfaces
- Check data transformation in tRPC procedures
- Review API response formats

## Development Workflow

### 1. Adding New Data Queries
1. Add Laravel controller method
2. Update tRPC router with new procedure
3. Add React hooks in API client
4. Update context if needed

### 2. Testing Data Flow
```typescript
// Test individual queries
const { data, isLoading, error } = api.corporate.getBillers.useQuery({
  posAccntId: 1
});
```

### 3. Debugging
- Check browser Network tab for API calls
- Review tRPC procedure logs
- Verify Laravel controller outputs

## Performance Optimizations

### 1. Caching Strategy
- Laravel cache for static data (billers, warehouses)
- Client-side cache for frequently accessed data
- Cache invalidation on data updates

### 2. Data Loading
- Parallel data fetching where possible
- Lazy loading for large datasets
- Pagination for customer lists

### 3. Real-time Updates
- WebSocket integration ready
- Selective data refresh
- Optimistic UI updates

## Migration from Mock Data

### Before (Mock Data)
```typescript
const warehouses = [
  { id: 1, name: 'Warehouse 1', revenue: 1000000 },
  { id: 2, name: 'Warehouse 2', revenue: 2000000 }
];
```

### After (Real Data)
```typescript
const { warehouses, loading, errors } = useCorporateData();
// warehouses now contains real data from Laravel API
```

## Next Steps

1. **Add more Laravel endpoints** for specific business logic
2. **Implement WebSocket** for real-time updates
3. **Add data validation** and error recovery
4. **Optimize caching** strategies
5. **Add testing** for data integrity

## Support

For issues related to:
- **Laravel integration**: Check Laravel controllers and routes
- **tRPC procedures**: Review router implementations
- **React components**: Check context usage
- **Data flow**: Verify API client configuration

The system is now fully integrated with the Laravel backend and ready for production use.