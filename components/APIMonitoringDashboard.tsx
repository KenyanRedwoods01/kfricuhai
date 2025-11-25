'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  Zap,
  Server,
  Shield,
  BarChart3,
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Settings
} from 'lucide-react';

interface APIMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  requests: number;
  errorRate: number;
  uptime: number;
  lastCheck: string;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
}

interface Alert {
  id: string;
  endpoint: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  source: 'latency' | 'errors' | 'uptime' | 'throughput';
}

interface SecurityEvent {
  id: string;
  type: 'authentication_failure' | 'rate_limit' | 'suspicious_activity' | 'unauthorized_access';
  endpoint: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  resolved: boolean;
}

const APIMonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  // Mock data - replace with real API calls
  const [metrics, setMetrics] = useState<APIMetric[]>([
    {
      name: 'API Response Time',
      value: 245,
      unit: 'ms',
      status: 'good',
      trend: 'down',
      description: 'Average API response time across all endpoints'
    },
    {
      name: 'Request Success Rate',
      value: 99.7,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Percentage of successful API requests'
    },
    {
      name: 'Requests per Second',
      value: 1250,
      unit: 'req/s',
      status: 'excellent',
      trend: 'up',
      description: 'Current API request throughput'
    },
    {
      name: 'Error Rate',
      value: 0.3,
      unit: '%',
      status: 'good',
      trend: 'down',
      description: 'Percentage of failed requests'
    },
    {
      name: 'API Uptime',
      value: 99.9,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Overall API availability'
    },
    {
      name: 'Active Alerts',
      value: 3,
      unit: 'alerts',
      status: 'warning',
      trend: 'up',
      description: 'Number of active API monitoring alerts'
    }
  ]);

  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'Customer Data API',
      method: 'GET',
      path: '/api/v1/customers',
      status: 'healthy',
      responseTime: 180,
      requests: 45230,
      errorRate: 0.1,
      uptime: 99.9,
      lastCheck: '2025-11-25T16:45:00Z',
      latency: { p50: 150, p95: 280, p99: 450 }
    },
    {
      id: '2',
      name: 'Order Processing',
      method: 'POST',
      path: '/api/v1/orders',
      status: 'degraded',
      responseTime: 890,
      requests: 12840,
      errorRate: 2.1,
      uptime: 98.7,
      lastCheck: '2025-11-25T16:44:00Z',
      latency: { p50: 650, p95: 1200, p99: 2100 }
    },
    {
      id: '3',
      name: 'Product Search',
      method: 'GET',
      path: '/api/v1/products/search',
      status: 'healthy',
      responseTime: 120,
      requests: 89650,
      errorRate: 0.05,
      uptime: 99.8,
      lastCheck: '2025-11-25T16:45:00Z',
      latency: { p50: 95, p95: 180, p99: 320 }
    },
    {
      id: '4',
      name: 'User Authentication',
      method: 'POST',
      path: '/api/v1/auth/login',
      status: 'healthy',
      responseTime: 95,
      requests: 23400,
      errorRate: 1.2,
      uptime: 99.6,
      lastCheck: '2025-11-25T16:45:00Z',
      latency: { p50: 80, p95: 140, p99: 280 }
    },
    {
      id: '5',
      name: 'Inventory Update',
      method: 'PUT',
      path: '/api/v1/inventory',
      status: 'down',
      responseTime: 0,
      requests: 5600,
      errorRate: 100,
      uptime: 0,
      lastCheck: '2025-11-25T16:30:00Z',
      latency: { p50: 0, p95: 0, p99: 0 }
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      endpoint: 'Order Processing',
      level: 'warning',
      message: 'Response time increased by 45% in the last hour',
      timestamp: '2025-11-25T16:30:00Z',
      resolved: false,
      source: 'latency'
    },
    {
      id: '2',
      endpoint: 'Inventory Update',
      level: 'critical',
      message: 'Service is down - 100% error rate detected',
      timestamp: '2025-11-25T16:30:00Z',
      resolved: false,
      source: 'errors'
    },
    {
      id: '3',
      endpoint: 'Customer Data API',
      level: 'info',
      message: 'Deployment completed successfully',
      timestamp: '2025-11-25T15:45:00Z',
      resolved: true,
      source: 'uptime'
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'rate_limit',
      endpoint: '/api/v1/auth/login',
      severity: 'medium',
      timestamp: '2025-11-25T16:20:00Z',
      description: 'Rate limit exceeded for IP 192.168.1.100',
      resolved: false
    },
    {
      id: '2',
      type: 'authentication_failure',
      endpoint: '/api/v1/customers',
      severity: 'low',
      timestamp: '2025-11-25T16:15:00Z',
      description: 'Multiple failed login attempts detected',
      resolved: true
    },
    {
      id: '3',
      type: 'suspicious_activity',
      endpoint: '/api/v1/orders',
      severity: 'high',
      timestamp: '2025-11-25T16:10:00Z',
      description: 'Unusual request pattern detected from multiple IPs',
      resolved: false
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate real-time updates
      setTimeout(() => {
        setIsLoading(false);
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
      value: Math.max(0, metric.value + (Math.random() - 0.5) * metric.value * 0.05)
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default: 
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'down': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-orange-200 bg-orange-50';
      case 'critical': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
  };

  const controlEndpoint = (endpointId: string, action: 'restart' | 'enable' | 'disable') => {
    // In real implementation, this would call an API
    console.log(`${action} endpoint: ${endpointId}`);
  };

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">API Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and observability for your API endpoints and services
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

      {/* Key API Metrics */}
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
                    {typeof metric.value === 'number' ? 
                      metric.value < 1000 ? metric.value.toFixed(1) : metric.value.toLocaleString()
                      : metric.value}
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
                      {metric.trend === 'up' ? 'Increased' : metric.trend === 'down' ? 'Decreased' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Events</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Endpoints</span>
                    <span className="font-medium">{endpoints.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Healthy</span>
                    <span className="font-medium text-green-600">
                      {endpoints.filter(e => e.status === 'healthy').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Degraded</span>
                    <span className="font-medium text-yellow-600">
                      {endpoints.filter(e => e.status === 'degraded').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Down</span>
                    <span className="font-medium text-red-600">
                      {endpoints.filter(e => e.status === 'down').length}
                    </span>
                  </div>
                  <Progress 
                    value={(endpoints.filter(e => e.status === 'healthy').length / endpoints.length) * 100} 
                    className="w-full" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-medium">245ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak RPS</span>
                    <span className="font-medium">1,250 req/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-medium text-green-600">99.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium text-red-600">0.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
                  <Alert key={alert.id} className={getAlertLevelColor(alert.level)}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{alert.endpoint}</span>
                          <Badge variant="outline" className={getAlertLevelColor(alert.level)}>
                            {alert.level}
                          </Badge>
                        </div>
                        <AlertDescription className="text-sm">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  API Endpoints
                </CardTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md"
                  />
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md"
                  >
                    <option value="all">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(endpoint.status)}
                        <div>
                          <h4 className="font-medium">{endpoint.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge className={getMethodColor(endpoint.method)} variant="secondary">
                              {endpoint.method}
                            </Badge>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{endpoint.path}</code>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(endpoint.status)} variant="secondary">
                        {endpoint.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-500">Response Time</div>
                        <div className="font-medium">{endpoint.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Requests</div>
                        <div className="font-medium">{endpoint.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Error Rate</div>
                        <div className="font-medium">{endpoint.errorRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Uptime</div>
                        <div className="font-medium">{endpoint.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Latency P95</div>
                        <div className="font-medium">{endpoint.latency.p95}ms</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Last checked: {new Date(endpoint.lastCheck).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => controlEndpoint(endpoint.id, 'restart')}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className={getAlertLevelColor(alert.level)}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{alert.endpoint}</span>
                          <Badge variant="outline" className={getAlertLevelColor(alert.level)}>
                            {alert.level}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {alert.source}
                          </Badge>
                          {alert.resolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{event.type.replace('_', ' ')}</span>
                          <Badge className={getSeverityColor(event.severity)} variant="secondary">
                            {event.severity}
                          </Badge>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{event.endpoint}</code>
                          {event.resolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                      {!event.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveSecurityEvent(event.id)}
                          className="ml-4"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIMonitoringDashboard;