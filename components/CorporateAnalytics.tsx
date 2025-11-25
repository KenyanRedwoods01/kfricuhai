import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCorporateData } from '@/contexts/CorporateDataContext';
import { 
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  Search,
  MapPin,
  Zap,
  Award,
  Activity,
  Building2,
  GraduationCap,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Loader2
} from 'lucide-react';

// Types for Corporate Analytics (matching context types)
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
  biller_id: number;
  warehouse_id: number;
  revenue?: number;
  totalOrders?: number;
  activeCustomers?: number;
}

interface AnalyticsReport {
  id: string;
  title: string;
  type: 'revenue' | 'customer' | 'activation' | 'performance';
  generatedAt: Date;
  data: any;
  warehouseIds: number[];
}

interface SmartActivationMetrics {
  totalGroups: number;
  activeGroups: number;
  avgActivationRate: number;
  totalMembers: number;
  avgRevenue: number;
  topPerformingGroup: string;
  growthRate: number;
}

interface CustomerSegmentation {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  loyaltyScore: number;
  growthRate: number;
  warehouseDistribution: { [key: number]: number };
}

interface RevenueBreakdown {
  warehouse: string;
  warehouseId: number;
  totalRevenue: number;
  revenueByCustomerType: {
    students: number;
    villagers: number;
    households: number;
  };
  growthRate: number;
  marketShare: number;
}

