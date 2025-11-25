'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BarChart3, 
  PieChart,
  LineChart,
  Map,
  Users,
  Globe,
  Clock,
  Target,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Download,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';

interface RealTimeMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface StreamData {
  timestamp: string;
  value: number;
  category?: string;
  location?: string;
}

interface ActiveStream {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'stopped';
  type: 'sales' | 'user_activity' | 'system_metrics' | 'geographic';
  recordsPerSecond: number;
  totalRecords: number;
  lastUpdate: string;
  health: 'excellent' | 'good' | 'warning' | 'critical';
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'heatmap' | 'map' | 'metric';
  size: 'small' | 'medium' | 'large';
  data: any[];
  config: any;
}

const RealTimeAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds

  // Mock data - replace with real API calls
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([
    {
      name: 'Active Users',
      value: 1247,
      unit: 'users',
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="h-4 w-4" />,
      color: 'blue'
    },
    {
      name: 'Revenue (Last Hour)',
      value: 45680,
      unit: 'USD',
      change: 8.3,
      changeType: 'increase',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'green'
    },
    {
      name: 'Orders per Minute',
      value: 23,
      unit: 'orders',
      change: -2.1,
      changeType: 'decrease',
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'purple'
    },
    {
      name: 'System Load',
      value: 68.5,
      unit: '%',
      change: 5.7,
      changeType: 'increase',
      icon: <Activity className="h-4 w-4" />,
      color: 'orange'
    },
    {
      name: 'Geographic Reach',
      value: 47,
      unit: 'countries',
      change: 3.2,
      changeType: 'increase',
      icon: <Globe className="h-4 w-4" />,
      color: 'cyan'
    },
    {
      name: 'API Response Time',
      value: 145,
      unit: 'ms',
      change: -7.8,
      changeType: 'decrease',
      icon: <Zap className="h-4 w-4" />,
      color: 'red'
    }
  ]);

  const [activeStreams, setActiveStreams] = useState<ActiveStream[]>([
    {
      id: '1',
      name: 'Sales Transactions Stream',
      status: 'active',
      type: 'sales',
      recordsPerSecond: 45,
      totalRecords: 895647,
      lastUpdate: '2025-11-25T16:45:00Z',
      health: 'excellent'
    },
    {
      id: '2',
      name: 'User Activity Tracker',
      status: 'active',
      type: 'user_activity',
      recordsPerSecond: 128,
      totalRecords: 2156789,
      lastUpdate: '2025-11-25T16:45:00Z',
      health: 'good'
    },
    {
      id: '3',
      name: 'System Metrics Monitor',
      status: 'active',
      type: 'system_metrics',
      recordsPerSecond: 892,
      totalRecords: 12547632,
      lastUpdate: '2025-11-25T16:45:00Z',
      health: 'excellent'
    },
    {
      id: '4',
      name: 'Geographic Analytics',
      status: 'paused',
      type: 'geographic',
      recordsPerSecond: 0,
      totalRecords: 456789,
      lastUpdate: '2025-11-25T15:30:00Z',
      health: 'warning'
    }
  ]);

  const [streamData, setStreamData] = useState<StreamData[]>([
    { timestamp: '16:40', value: 234 },
    { timestamp: '16:41', value: 267 },
    { timestamp: '16:42', value: 189 },
    { timestamp: '16:43', value: 301 },
    { timestamp: '16:44', value: 278 },
    { timestamp: '16:45', value: 312 }
  ]);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setRealTimeMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * metric.value * 0.1),
        change: Math.random() * 20 - 10
      })));

      // Update stream data
      setStreamData(prev => {
        const newData = [...prev.slice(-5)];
        newData.push({
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          value: Math.floor(Math.random() * 300) + 100
        });
        return newData;
      });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isStreaming, refreshInterval]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'stopped': return <Badge className="bg-gray-100 text-gray-800">Stopped</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getMetricColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
      cyan: 'text-cyan-600 bg-cyan-50',
      red: 'text-red-600 bg-red-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600 bg-gray-50';
  };

  const controlStream = (streamId: string, action: 'start' | 'pause' | 'stop') => {
    setActiveStreams(prev => prev.map(stream => {
      if (stream.id === streamId) {
        const newStatus = action === 'start' ? 'active' : action === 'pause' ? 'paused' : 'stopped';
        return { ...stream, status: newStatus };
      }
      return stream;
    }));
  };

  const exportData = () => {
    // In real implementation, this would export current data
    console.log('Exporting real-time data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics</h1>
          <p className="text-gray-600 mt-2">
            Live streaming data and real-time analytics for immediate insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Auto-refresh:</span>
            <Button
              size="sm"
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {autoRefresh ? 'On' : 'Off'}
            </Button>
          </div>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-1 text-sm border rounded-md"
            disabled={!autoRefresh}
          >
            <option value={1}>1s</option>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={30}>30s</option>
          </select>
          <Button size="sm" variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Badge variant="outline" className="text-sm">
            {isStreaming ? (
              <><Activity className="h-3 w-3 mr-1 animate-pulse" /> Live</>
            ) : (
              <><Pause className="h-3 w-3 mr-1" /> Paused</>
            )}
          </Badge>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {realTimeMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.name}
                </CardTitle>
                <div className={`p-2 rounded-lg ${getMetricColor(metric.color)}`}>
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {metric.changeType === 'increase' ? 
                      <TrendingUp className="h-4 w-4 text-green-600" /> : 
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    }
                    <span className={`text-xs ml-1 ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last hour</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">Data Streams</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Streaming Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Streams</span>
                    <span className="font-medium">{activeStreams.filter(s => s.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total RPS</span>
                    <span className="font-medium">
                      {activeStreams.reduce((sum, s) => sum + s.recordsPerSecond, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Processed Today</span>
                    <span className="font-medium">
                      {(activeStreams.reduce((sum, s) => sum + s.totalRecords, 0) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stream Health</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <Progress value={87.3} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <Zap className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">High-value transaction detected</div>
                      <div className="text-xs text-gray-500">2 seconds ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">User spike from mobile app</div>
                      <div className="text-xs text-gray-500">15 seconds ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">New geographic region activity</div>
                      <div className="text-xs text-gray-500">1 minute ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">System load increasing</div>
                      <div className="text-xs text-gray-500">3 minutes ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Real-Time Data Flow
              </CardTitle>
              <CardDescription>
                Live streaming data visualization updated every {refreshInterval} seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Real-time streaming chart would be rendered here</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Data points: {streamData.length} • Last update: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Active Data Streams
                </CardTitle>
                <Button
                  size="sm"
                  variant={isStreaming ? "default" : "outline"}
                  onClick={() => setIsStreaming(!isStreaming)}
                >
                  {isStreaming ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                  {isStreaming ? 'Pause All' : 'Resume All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeStreams.map((stream) => (
                  <div key={stream.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getHealthColor(stream.health)}`}>
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{stream.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{stream.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(stream.status)}
                        <Badge className={getHealthColor(stream.health)} variant="secondary">
                          {stream.health}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-500">RPS</div>
                        <div className="font-medium">{stream.recordsPerSecond.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Records</div>
                        <div className="font-medium">{stream.totalRecords.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Data Size</div>
                        <div className="font-medium">
                          {(stream.totalRecords * 0.5 / 1024 / 1024).toFixed(1)}MB
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Last Update</div>
                        <div className="font-medium">
                          {new Date(stream.lastUpdate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Progress value={stream.status === 'active' ? 85 : 0} className="w-32" />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlStream(stream.id, stream.status === 'active' ? 'pause' : 'start')}
                        >
                          {stream.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlStream(stream.id, 'stop')}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Real-time geographic heat map</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Real-time category distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Multi-Dimensional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Throughput</span>
                      <span className="font-medium">1,265 req/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency</span>
                      <span className="font-medium">145ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium text-red-600">0.3%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Business Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-medium">4.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value</span>
                      <span className="font-medium">$67.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer LTV</span>
                      <span className="font-medium">$1,240</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">System Health</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>CPU Usage</span>
                      <span className="font-medium">68.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory</span>
                      <span className="font-medium">74.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network I/O</span>
                      <span className="font-medium">32.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI-Powered Real-Time Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-blue-900">Predictive Alert</h4>
                        <Badge className="bg-blue-200 text-blue-800">High Confidence</Badge>
                      </div>
                      <p className="text-blue-800 text-sm mb-2">
                        System predicts 25% increase in traffic in the next 30 minutes based on current patterns.
                        Consider scaling resources proactively.
                      </p>
                      <div className="text-xs text-blue-700">
                        Generated 30 seconds ago • Confidence: 89%
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      Take Action
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-green-900">Optimization Opportunity</h4>
                        <Badge className="bg-green-200 text-green-800">Cost Savings</Badge>
                      </div>
                      <p className="text-green-800 text-sm mb-2">
                        Identified 15% cost reduction opportunity by optimizing data stream processing patterns.
                        Potential savings: $1,200/month.
                      </p>
                      <div className="text-xs text-green-700">
                        Generated 2 minutes ago • Impact: Medium
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-yellow-900">Anomaly Detection</h4>
                        <Badge className="bg-yellow-200 text-yellow-800">Investigation Required</Badge>
                      </div>
                      <p className="text-yellow-800 text-sm mb-2">
                        Unusual activity pattern detected in European markets. User engagement increased 340% 
                        above normal baseline.
                      </p>
                      <div className="text-xs text-yellow-700">
                        Generated 5 minutes ago • Status: Investigating
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4">
                      Investigate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Refresh Stream Intervals</div>
                      <div className="text-xs text-gray-500">Optimize performance based on data velocity</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Optimize
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Add Geographic Visualization</div>
                      <div className="text-xs text-gray-500">Real-time world map of user activity</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Add Widget
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">Configure Filters</div>
                      <div className="text-xs text-gray-500">Set up automated data filtering rules</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeAnalytics;