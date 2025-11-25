import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Target,
  Zap,
  Brain,
  Database,
  Shield,
  Monitor,
  Eye,
  Globe,
  CheckCircle,
  AlertTriangle,
  Server,
  GitBranch,
  Cpu,
  Loader2,
  Sparkles,
  Layers,
  Play,
  MousePointer
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  color?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    description: 'Main dashboard overview'
  },
  {
    id: 'kpi',
    label: 'KPI Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      {
        id: 'kpi-overview',
        label: 'Overview',
        href: '/dashboard/kpi',
        icon: <LayoutDashboard className="w-4 h-4" />,
        description: 'Complete KPI overview'
      },
      {
        id: 'kpi-phase1',
        label: 'Phase 1: Quick Wins',
        href: '/dashboard/kpi/quick-wins',
        icon: <Zap className="w-4 h-4" />,
        color: 'text-green-600',
        description: 'High-impact quick wins KPIs'
      },
      {
        id: 'kpi-phase2',
        label: 'Phase 2: Advanced Analytics',
        href: '/dashboard/kpi/advanced-analytics',
        icon: <Target className="w-4 h-4" />,
        color: 'text-blue-600',
        description: 'Deep operational insights and analytics'
      },
      {
        id: 'kpi-phase3',
        label: 'Phase 3: Strategic Intelligence',
        href: '/dashboard/kpi/strategic-insights',
        icon: <Brain className="w-4 h-4" />,
        color: 'text-purple-600',
        description: 'Long-term strategic planning and intelligence'
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    children: [
      {
        id: 'sales-analytics',
        label: 'Sales Analytics',
        href: '/dashboard/analytics/sales',
        icon: <TrendingUp className="w-4 h-4" />,
        description: 'Sales performance analysis'
      },
      {
        id: 'customer-analytics',
        label: 'Customer Analytics',
        href: '/dashboard/analytics/customers',
        icon: <Users className="w-4 h-4" />,
        description: 'Customer behavior insights'
      },
      {
        id: 'inventory-analytics',
        label: 'Inventory Analytics',
        href: '/dashboard/analytics/inventory',
        icon: <Package className="w-4 h-4" />,
        description: 'Inventory performance tracking'
      }
    ]
  },
  {
    id: 'data-engineering',
    label: 'Data Engineering',
    icon: <Database className="w-5 h-5" />,
    children: [
      {
        id: 'data-quality',
        label: 'Data Quality',
        href: '/dashboard/data-engineering/data-quality',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600',
        description: 'Monitor and maintain data quality metrics'
      },
      {
        id: 'pipeline-monitoring',
        label: 'Pipeline Monitoring',
        href: '/dashboard/data-engineering/pipeline-monitoring',
        icon: <Monitor className="w-4 h-4" />,
        color: 'text-blue-600',
        description: 'Real-time pipeline health and performance'
      },
      {
        id: 'data-governance',
        label: 'Data Governance',
        href: '/dashboard/data-engineering/data-governance',
        icon: <Shield className="w-4 h-4" />,
        color: 'text-purple-600',
        description: 'Compliance and governance monitoring'
      },
      {
        id: 'data-observability',
        label: 'Data Observability',
        href: '/dashboard/data-engineering/data-observability',
        icon: <Eye className="w-4 h-4" />,
        color: 'text-cyan-600',
        description: 'AI-powered observability and insights'
      },
      {
        id: 'api-monitoring',
        label: 'API Monitoring',
        href: '/dashboard/data-engineering/api-monitoring',
        icon: <Globe className="w-4 h-4" />,
        color: 'text-orange-600',
        description: 'API performance and security monitoring'
      },
      {
        id: 'real-time-analytics',
        label: 'Real-Time Analytics',
        href: '/dashboard/data-engineering/real-time-analytics',
        icon: <Activity className="w-4 h-4" />,
        color: 'text-red-600',
        description: 'Live streaming data and analytics'
      }
    ]
  },
  {
    id: 'animated-dashboards',
    label: 'Animated Dashboards',
    icon: <Zap className="w-5 h-5" />,
    description: 'Interactive animations and micro-interactions',
    children: [
      {
        id: 'animated-kpi',
        label: 'Animated KPI Dashboard',
        href: '/dashboard/animated/kpi',
        icon: <BarChart3 className="w-4 h-4" />,
        color: 'text-green-600',
        description: 'KPI cards with GSAP animations and micro-interactions'
      },
      {
        id: 'animated-charts',
        label: 'Animated Charts',
        href: '/dashboard/animated/charts',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-blue-600',
        description: 'Interactive charts with racing bars and progressive reveal'
      },
      {
        id: 'real-time-streaming',
        label: 'Real-Time Streaming',
        href: '/dashboard/animated/streaming',
        icon: <Activity className="w-4 h-4" />,
        color: 'text-purple-600',
        description: 'Live data streaming with GSAP ticker animations'
      },
      {
        id: 'advanced-loading',
        label: 'Advanced Loading',
        href: '/dashboard/animated/loading',
        icon: <Loader2 className="w-4 h-4" />,
        color: 'text-orange-600',
        description: 'Skeleton screens, progress bars, and loading animations'
      },
      {
        id: 'micro-interactions',
        label: 'Micro-Interactions',
        href: '/dashboard/animated/interactions',
        icon: <Target className="w-4 h-4" />,
        color: 'text-cyan-600',
        description: 'Hover effects, tooltips, and interactive feedback'
      }
    ]
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/dashboard/sales',
    icon: <ShoppingCart className="w-5 h-5" />,
    badge: 23,
    description: 'Sales management'
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/dashboard/customers',
    icon: <Users className="w-5 h-5" />,
    description: 'Customer relationship management'
  },
  {
    id: 'products',
    label: 'Products',
    href: '/dashboard/products',
    icon: <Package className="w-5 h-5" />,
    description: 'Product catalog management'
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/dashboard/documents',
    icon: <FileText className="w-5 h-5" />,
    description: 'Document generation & management'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <FileText className="w-5 h-5" />,
    description: 'Business reports'
  }
];

interface AdvancedNavigationProps {
  theme?: 'light' | 'dark';
  collapsed?: boolean;
  onToggle?: () => void;
}

export const AdvancedNavigation: React.FC<AdvancedNavigationProps> = ({
  theme = 'light',
  collapsed = false,
  onToggle
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['kpi', 'data-engineering', 'animated-dashboards']);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => router.pathname === href;
  const isParentActive = (children: NavigationItem[]) => 
    children.some(child => child.href && isActive(child.href));

  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => 
      child.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const NavItem: React.FC<{ item: NavigationItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isCurrentActive = item.href ? isActive(item.href) : isParentActive(item.children || []);
    const itemClasses = `
      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${level > 0 ? 'ml-6' : ''}
      ${isCurrentActive
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }
      ${collapsed && level === 0 ? 'justify-center' : ''}
    `;

    return (
      <div>
        <div className={itemClasses}>
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="flex items-center flex-1 w-full"
            >
              <div className={`flex items-center ${item.color || ''}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <div className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </>
              )}
            </button>
          ) : item.href ? (
            <Link href={item.href} className="flex items-center flex-1 w-full">
              <div className={`flex items-center ${item.color || ''}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ) : (
            <div className="flex items-center flex-1 w-full">
              <div className={`flex items-center ${item.color || ''}`}>
                {item.icon}
              </div>
              {!collapsed && (
                <span className="ml-3 flex-1">{item.label}</span>
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => (
              <NavItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">KPI Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Business Intelligence</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.map(item => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">JS</span>
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@company.com</p>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <Link 
              href="/dashboard/settings"
              className="flex items-center mt-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};