const CorporateAnalytics: React.FC = () => {
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

  // Local state for analytics-specific filters
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange || '30d');
  const [posAccountId] = useState(1); // This would come from authentication

  // Data fetching effect - now handled by context
  useEffect(() => {
    setSelectedDateRange(dateRange || '30d');
  }, [dateRange]);

  // Filter functions using real data
  const getFilteredWarehouses = () => {
    let filtered = warehouses || [];
    if (selectedBiller && selectedBiller !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.biller_id?.toString() === selectedBiller);
    }
    if (selectedWarehouse && selectedWarehouse !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.id?.toString() === selectedWarehouse);
    }
    return filtered;
  };

  const getFilteredReports = () => {
    // For now, return empty array - would be populated from analytics API
    return [];
  };

  const getFilteredCustomerSegmentation = () => {
    const customerSegmentation = dashboardData?.customerSegmentation || [];
    if (customerSegmentation.length === 0) {
      // Return empty state data
      return [
        {
          segment: 'No Data',
          count: 0,
          revenue: 0,
          avgOrderValue: 0,
          loyaltyScore: 0,
          growthRate: 0,
          warehouseDistribution: {}
        }
      ];
    }
    return customerSegmentation;
  };

  const getFilteredRevenueBreakdown = () => {
    const filteredWarehouses = getFilteredWarehouses();
    if (filteredWarehouses.length === 0) {
      return [];
    }
    
    // TODO: Calculate real revenue breakdown based on filtered warehouses
    // For now, return empty array - would be populated from revenue API
    return [];
  };

  const getCurrentBiller = () => {
    return billers.find(b => b.id.toString() === selectedBiller);
  };

  const getCurrentWarehouse = () => {
    return warehouses.find(w => w.id?.toString() === selectedWarehouse);
  };

  // Handle loading and error states
  if (loading.analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (errors.analytics) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {errors.analytics}
          <Button onClick={refreshData} className="ml-4">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const generateReport = async (type: string) => {
    setLoading(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    const newReport: AnalyticsReport = {
      id: Date.now().toString(),
      title: `New ${type} Report - ${new Date().toLocaleDateString()}`,
      type: type as any,
      generatedAt: new Date(),
      data: {},
      warehouseIds: selectedWarehouse === 'all' ? [1, 2, 3] : [parseInt(selectedWarehouse)]
    };
    
    setReports(prev => [newReport, ...prev]);
  };

  const exportReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Simulate export functionality
      console.log(`Exporting report: ${report.title}`);
      // In real implementation, this would generate and download PDF/Excel
    }
  };

  const getTrendIcon = (rate: number) => {
    if (rate > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (rate < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getSegmentIcon = (segment: string) => {
    if (segment.includes('Student')) return <GraduationCap className="h-5 w-5 text-blue-500" />;
    if (segment.includes('Villager')) return <MapPin className="h-5 w-5 text-green-500" />;
    if (segment.includes('Household')) return <Home className="h-5 w-5 text-purple-500" />;
    return <Users className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6" />
                <span>Corporate Analytics & Reports</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analytics across all warehouses and customer segments
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              {/* Hierarchical Filters */}
              <div className="flex items-center space-x-4">
                {/* POS Account Display */}
                <Select value={posAccountId.toString()} disabled>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="POS Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={posAccountId.toString()}>Account #{posAccountId}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Biller/Region Filter */}
                <Select value={selectedBiller} onValueChange={handleBillerChange}>
                  <SelectTrigger className="w-48">
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

                {/* Warehouse Filter */}
                <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {getFilteredWarehouses().map((warehouse) => (
                      <SelectItem key={warehouse.warehouse_id} value={warehouse.warehouse_id.toString()}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => generateReport('comprehensive')} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>
            
            {/* Current Selection Summary */}
            <div className="flex items-center space-x-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Current Selection:</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">POS Account:</span>
                <Badge variant="outline">#{posAccountId}</Badge>
              </div>
              {selectedBiller !== 'all' && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Biller:</span>
                  <Badge variant="outline">{getCurrentBiller()?.name || 'N/A'}</Badge>
                </div>
              )}
              {selectedWarehouse !== 'all' && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Warehouse:</span>
                  <Badge variant="outline">{getCurrentWarehouse()?.name || 'N/A'}</Badge>
                </div>
              )}
              {(selectedBiller === 'all' || selectedWarehouse === 'all') && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Showing data from {getFilteredWarehouses().length} warehouse(s)</span>
                </div>
              )}
            </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Smart Activation Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{smartActivationMetrics.totalGroups}</p>
                <p className="text-sm text-gray-600">Total Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{smartActivationMetrics.avgActivationRate}%</p>
                <p className="text-sm text-gray-600">Avg Activation Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{smartActivationMetrics.totalMembers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ArrowUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">+{smartActivationMetrics.growthRate}%</p>
                <p className="text-sm text-gray-600">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Segmentation</TabsTrigger>
          <TabsTrigger value="activations">Smart Activations</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
        </TabsList>

        {/* Revenue Analysis Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Warehouse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Revenue by Warehouse</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredRevenueBreakdown().length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No revenue data available for selected filters</p>
                    </div>
                  ) : (
                    getFilteredRevenueBreakdown().map((warehouse) => (
                      <div key={warehouse.warehouseId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{warehouse.warehouse}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Market Share: {warehouse.marketShare}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">KES {warehouse.totalRevenue.toLocaleString()}</p>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(warehouse.growthRate)}
                            <span className="text-sm">{warehouse.growthRate}%</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Type Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Revenue by Customer Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredCustomerSegmentation().length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No customer data available for selected filters</p>
                    </div>
                  ) : (
                    getFilteredCustomerSegmentation().map((segment) => (
                      <div key={segment.segment} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getSegmentIcon(segment.segment)}
                            <span className="font-medium">{segment.segment}</span>
                          </div>
                          <span className="text-sm font-bold">KES {segment.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${segment.revenue > 0 ? (segment.revenue / Math.max(...getFilteredCustomerSegmentation().map(s => s.revenue))) * 100 : 0}%`}}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{segment.count.toLocaleString()} customers</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(segment.growthRate)}
                            <span>{segment.growthRate}% growth</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Segmentation Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {getFilteredCustomerSegmentation().length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Customer Data</h3>
                <p className="text-gray-500">Customer segmentation data will appear here once you have data for the selected filters.</p>
              </div>
            ) : (
              getFilteredCustomerSegmentation().map((segment) => (
                <Card key={segment.segment}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      {getSegmentIcon(segment.segment)}
                      <span>{segment.segment}</span>
                      <Badge variant="outline">
                        {segment.count.toLocaleString()} customers
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">KES {segment.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                      </div>
                      <div className="text-center">
                        <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">KES {segment.avgOrderValue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                      </div>
                      <div className="text-center">
                        <Award className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{segment.loyaltyScore}%</p>
                        <p className="text-sm text-gray-600">Loyalty Score</p>
                      </div>
                      <div className="text-center">
                        <ArrowUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold flex items-center justify-center space-x-1">
                          {getTrendIcon(segment.growthRate)}
                          <span>{segment.growthRate}%</span>
                        </p>
                        <p className="text-sm text-gray-600">Growth Rate</p>
                      </div>
                    </div>
                    
                    {/* Warehouse Distribution */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Warehouse Distribution</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.keys(segment.warehouseDistribution).length === 0 ? (
                          <div className="col-span-3 text-center py-4">
                            <p className="text-gray-500">No warehouse distribution data available</p>
                          </div>
                        ) : (
                          Object.entries(segment.warehouseDistribution).map(([warehouseId, count]) => (
                            <div key={warehouseId} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="font-semibold">Warehouse {warehouseId}</p>
                              <p className="text-xl text-blue-600">{count}</p>
                              <p className="text-sm text-gray-600">customers</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Smart Activations Tab */}
        <TabsContent value="activations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Smart Activation Groups Performance</span>
              </CardTitle>
              <CardDescription>
                Real-time performance tracking of all activation groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Top Performing Groups */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Top Performers</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium">UON Student Association</p>
                        <p className="text-sm text-gray-600">567 members</p>
                      </div>
                      <Badge className="bg-yellow-500">94.2%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium">Westlands Household Cluster</p>
                        <p className="text-sm text-gray-600">234 members</p>
                      </div>
                      <Badge className="bg-blue-500">89.7%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium">Kisumu Rural Cooperative</p>
                        <p className="text-sm text-gray-600">345 members</p>
                      </div>
                      <Badge className="bg-green-500">76.8%</Badge>
                    </div>
                  </div>
                </div>

                {/* Activation Trends */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>Activation Trends</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium">+23.5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Week</span>
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium">+12.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Groups</span>
                      <Badge variant="outline">13/15</Badge>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span>Key Metrics</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold">{smartActivationMetrics.avgActivationRate}%</p>
                      <p className="text-sm text-gray-600">Avg Activation Rate</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold">KES {smartActivationMetrics.avgRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Avg Group Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Generated Reports</span>
              </CardTitle>
              <CardDescription>
                Access and download your corporate analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredReports().length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Reports Available</h3>
                    <p className="text-gray-500 mb-4">
                      {reports.length === 0 
                        ? 'No reports have been generated yet.' 
                        : 'No reports match the current filter criteria.'}
                    </p>
                    <Button onClick={() => generateReport('comprehensive')} disabled={loading}>
                      {loading ? 'Generating...' : 'Generate First Report'}
                    </Button>
                  </div>
                ) : (
                  getFilteredReports().map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{report.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Generated on {report.generatedAt.toLocaleDateString()} • {report.warehouseIds.length} warehouse(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => exportReport(report.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorporateAnalytics;