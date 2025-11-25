'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Database,
  Clock,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface DataQualityMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
  lastUpdated: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  health: number;
  issues: number;
  lastSync: string;
  status: 'healthy' | 'warning' | 'error';
}

interface DataQualityDimension {
  dimension: string;
  score: number;
  issues: string[];
  improvementAreas: string[];
}

const DataQualityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real API calls
  const [qualityMetrics, setQualityMetrics] = useState<DataQualityMetric[]>([
    {
      name: 'Data to Errors Ratio',
      value: 95.2,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      description: 'Percentage of clean data vs total data processed',
      lastUpdated: '2025-11-25T16:45:00Z'
    },
    {
      name: 'Empty Values Count',
      value: 234,
      unit: 'records',
      status: 'warning',
      trend: 'down',
      description: 'Number of records with missing critical information',
      lastUpdated: '2025-11-25T16:30:00Z'
    },
    {
      name: 'Duplicate Records',
      value: 1.2,
      unit: '%',
      status: 'good',
      trend: 'stable',
      description: 'Percentage of duplicate entries in datasets',
      lastUpdated: '2025-11-25T16:30:00Z'
    },
    {
      name: 'Pipeline Incidents',
      value: 0,
      unit: 'incidents',
      status: 'excellent',
      trend: 'down',
      description: 'Number of data pipeline failures in last 24h',
      lastUpdated: '2025-11-25T16:45:00Z'
    },
    {
      name: 'Data Freshness',
      value: 98.7,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      description: 'Percentage of data updated within expected timeframe',
      lastUpdated: '2025-11-25T16:45:00Z'
    },
    {
      name: 'Storage Cost Efficiency',
      value: 87.3,
      unit: '%',
      status: 'good',
      trend: 'up',
      description: 'Storage cost optimization score',
      lastUpdated: '2025-11-25T16:30:00Z'
    }
  ]);

  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Customer Database',
      type: 'PostgreSQL',
      health: 98.5,
      issues: 2,
      lastSync: '2025-11-25T16:30:00Z',
      status: 'healthy'
    },
    {
      id: '2',
      name: 'Sales API',
      type: 'REST API',
      health: 92.1,
      issues: 8,
      lastSync: '2025-11-25T16:25:00Z',
      status: 'warning'
    },
    {
      id: '3',
      name: 'Inventory System',
      type: 'MySQL',
      health: 99.2,
      issues: 1,
      lastSync: '2025-11-25T16:40:00Z',
      status: 'healthy'
    }
  ]);

  const [qualityDimensions, setQualityDimensions] = useState<DataQualityDimension[]>([
    {
      dimension: 'Accuracy',
      score: 96.8,
      issues: ['Minor inconsistencies in product descriptions'],
      improvementAreas: ['Implement data validation rules', 'Add cross-reference checks']
    },
    {
      dimension: 'Completeness',
      score: 89.2,
      issues: ['Missing customer phone numbers in 15% of records'],
      improvementAreas: ['Enforce required field validation', 'Implement data collection improvements']
    },
    {
      dimension: 'Consistency',
      score: 94.5,
      issues: ['Date format inconsistencies across sources'],
      improvementAreas: ['Standardize date formats', 'Implement data transformation layer']
    },
    {
      dimension: 'Timeliness',
      score: 97.1,
      issues: ['Delayed updates from legacy systems'],
      improvementAreas: ['Optimize batch processing', 'Implement streaming updates']
    },
    {
      dimension: 'Uniqueness',
      score: 98.7,
      issues: ['Minimal duplicate detection issues'],
      improvementAreas: ['Refine duplicate detection algorithms']
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Data Quality Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and maintain high-quality data across your organization
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {qualityMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.name}
                </CardTitle>
                {getStatusIcon(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}{metric.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-gray-500 ml-1">
                      {metric.trend === 'up' ? 'Improved' : metric.trend === 'down' ? 'Declined' : 'Stable'}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(metric.status)} variant="secondary">
                  {metric.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Quality Overview</TabsTrigger>
          <TabsTrigger value="dimensions">Quality Dimensions</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Overall Data Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">94.2%</div>
                    <p className="text-gray-600">Excellent Quality</p>
                  </div>
                  <Progress value={94.2} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>12,847 Records Processed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>234 Issues Identified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Quality Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excellent (>95%)</span>
                    <span className="text-sm font-medium">78.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Good (85-95%)</span>
                    <span className="text-sm font-medium">15.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning (70-85%)</span>
                    <span className="text-sm font-medium">4.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical (<70%)</span>
                    <span className="text-sm font-medium">1.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Data Quality Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Customer phone numbers missing in 15% of new records from Sales API
                  </AlertDescription>
                </Alert>
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Inventory sync delayed by 2 hours due to database connection timeout
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Duplicate customer entries detected in marketing database (124 records)
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {qualityDimensions.map((dimension, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{dimension.dimension}</CardTitle>
                    <Badge className={getStatusColor(dimension.score > 95 ? 'excellent' : dimension.score > 85 ? 'good' : dimension.score > 70 ? 'warning' : 'critical')}>
                      {dimension.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Current Issues:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dimension.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Improvement Areas:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dimension.improvementAreas.map((area, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Progress value={dimension.score} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Source Health Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.status)}
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-gray-600">{source.type}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium">{source.health}% Health</div>
                        <div className="text-sm text-gray-600">{source.issues} issues</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Last Sync</div>
                        <div className="text-sm">{new Date(source.lastSync).toLocaleTimeString()}</div>
                      </div>
                      <Badge className={getStatusColor(source.status === 'healthy' ? 'excellent' : source.status === 'warning' ? 'warning' : 'critical')}>
                        {source.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Data Quality Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  [Chart visualization would go here - trending quality metrics over time]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Queue Processing Rate</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium">0.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Freshness</span>
                    <span className="font-medium">15 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Great Progress:</strong> Data quality has improved by 3.2% this month through automated validation rules.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Action Required:</strong> Sales API integration needs attention - consider implementing retry logic and connection pooling.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Process Improvement:</strong> Consider training team on proper data entry procedures to reduce empty values by 40%.
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

export default DataQualityDashboard;