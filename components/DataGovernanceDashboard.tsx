'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  FileText, 
  Lock, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Key,
  Globe,
  BookOpen,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity
} from 'lucide-react';

interface GovernanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface ComplianceStandard {
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAudit: string;
  nextReview: string;
  requirements: {
    total: number;
    met: number;
    pending: number;
  };
}

interface DataAsset {
  id: string;
  name: string;
  category: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  owner: string;
  lastAccessed: string;
  accessCount: number;
  violations: number;
  encrypted: boolean;
  compliant: boolean;
}

interface AccessControl {
  id: string;
  user: string;
  role: string;
  assets: number;
  lastLogin: string;
  riskLevel: 'low' | 'medium' | 'high';
  violations: number;
}

interface Policy {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'deprecated';
  enforcement: 'strict' | 'moderate' | 'permissive';
  violations: number;
  lastUpdated: string;
}

const DataGovernanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real API calls
  const [governanceMetrics, setGovernanceMetrics] = useState<GovernanceMetric[]>([
    {
      name: 'Overall Compliance Score',
      value: 94.2,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      description: 'Overall data governance compliance across all standards'
    },
    {
      name: 'Data Classification Coverage',
      value: 87.6,
      unit: '%',
      status: 'good',
      trend: 'up',
      description: 'Percentage of data assets properly classified'
    },
    {
      name: 'Access Control Compliance',
      value: 96.1,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Adherence to access control policies and procedures'
    },
    {
      name: 'Policy Violations',
      value: 23,
      unit: 'incidents',
      status: 'warning',
      trend: 'down',
      description: 'Total policy violations in the last 30 days'
    },
    {
      name: 'Data Encryption Coverage',
      value: 98.9,
      unit: '%',
      status: 'excellent',
      trend: 'up',
      description: 'Percentage of sensitive data properly encrypted'
    },
    {
      name: 'Audit Trail Completeness',
      value: 99.2,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      description: 'Completeness of audit logs for data access and changes'
    }
  ]);

  const [complianceStandards, setComplianceStandards] = useState<ComplianceStandard[]>([
    {
      name: 'GDPR (General Data Protection Regulation)',
      description: 'European Union data protection and privacy regulation',
      status: 'compliant',
      score: 96.8,
      lastAudit: '2025-11-15T00:00:00Z',
      nextReview: '2026-02-15T00:00:00Z',
      requirements: { total: 45, met: 44, pending: 1 }
    },
    {
      name: 'SOX (Sarbanes-Oxley)',
      description: 'U.S. federal law for financial reporting and accounting',
      status: 'compliant',
      score: 94.3,
      lastAudit: '2025-11-10T00:00:00Z',
      nextReview: '2026-01-10T00:00:00Z',
      requirements: { total: 32, met: 30, pending: 2 }
    },
    {
      name: 'ISO 27001',
      description: 'International standard for information security management',
      status: 'partial',
      score: 87.5,
      lastAudit: '2025-11-20T00:00:00Z',
      nextReview: '2026-03-20T00:00:00Z',
      requirements: { total: 114, met: 99, pending: 15 }
    },
    {
      name: 'HIPAA',
      description: 'U.S. healthcare data protection and privacy law',
      status: 'compliant',
      score: 98.1,
      lastAudit: '2025-11-12T00:00:00Z',
      nextReview: '2026-02-12T00:00:00Z',
      requirements: { total: 18, met: 18, pending: 0 }
    }
  ]);

  const [dataAssets, setDataAssets] = useState<DataAsset[]>([
    {
      id: '1',
      name: 'Customer Database',
      category: 'Customer Data',
      sensitivity: 'confidential',
      owner: 'Marketing Team',
      lastAccessed: '2025-11-25T14:30:00Z',
      accessCount: 1247,
      violations: 2,
      encrypted: true,
      compliant: true
    },
    {
      id: '2',
      name: 'Financial Records',
      category: 'Financial Data',
      sensitivity: 'restricted',
      owner: 'Finance Team',
      lastAccessed: '2025-11-25T09:15:00Z',
      accessCount: 89,
      violations: 0,
      encrypted: true,
      compliant: true
    },
    {
      id: '3',
      name: 'Product Catalog',
      category: 'Business Data',
      sensitivity: 'internal',
      owner: 'Product Team',
      lastAccessed: '2025-11-25T16:45:00Z',
      accessCount: 523,
      violations: 1,
      encrypted: false,
      compliant: false
    },
    {
      id: '4',
      name: 'Employee Records',
      category: 'HR Data',
      sensitivity: 'restricted',
      owner: 'HR Team',
      lastAccessed: '2025-11-25T11:20:00Z',
      accessCount: 67,
      violations: 0,
      encrypted: true,
      compliant: true
    }
  ]);

  const [accessControls, setAccessControls] = useState<AccessControl[]>([
    {
      id: '1',
      user: 'john.doe@company.com',
      role: 'Data Analyst',
      assets: 12,
      lastLogin: '2025-11-25T15:30:00Z',
      riskLevel: 'low',
      violations: 0
    },
    {
      id: '2',
      user: 'jane.smith@company.com',
      role: 'Database Administrator',
      assets: 45,
      lastLogin: '2025-11-25T14:45:00Z',
      riskLevel: 'medium',
      violations: 1
    },
    {
      id: '3',
      user: 'bob.wilson@company.com',
      role: 'Marketing Manager',
      assets: 8,
      lastLogin: '2025-11-24T16:20:00Z',
      riskLevel: 'high',
      violations: 3
    }
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Data Classification Policy',
      category: 'Data Classification',
      status: 'active',
      enforcement: 'strict',
      violations: 5,
      lastUpdated: '2025-11-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Access Control Policy',
      category: 'Access Management',
      status: 'active',
      enforcement: 'strict',
      violations: 12,
      lastUpdated: '2025-11-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Data Retention Policy',
      category: 'Data Lifecycle',
      status: 'active',
      enforcement: 'moderate',
      violations: 8,
      lastUpdated: '2025-10-20T00:00:00Z'
    },
    {
      id: '4',
      name: 'Encryption Standard',
      category: 'Security',
      status: 'active',
      enforcement: 'strict',
      violations: 2,
      lastUpdated: '2025-11-10T00:00:00Z'
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
      case 'compliant':
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
      case 'partial':
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'non-compliant':
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default: 
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'public': return 'text-green-600 bg-green-50';
      case 'internal': return 'text-blue-600 bg-blue-50';
      case 'confidential': return 'text-yellow-600 bg-yellow-50';
      case 'restricted': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPolicyStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'deprecated': return <Badge className="bg-gray-100 text-gray-800">Deprecated</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getEnforcementBadge = (enforcement: string) => {
    switch (enforcement) {
      case 'strict': return <Badge className="bg-red-100 text-red-800">Strict</Badge>;
      case 'moderate': return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>;
      case 'permissive': return <Badge className="bg-green-100 text-green-800">Permissive</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Data Governance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor compliance, data policies, and governance metrics across your organization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Shield className="h-3 w-3 mr-1" />
            Compliance Monitoring
          </Badge>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Key Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {governanceMetrics.map((metric, index) => (
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="assets">Data Assets</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Governance Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Standards</span>
                    <span className="font-medium">{complianceStandards.filter(s => s.status === 'compliant').length}/{complianceStandards.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Assets</span>
                    <span className="font-medium">{dataAssets.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Policies</span>
                    <span className="font-medium">{policies.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Violations</span>
                    <span className="font-medium text-red-600">
                      {policies.reduce((sum, p) => sum + p.violations, 0)}
                    </span>
                  </div>
                  <Progress value={94.2} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">GDPR audit completed</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">3 policy violations detected</div>
                      <div className="text-xs text-gray-500">4 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">New encryption policy deployed</div>
                      <div className="text-xs text-gray-500">1 day ago</div>
                    </div>
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
                Governance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Policy Violation:</strong> Unencrypted sensitive data detected in Product Catalog
                  </AlertDescription>
                </Alert>
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Access Alert:</strong> User bob.wilson@company.com has excessive permissions
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Review Due:</strong> ISO 27001 compliance review scheduled for next month
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="space-y-4">
            {complianceStandards.map((standard, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{standard.name}</CardTitle>
                      <CardDescription className="mt-1">{standard.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{standard.score}%</div>
                      <Badge className={getStatusColor(standard.status)} variant="secondary">
                        {standard.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Requirements Met</div>
                      <div className="text-sm font-medium">{standard.requirements.met}/{standard.requirements.total}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Last Audit</div>
                      <div className="text-sm font-medium">
                        {new Date(standard.lastAudit).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Next Review</div>
                      <div className="text-sm font-medium">
                        {new Date(standard.nextReview).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Pending Issues</div>
                      <div className="text-sm font-medium text-yellow-600">
                        {standard.requirements.pending}
                      </div>
                    </div>
                  </div>
                  <Progress value={standard.score} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Asset Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{asset.name}</h4>
                          <p className="text-sm text-gray-600">{asset.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Badge className={getSensitivityColor(asset.sensitivity)}>
                          {asset.sensitivity}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">Sensitivity</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{asset.accessCount}</div>
                        <div className="text-xs text-gray-500">Accesses</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{asset.violations}</div>
                        <div className="text-xs text-gray-500">Violations</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {asset.encrypted ? <Lock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-red-600" />}
                        {asset.compliant ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Control Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessControls.map((control) => (
                  <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{control.user}</h4>
                          <p className="text-sm text-gray-600">{control.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium">{control.assets}</div>
                        <div className="text-xs text-gray-500">Assets</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {new Date(control.lastLogin).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">Last Login</div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(control.riskLevel)} variant="secondary">
                          {control.riskLevel} risk
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{control.violations} violations</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Governance Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{policy.name}</h4>
                          <p className="text-sm text-gray-600">{policy.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {getPolicyStatusBadge(policy.status)}
                        {getEnforcementBadge(policy.enforcement)}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">{policy.violations}</div>
                        <div className="text-xs text-gray-500">Violations</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {new Date(policy.lastUpdated).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">Last Updated</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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

export default DataGovernanceDashboard;