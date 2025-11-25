'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  Server,
  Zap,
  Database,
  TrendingUp,
  TrendingDown,
  PauseCircle,
  PlayCircle,
  Monitor,
  BarChart3
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'failed' | 'completed' | 'pending';
  health: number;
  lastRun: string;
  nextRun: string;
  duration: string;
  type: 'ETL' | 'ELT' | 'Stream' | 'Batch';
  source: string;
  destination: string;
  errorRate: number;
  throughput: number;
}

interface PipelineMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface SystemResource {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface AlertEvent {
  id: string;
  pipeline: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const DataPipelineMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  // Mock data - replace with real API calls
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Daily Customer Sync',
      status: 'running',
      health: 98.5,
      lastRun: '2025-11-25T14:30:00Z',
      nextRun: '2025-11-25T23:59:00Z',
      duration: '00:15:42',
      type: 'ETL',
      source: 'Salesforce CRM',
      destination: 'Data Warehouse',
      errorRate: 0.2,
      throughput: 15420
    },
    {
      id: '2',
      name: 'Real-time Order Processing',
      status: 'running',
      health: 99.1,
      lastRun: '2025-11-25T16:45:00Z',
      nextRun: '2025-11-25T16:46:00Z',
      duration: '00:00:45',
      type: 'Stream',
      source: 'Order API',
      destination: 'Analytics DB',
      errorRate: 0.1,
      throughput: 2150
    },
    {
      id: '3',
      name: 'Weekly Report Generation',
      status: 'completed',
      health: 96.8,
      lastRun: '2025-11-24T02:00:00Z',
      nextRun: '2025-12-01T02:00:00Z',
      duration: '02:45:33',
      type: 'Batch',
      source: 'Multiple Sources',
      destination: 'Report Store',
      errorRate: 0.5,
      throughput: 8500
    },
    {
      id: '4',
      name: 'Inventory Sync',
      status: 'failed',
      health: 45.2,
      lastRun: '2025-11-25T16:30:00Z',
      nextRun: '2025-11-25T17:30:00Z',
      duration: '00:00:23',
      type: 'ETL',
      source: 'ERP System',
      destination: 'Product DB',
      errorRate: 85.7,
      throughput: 0
    }
  ]);

  const [metrics, setMetrics] = useState<PipelineMetric[]>([
    {
      name: 'Active Pipelines',
      value: 24,
      unit: 'pipelines',
      status: 'excellent',
      trend: 'stable'
    },
    {
      name: 'Success Rate',
      value: 97.8,
      unit: '%',
      status: 'excellent',
      trend: 'up'
    },
    {
      name: 'Average Runtime',
      value: 18.5,
      unit: 'minutes',
      status: 'good',
      trend: 'down'
    },
    {
      name: 'Data Processed',
      value: 2.4,
      unit: 'TB/hour',
      status: 'excellent',
      trend: 'up'
    },
    {
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      status: 'good',
      trend: 'down'
    },
    {
      name: 'Queue Depth',
      value: 156,
      unit: 'jobs',
      status: 'warning',
      trend: 'up'
    }
  ]);

  const [systemResources, setSystemResources] = useState<SystemResource>({
    cpu: 68.5,
    memory: 74.2,
    disk: 45.8,
    network: 32.1,
    status: 'warning'
  });

  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: '1',
      pipeline: 'Inventory Sync',
      level: 'error',
      message: 'Connection timeout to ERP system',
      timestamp: '2025-11-25T16:30:45Z',
      resolved: false
    },
    {
      id: '2',
      pipeline: 'Daily Customer Sync',
      level: 'warning',
      message: 'Processing time exceeded SLA (15 min)',
      timestamp: '2025-11-25T14:46:12Z',
      resolved: true
    },
    {
      id: '3',
      pipeline: 'Real-time Order Processing',
      level: 'info',
      message: 'Pipeline deployed successfully',
      timestamp: '2025-11-25T13:15:00Z',
      resolved: true
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call with real-time updates
      setTimeout(() => {
        setIsLoading(false);
        // Simulate real-time updates every 30 seconds
        const interval = setInterval(() => {
          updateMetrics();
        }, 30000);
        
        return () => clearInterval(interval);
      }, 1000);
    };

    loadData();
  }, []);

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, metric.value + (Math.random() - 0.5) * metric.value * 0.1)
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPipelineStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <Badge className="bg-green-100 text-green-800">Running</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const controlPipeline = (pipelineId: string, action: 'start' | 'pause' | 'restart') => {
    setPipelines(prev => prev.map(pipeline => {
      if (pipeline.id === pipelineId) {
        const newStatus = action === 'start' ? 'running' : action === 'pause' ? 'paused' : 'running';
        return { ...pipeline, status: newStatus };
      }
      return pipeline;
    }));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Pipeline Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and management of your data pipelines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Activity className="h-3 w-3 mr-1" />
            Live Monitoring
          </Badge>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? 
                      <TrendingUp className="h-4 w-4 text-green-600" /> : 
                      metric.trend === 'down' ? 
                      <TrendingDown className="h-4 w-4 text-red-600" /> : 
                      <Activity className="h-4 w-4 text-gray-600" />
                    }
                    <span className="text-xs text-gray-500 ml-1">
                      {metric.trend === 'up' ? 'Improved' : metric.trend === 'down' ? 'Declined' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Pipeline Overview</TabsTrigger>
          <TabsTrigger value="active">Active Pipelines</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Events</TabsTrigger>
          <TabsTrigger value="resources">System Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Pipeline Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Pipelines</span>
                    <span className="font-medium">{pipelines.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Running</span>
                    <span className="font-medium text-green-600">
                      {pipelines.filter(p => p.status === 'running').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed</span>
                    <span className="font-medium text-red-600">
                      {pipelines.filter(p => p.status === 'failed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Today</span>
                    <span className="font-medium text-blue-600">
                      {pipelines.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <Progress 
                    value={(pipelines.filter(p => p.status === 'running').length / pipelines.length) * 100} 
                    className="w-full" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Runtime</span>
                    <span className="font-medium">18.5 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Throughput</span>
                    <span className="font-medium">2.4 TB/hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium text-green-600">97.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Queue Depth</span>
                    <span className="font-medium text-yellow-600">156 jobs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Alert Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Critical Alerts</span>
                  <Badge className="bg-red-100 text-red-800">
                    {alerts.filter(a => a.level === 'error' && !a.resolved).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Warnings</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {alerts.filter(a => a.level === 'warning' && !a.resolved).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Info Messages</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {alerts.filter(a => a.level === 'info' && !a.resolved).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                        <CardDescription>
                          {pipeline.type} • {pipeline.source} → {pipeline.destination}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPipelineStatusBadge(pipeline.status)}
                      <div className="text-right">
                        <div className="text-sm font-medium">{pipeline.health}%</div>
                        <div className="text-xs text-gray-500">Health</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Last Run</div>
                      <div className="text-sm font-medium">
                        {new Date(pipeline.lastRun).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-sm font-medium">{pipeline.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Error Rate</div>
                      <div className="text-sm font-medium">{pipeline.errorRate}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Throughput</div>
                      <div className="text-sm font-medium">{pipeline.throughput.toLocaleString()}/hr</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Progress value={pipeline.health} className="w-32" />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlPipeline(pipeline.id, pipeline.status === 'running' ? 'pause' : 'start')}
                      >
                        {pipeline.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {pipeline.status === 'running' ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlPipeline(pipeline.id, 'restart')}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts & Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className={getAlertLevelColor(alert.level)}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{alert.pipeline}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              alert.level === 'error' ? 'border-red-300 text-red-700' :
                              alert.level === 'warning' ? 'border-yellow-300 text-yellow-700' :
                              'border-blue-300 text-blue-700'
                            }
                          >
                            {alert.level}
                          </Badge>
                          {alert.resolved && <Badge variant="outline" className="border-green-300 text-green-700">Resolved</Badge>}
                        </div>
                        <AlertDescription className="text-sm">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                          className="ml-4"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Resource Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm">{systemResources.cpu}%</span>
                  </div>
                  <Progress value={systemResources.cpu} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm">{systemResources.memory}%</span>
                  </div>
                  <Progress value={systemResources.memory} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm">{systemResources.disk}%</span>
                  </div>
                  <Progress value={systemResources.disk} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Network I/O</span>
                    <span className="text-sm">{systemResources.network}%</span>
                  </div>
                  <Progress value={systemResources.network} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Connections</span>
                    <span className="font-medium">142/200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Jobs</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Queue Utilization</span>
                    <span className="font-medium text-yellow-600">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-medium">234ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cache Hit Rate</span>
                    <span className="font-medium text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Memory Usage:</strong> Consider scaling up if usage consistently exceeds 80%.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>CPU Performance:</strong> Currently optimal. Continue monitoring for trends.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPipelineMonitoring;