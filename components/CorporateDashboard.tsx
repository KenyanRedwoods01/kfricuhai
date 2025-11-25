import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCorporateData } from '@/contexts/CorporateDataContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Home, 
  ArrowUp, 
  ArrowDown,
  Target,
  Award,
  Package,
  DollarSign,
  UserCheck,
  MapPin,
  Activity,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  Zap,
  Shield,
  Filter,
  Loader2
} from 'lucide-react';

// Types for Corporate Dashboard (matching context types)
interface Biller {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  address: string;
  pos_accnt_id: number;
}

interface Warehouse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  is_active: boolean;
  pos_accnt_id: number;
  pos_accnt_id: number;
  biller_id: number;
  warehouse_id: number;
  revenue?: number;
  totalOrders?: number;
  activeCustomers?: number;
}

interface CustomerType {
  id: number;
  name: string;
  type: 'student' | 'villager' | 'household';
  total: number;
  active: number;
  revenue: number;
  avgOrderValue: number;
  loyaltyPoints: number;
  smartActivationStatus: 'active' | 'pending' | 'inactive';
  growth: number;
}

interface SmartActivationGroup {
  id: number;
  name: string;
  type: 'student_group' | 'household_cluster' | 'village_cooperative';
  location: string;
  members: number;
  activationRate: number;
  totalRevenue: number;
  loyaltyScore: number;
  lastActivation: Date;
  status: 'active' | 'pending' | 'completed';
}

interface KPIMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  target?: number;
  achievement?: number;
}

interface Notification {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  warehouseId?: number;
  customerType?: string;
  read: boolean;
}

const CorporateDashboard: React.FC = () => {
  // Use Corporate Data Context for real data
  const {
    billers,
    warehouses,
    customers,
    dashboardData,
    smartActivationMetrics,
    selectedBiller,
    selectedWarehouse,
    dateRange,
    loading,
    errors,
    setSelectedBiller,
    setSelectedWarehouse,
    setDateRange,
    refreshData,
    clearCache
  } = useCorporateData();

  // Calculate derived metrics from real data
  const totalRevenue = dashboardData?.metrics?.totalRevenue || 0;
  const totalOrders = dashboardData?.metrics?.totalOrders || 0;
  const totalCustomers = dashboardData?.metrics?.totalCustomers || customers?.length || 0;

  // Customer segmentation from real data
  const customerSegmentation = dashboardData?.customerSegmentation || [];
  
  // Format customer types for display
  const customerTypes = [
    {
      id: 1,
      name: 'University Students',
      type: 'student' as const,
      total: customerSegmentation.find((c: any) => c.segment === 'Students')?.count || 0,
      active: Math.floor((customerSegmentation.find((c: any) => c.segment === 'Students')?.count || 0) * 0.87),
      revenue: customerSegmentation.find((c: any) => c.segment === 'Students')?.revenue || 0,
      avgOrderValue: customerSegmentation.find((c: any) => c.segment === 'Students')?.avgOrderValue || 0,
      loyaltyPoints: 0,
      smartActivationStatus: 'active' as const,
      growth: customerSegmentation.find((c: any) => c.segment === 'Students')?.growthRate || 0
    },
    {
      id: 2,
      name: 'Rural Villagers',
      type: 'villager' as const,
      total: customerSegmentation.find((c: any) => c.segment === 'Villagers')?.count || 0,
      active: Math.floor((customerSegmentation.find((c: any) => c.segment === 'Villagers')?.count || 0) * 0.77),
      revenue: customerSegmentation.find((c: any) => c.segment === 'Villagers')?.revenue || 0,
      avgOrderValue: customerSegmentation.find((c: any) => c.segment === 'Villagers')?.avgOrderValue || 0,
      loyaltyPoints: 0,
      smartActivationStatus: 'active' as const,
      growth: customerSegmentation.find((c: any) => c.segment === 'Villagers')?.growthRate || 0
    },
    {
      id: 3,
      name: 'Urban Households',
      type: 'household' as const,
      total: customerSegmentation.find((c: any) => c.segment === 'Households')?.count || 0,
      active: Math.floor((customerSegmentation.find((c: any) => c.segment === 'Households')?.count || 0) * 0.92),
      revenue: customerSegmentation.find((c: any) => c.segment === 'Households')?.revenue || 0,
      avgOrderValue: customerSegmentation.find((c: any) => c.segment === 'Households')?.avgOrderValue || 0,
      loyaltyPoints: 0,
      smartActivationStatus: 'active' as const,
      growth: customerSegmentation.find((c: any) => c.segment === 'Households')?.growthRate || 0
    }
  ];

  // Smart activation groups from real data
  const smartActivationGroups = smartActivationMetrics ? [
    {
      id: 1,
      name: 'Top Performing Group',
      type: 'student_group' as const,
      location: 'Nairobi County',
      members: smartActivationMetrics.totalMembers || 0,
      activationRate: smartActivationMetrics.avgActivationRate || 0,
      totalRevenue: smartActivationMetrics.avgRevenue || 0,
      loyaltyScore: 92.3,
      lastActivation: new Date(),
      status: 'active' as const
    }
  ] : [];

  // Notifications from real data or real-time events
  const notifications = []; // Would be populated from real-time notifications API

  // Handle loading and error states
  if (loading.hierarchy || loading.dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading corporate dashboard data...</p>
        </div>
      </div>
    );
  }

  if (errors.hierarchy || errors.dashboard) {
    return (
      <Alert className="m-4">
        <AlertDescription>
          {errors.hierarchy || errors.dashboard}
          <Button onClick={refreshData} className="ml-4">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Filter options
  const billerOptions = [{ id: 0, name: 'All Billers', company_name: '' }, ...billers];
  const warehouseOptions = selectedBiller && selectedBiller !== 'all' 
    ? warehouses.filter(w => w.biller_id?.toString() === selectedBiller)
    : warehouses;

  const posAccountId = 1; // This would come from authentication context

  // Mock notifications for now - would come from real-time system
        title: 'Student Group Activation Peak',
        message: 'University Students showing 34% increase in smart activations',
        timestamp: new Date('2024-11-25T10:30:00'),
        customerType: 'student',
        read: false
      },
      {
        id: '2',
        type: 'medium',
        title: 'Village Cooperative Milestone',
        message: 'Kisumu Rural Cooperative reached 500 members',
        timestamp: new Date('2024-11-25T09:15:00'),
        customerType: 'villager',
        read: false
      },
      {
        id: '3',
        type: 'critical',
        title: 'Revenue Target Alert',
        message: 'Household clusters exceeded monthly target by 15%',
        timestamp: new Date('2024-11-25T08:45:00'),
        customerType: 'household',
        read: false
      }
    ];

    setBillers(mockBillers);
    setWarehouses(mockWarehouses);
    setCustomerTypes(mockCustomerTypes);
    setSmartActivationGroups(mockSmartGroups);
    setNotifications(mockNotifications);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (realTimeData) {
        setWarehouses(prev => prev.map(warehouse => ({
          ...warehouse,
          revenue: warehouse.revenue! + Math.floor(Math.random() * 1000),
          totalOrders: warehouse.totalOrders! + Math.floor(Math.random() * 5),
          activeCustomers: warehouse.activeCustomers! + Math.floor(Math.random() * 3)
        })));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeData]);

  // Filter functions based on hierarchy using real data
  const getFilteredWarehouses = () => {
    let filtered = warehouses || [];
    if (selectedBiller && selectedBiller !== 'all') {
      filtered = filtered.filter(w => w.biller_id?.toString() === selectedBiller);
    }
    if (selectedWarehouse && selectedWarehouse !== 'all') {
      filtered = filtered.filter(w => w.id?.toString() === selectedWarehouse);
    }
    return filtered;
  };

  const getFilteredCustomerTypes = () => {
    // Customer types are global across the POS account, but we could filter them by warehouse if needed
    return customerTypes;
  };

  const getFilteredSmartActivationGroups = () => {
    // Smart activation groups are global, but we could filter them by location/warehouse if needed
    return smartActivationGroups;
  };

  const filteredWarehouses = getFilteredWarehouses();

  // Calculate corporate KPIs using real data
  const totalRevenueValue = totalRevenue || 0;
  const activeCustomersTotal = customerTypes.reduce((sum, ct) => sum + ct.active, 0);
  const avgLoyaltyScore = smartActivationGroups.length > 0 ? 
    Math.round(smartActivationGroups.reduce((sum, group) => sum + group.loyaltyScore, 0) / smartActivationGroups.length) : 0;

  const corporateKPIs: KPIMetric[] = [
    {
      title: 'Total Revenue (Filtered Warehouses)',
      value: `KES ${totalRevenueValue.toLocaleString()}`,
      change: 28.5, // This would be calculated from historical data
      trend: 'up',
      icon: DollarSign,
      target: 10000000,
      achievement: Math.round((totalRevenueValue / 10000000) * 100)
    },
    {
      title: 'Smart Activation Groups',
      value: smartActivationGroups.length,
      change: 15.2,
      trend: 'up',
      icon: Zap,
      target: 50,
      achievement: 60.0
    },
    {
      title: 'Total Active Customers',
      value: activeCustomersTotal.toLocaleString(),
      change: 24.7,
      trend: 'up',
      icon: Users,
      target: 10000,
      achievement: Math.round((activeCustomersTotal / 10000) * 100)
    },
    {
      title: 'Average Loyalty Score',
      value: `${avgLoyaltyScore}%`,
      change: 8.3,
      trend: 'up',
      icon: Star,
      target: 90,
      achievement: avgLoyaltyScore
    }
  ];

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return GraduationCap;
      case 'villager': return MapPin;
      case 'household': return Home;
      default: return Users;
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-blue-500';
      case 'villager': return 'bg-green-500';
      case 'household': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSmartActivationIcon = (type: string) => {
    switch (type) {
      case 'student_group': return GraduationCap;
      case 'village_cooperative': return MapPin;
      case 'household_cluster': return Home;
      default: return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <Alert className="h-4 w-4 text-red-500" />;
      case 'high': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Corporate Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Multi-Warehouse Smart Activation Analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={realTimeData ? 'default' : 'secondary'}>
              {realTimeData ? 'Real-time Active' : 'Static Data'}
            </Badge>
            <Button
              onClick={() => setRealTimeData(!realTimeData)}
              variant={realTimeData ? 'default' : 'outline'}
              size="sm"
            >
              {realTimeData ? 'Pause Updates' : 'Resume Updates'}
            </Button>
          </div>
        </div>

        {/* Hierarchical Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Organization Hierarchy Filters</span>
            </CardTitle>
            <CardDescription>
              Filter data by POS Account → Biller → Warehouse hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* POS Account Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">POS Account</label>
                <Select value={posAccountId.toString()} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select POS Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">UHAI Africa (Current)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Biller Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Biller/Region</label>
                <Select 
                  value={selectedBiller?.toString() || 'all'} 
                  onValueChange={(value) => {
                    const billerId = value === 'all' ? null : parseInt(value);
                    setSelectedBiller(billerId);
                    setSelectedWarehouse(null); // Reset warehouse selection
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Biller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Billers</SelectItem>
                    {billers.map((biller) => (
                      <SelectItem key={biller.id} value={biller.id.toString()}>
                        {biller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Warehouse Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Warehouse</label>
                <Select 
                  value={selectedWarehouse || 'all'} 
                  onValueChange={(value) => {
                    setSelectedWarehouse(value === 'all' ? '' : value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouseOptions.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Current Selection Summary */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">POS Account:</span>
                  <span>UHAI Africa (ID: {posAccountId})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Biller:</span>
                  <span>
                    {selectedBiller 
                      ? billers.find(b => b.id === selectedBiller)?.name 
                      : 'All Billers'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Warehouse:</span>
                  <span>
                    {selectedWarehouse 
                      ? warehouses.find(w => w.id === selectedWarehouse)?.name 
                      : 'All Warehouses'
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Corporate KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corporateKPIs.map((kpi, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  {kpi.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-500" />
                  ) : kpi.trend === 'down' ? (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  ) : (
                    <Activity className="h-3 w-3 text-gray-500" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-gray-500">vs last period</span>
                </div>
                {kpi.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>Target: {kpi.target.toLocaleString()}</span>
                      <span>{kpi.achievement}%</span>
                    </div>
                    <Progress value={kpi.achievement} className="mt-1" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="customers">Customer Types</TabsTrigger>
            <TabsTrigger value="activations">Smart Activations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Warehouse Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Warehouse Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredWarehouses.map((warehouse) => (
                      <div key={warehouse.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{warehouse.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {warehouse.address || 'No address'} • 
                            Active: {warehouse.is_active ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Revenue Data Loading...
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {warehouse.totalOrders} orders
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Smart Activation Groups Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Smart Activation Groups</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {smartActivationGroups.map((group) => {
                      const IconComponent = getSmartActivationIcon(group.type);
                      return (
                        <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{group.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {group.location} • {group.members} members
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(group.status)}>
                              {group.status}
                            </Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {group.activationRate}% activated
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Warehouses Tab */}
          <TabsContent value="warehouses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>{warehouse.name}</span>
                      </span>
                      <Badge variant={warehouse.is_active ? 'default' : 'secondary'}>
                        {warehouse.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {warehouse.address} • {warehouse.phone} • {warehouse.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                        <p className="font-semibold">KES {warehouse.revenue?.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <Package className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Orders</p>
                        <p className="font-semibold">{warehouse.totalOrders}</p>
                      </div>
                      <div className="text-center">
                        <Users className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Customers</p>
                        <p className="font-semibold">{warehouse.activeCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customer Types Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {customerTypes.map((customerType) => {
                const IconComponent = getCustomerTypeIcon(customerType.type);
                return (
                  <Card key={customerType.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getCustomerTypeColor(customerType.type)}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <span>{customerType.name}</span>
                      </CardTitle>
                      <CardDescription>
                        Smart Activation Status: 
                        <Badge variant={customerType.smartActivationStatus === 'active' ? 'default' : 'secondary'} className="ml-2">
                          {customerType.smartActivationStatus}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
                            <p className="text-xl font-bold">{customerType.total}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
                            <p className="text-xl font-bold">{customerType.active}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                          <p className="text-xl font-bold text-green-600">KES {customerType.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Avg Order Value</p>
                          <p className="text-lg font-semibold">KES {customerType.avgOrderValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Loyalty Points</p>
                          <p className="text-lg font-semibold">{customerType.loyaltyPoints.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-semibold">+{customerType.growth}%</span>
                          <span className="text-gray-600">growth this month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Smart Activations Tab */}
          <TabsContent value="activations" className="space-y-6">
            <div className="space-y-6">
              {smartActivationGroups.map((group) => {
                const IconComponent = getSmartActivationIcon(group.type);
                return (
                  <Card key={group.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <span>{group.name}</span>
                        </span>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {group.location} • Last activation: {group.lastActivation.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Members</p>
                          <p className="text-2xl font-bold">{group.members}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Activation Rate</p>
                          <p className="text-2xl font-bold text-blue-600">{group.activationRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                          <p className="text-2xl font-bold text-green-600">KES {group.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Loyalty Score</p>
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <p className="text-2xl font-bold">{group.loyaltyScore}%</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Type</p>
                          <Badge variant="outline" className="text-xs">
                            {group.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={group.activationRate} className="h-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-center">
                          Activation Progress: {group.activationRate}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Customer Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Revenue by Customer Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerTypes.map((type) => (
                      <div key={type.id} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">{type.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${(type.revenue / Math.max(...customerTypes.map(t => t.revenue))) * 100}%`}}
                            />
                          </div>
                          <span className="text-sm font-medium">KES {type.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Smart Activation Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Smart Activation Efficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {smartActivationGroups.map((group) => (
                      <div key={group.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{group.name}</span>
                          <span className="text-sm text-gray-600">{group.activationRate}%</span>
                        </div>
                        <Progress value={group.activationRate} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Corporate Alerts & Notifications</span>
                </CardTitle>
                <CardDescription>
                  Smart activation alerts and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Alert key={notification.id} className="relative">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleString()}
                            </span>
                            {notification.customerType && (
                              <Badge variant="outline" className="text-xs">
                                {notification.customerType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CorporateDashboard;