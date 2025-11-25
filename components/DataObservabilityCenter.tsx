'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Brain,
  Network,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  Clock,
  Database,
  ArrowRight,
  GitBranch,
  Target,
  Lightbulb
} from 'lucide-react';

interface ObservabilityMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface Anomaly {
  id: string;
  dataset: string;
  metric: string;
  type: 'volume' | 'quality' | 'distribution' | 'freshness';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  description: string;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  aiConfidence: number;
}

interface LineageNode {
  id: string;
  name: string;
  type: 'source' | 'transformation' | 'destination' | 'report';
  status: 'healthy' | 'warning' | 'error';
  metrics: {
    records: number;
    freshness: string;
    quality: number;
  };
}

interface LineageEdge {
  from: string;
  to: string;
  status: 'healthy' | 'warning' | 'error';
  volume: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'quality' | 'performance' | 'cost';
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  estimatedSavings?: string;
  effort: 'low' | 'medium' | 'high';
  type: 'insight' | 'alert' | 'action';
}

const DataObservabilityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API calls
  const [metrics, setMetrics] = useState<ObservabilityMetric[]>([
    {
      name: 'Data Freshness Score',
      value: 96.8,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      description: 'How current your data is compared to business requirements'
    },
    {
      name: 'Data Quality Score',
      value: 94.2,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Overall data quality across all datasets'
    },
    {
      name: 'Anomaly Detection Rate',
      value: 12,
      unit: 'anomalies/week',
      status: 'good',
      trend: 'down',
      description: 'Number of anomalies detected by AI/ML models'
    },
    {
      name: 'Lineage Coverage',
      value: 87.3,
      unit: '%',
      status: 'good',
      trend: 'up',
      description: 'Percentage of data flow mapped with lineage tracking'
    },
    {
      name: 'Mean Time to Detect',
      value: 4.2,
      unit: 'minutes',
      status: 'excellent',
      trend: 'down',
      description: 'Average time to detect data issues'
    },
    {
      name: 'Data Downtime',
      value: 0.05,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Percentage of time data is unavailable'
    }
  ]);

  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      dataset: 'Customer Transactions',
      metric: 'Transaction Volume',
      type: 'volume',
      severity: 'medium',
      detectedAt: '2025-11-25T14:30:00Z',
      description: 'Unusual spike in transaction volume detected (3.2x normal)',
      status: 'investigating',
      aiConfidence: 89.5
    },
    {
      id: '2',
      dataset: 'Product Inventory',
      metric: 'Data Completeness',
      type: 'quality',
      severity: 'low',
      detectedAt: '2025-11-25T12:15:00Z',
      description: 'Slight increase in missing product descriptions',
      status: 'resolved',
      aiConfidence: 76.3
    },
    {
      id: '3',
      dataset: 'Marketing Campaign Data',
      metric: 'Distribution Pattern',
      type: 'distribution',
      severity: 'high',
      detectedAt: '2025-11-25T09:45:00Z',
      description: 'Campaign conversion rates show unusual distribution pattern',
      status: 'detected',
      aiConfidence: 94.7
    }
  ]);

  const [lineageNodes] = useState<LineageNode[]>([
    {
      id: '1',
      name: 'Salesforce CRM',
      type: 'source',
      status: 'healthy',
      metrics: { records: 15420, freshness: '15 min', quality: 98.5 }
    },
    {
      id: '2',
      name: 'ETL Customer Processing',
      type: 'transformation',
      status: 'healthy',
      metrics: { records: 15415, freshness: '12 min', quality: 97.8 }
    },
    {
      id: '3',
      name: 'Customer Data Warehouse',
      type: 'destination',
      status: 'warning',
      metrics: { records: 15415, freshness: '25 min', quality: 96.2 }
    },
    {
      id: '4',
      name: 'Executive Dashboard',
      type: 'report',
      status: 'healthy',
      metrics: { records: 15415, freshness: '30 min', quality: 96.2 }
    }
  ]);

  const [lineageEdges] = useState<LineageEdge[]>([
    { from: '1', to: '2', status: 'healthy', volume: 15420 },
    { from: '2', to: '3', status: 'healthy', volume: 15415 },
    { from: '3', to: '4', status: 'warning', volume: 15415 }
  ]);

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      title: 'Optimize Customer ETL Pipeline',
      description: 'AI analysis suggests 23% performance improvement by implementing parallel processing',
      category: 'optimization',
      priority: 'high',
      impact: 'high',
      estimatedSavings: '$2,400/month',
      effort: 'medium',
      type: 'action'
    },
    {
      id: '2',
      title: 'Data Quality Rule Enhancement',
      description: 'Missing data patterns detected. Recommend adding validation for customer email addresses',
      category: 'quality',
      priority: 'medium',
      impact: 'medium',
      type: 'insight'
    },
    {
      id: '3',
      title: 'Cost Optimization Opportunity',
      description: 'Historical data shows 40% of archived data hasn\'t been accessed in 12+ months',
      category: 'cost',
      priority: 'high',
      impact: 'high',
      estimatedSavings: '$1,800/month',
      effort: 'low',
      type: 'action'
    },
    {
      id: '4',
      title: 'Freshness SLA Breach Prevention',
      description: 'Current trends suggest potential SLA breach in 3 days without intervention',
      category: 'performance',
      priority: 'high',
      impact: 'high',
      type: 'alert'
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default: 
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const getAnomalyStatusBadge = (status: string) => {
    switch (status) {
      case 'detected': return <Badge className="bg-red-100 text-red-800">Detected</Badge>;
      case 'investigating': return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'false_positive': return <Badge className="bg-gray-100 text-gray-800">False Positive</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRecommendationBadge = (category: string) => {
    switch (category) {
      case 'optimization': return <Badge className="bg-blue-100 text-blue-800">Optimization</Badge>;
      case 'quality': return <Badge className="bg-green-100 text-green-800">Quality</Badge>;
      case 'performance': return <Badge className="bg-purple-100 text-purple-800">Performance</Badge>;
      case 'cost': return <Badge className="bg-yellow-100 text-yellow-800">Cost</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">General</Badge>;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'source': return <Database className="h-4 w-4" />;
      case 'transformation': return <GitBranch className="h-4 w-4" />;
      case 'destination': return <Database className="h-4 w-4" />;
      case 'report': return <BarChart3 className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const resolveAnomaly = (anomalyId: string, resolution: 'resolved' | 'false_positive') => {
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === anomalyId ? { ...anomaly, status: resolution } : anomaly
    ));
  };

  const filteredRecommendations = aiRecommendations.filter(rec =>
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Data Observability Center</h1>
          <p className="text-gray-600 mt-2">
            AI-powered data observability with lineage tracking, anomaly detection, and intelligent recommendations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Key Observability Metrics */}
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
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="lineage">Data Lineage</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Observability Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Datasets</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monitoring Coverage</span>
                    <span className="font-medium text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anomalies This Week</span>
                    <span className="font-medium text-yellow-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mean Resolution Time</span>
                    <span className="font-medium">23 minutes</span>
                  </div>
                  <Progress value={94.2} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Accuracy Rate</span>
                    <span className="font-medium text-green-600">94.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">False Positive Rate</span>
                    <span className="font-medium text-blue-600">2.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Predictions Made</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost Savings Identified</span>
                    <span className="font-medium text-green-600">$4,200/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Anomaly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.slice(0, 3).map((anomaly) => (
                  <Alert key={anomaly.id} className={getSeverityColor(anomaly.severity)}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{anomaly.dataset}</span>
                          <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          {getAnomalyStatusBadge(anomaly.status)}
                        </div>
                        <AlertDescription className="text-sm">
                          {anomaly.description}
                        </AlertDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          AI Confidence: {anomaly.aiConfidence}% • {new Date(anomaly.detectedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Anomaly Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <div key={anomaly.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{anomaly.dataset}</h4>
                          <Badge className={getSeverityColor(anomaly.severity)} variant="secondary">
                            {anomaly.severity}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {anomaly.type}
                          </Badge>
                          {getAnomalyStatusBadge(anomaly.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>AI Confidence: {anomaly.aiConfidence}%</span>
                          <span>Detected: {new Date(anomaly.detectedAt).toLocaleString()}</span>
                          <span>Metric: {anomaly.metric}</span>
                        </div>
                      </div>
                      {anomaly.status === 'detected' && (
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAnomaly(anomaly.id, 'resolved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAnomaly(anomaly.id, 'false_positive')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Data Lineage Visualization
              </CardTitle>
              <CardDescription>
                Interactive map showing data flow from sources through transformations to final destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified lineage visualization */}
              <div className="space-y-6">
                {lineageNodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg border-2 ${getStatusColor(node.status)}`}>
                        <div className="flex items-center gap-2">
                          {getNodeIcon(node.type)}
                          <div>
                            <div className="font-medium text-sm">{node.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{node.type}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Records</div>
                            <div className="font-medium">{node.metrics.records.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Freshness</div>
                            <div className="font-medium">{node.metrics.freshness}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Quality</div>
                            <div className="font-medium">{node.metrics.quality}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < lineageNodes.length - 1 && (
                      <div className="mx-4">
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Recommendations
                </CardTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search recommendations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          {getRecommendationBadge(rec.category)}
                          <Badge variant="outline" className={rec.type === 'alert' ? 'border-red-300 text-red-700' : rec.type === 'action' ? 'border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'}>
                            {rec.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Impact: <span className="font-medium">{rec.impact}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Effort: <span className="font-medium">{rec.effort}</span>
                          </span>
                          {rec.estimatedSavings && (
                            <span className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              Savings: <span className="font-medium">{rec.estimatedSavings}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            Priority: <span className={`font-medium ${rec.priority === 'high' ? 'text-red-600' : rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'}`}>{rec.priority}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {rec.type === 'action' && (
                          <Button size="sm">
                            <Zap className="h-4 w-4 mr-1" />
                            Implement
                          </Button>
                        )}
                      </div>
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

export default DataObservabilityCenter;