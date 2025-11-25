import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Bell, 
  Settings, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AdvancedNavigation } from './AdvancedNavigation';
import { useAutoRefresh, useOnlineStatus } from '../hooks/useAutoRefresh';
import { useKpi } from '../contexts/KpiContext';

interface AdvancedLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  theme?: 'light' | 'dark';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const AdvancedLayout: React.FC<AdvancedLayoutProps> = ({
  children,
  title = 'KPI Dashboard - Business Intelligence',
  description = 'Comprehensive business intelligence dashboard with real-time KPIs and analytics',
  keywords = 'dashboard, kpi, business intelligence, analytics, metrics',
  theme: initialTheme = 'light',
  autoRefresh = false,
  refreshInterval = 300000
}) => {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const [theme, setTheme] = useState(initialTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { state: kpiState, actions } = useKpi();
  const { isRefreshing, lastUpdateTime, error: refreshError } = useAutoRefresh({
    enabled: autoRefresh,
    interval: refreshInterval,
    onError: (error) => {
      addNotification({
        title: 'Data Refresh Failed',
        message: error,
        type: 'error'
      });
    }
  });

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = savedTheme || systemTheme;
    
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Notification management
  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Mock notifications based on KPI status
  useEffect(() => {
    if (kpiState.data) {
      const { phase_1, phase_2, phase_3 } = kpiState.data;
      
      if (phase_1.gross_profit_margin < 10) {
        addNotification({
          title: 'Low Profit Margin Alert',
          message: 'Gross profit margin is below 10%. Consider reviewing pricing strategy.',
          type: 'warning'
        });
      }
      
      if (phase_1.sales_growth_rate < 0) {
        addNotification({
          title: 'Sales Decline Alert',
          message: 'Sales growth rate is negative. Immediate attention required.',
          type: 'error'
        });
      }
      
      if (phase_3.customer_churn_rate > 20) {
        addNotification({
          title: 'High Churn Rate',
          message: 'Customer churn rate exceeds 20%. Focus on retention strategies.',
          type: 'warning'
        });
      }
    }
  }, [kpiState.data]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme}`}>
        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Last Update */}
              {lastUpdateTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Updated {lastUpdateTime.toLocaleTimeString()}</span>
                </div>
              )}

              {/* Error Status */}
              {refreshError && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Sync Error</span>
                </div>
              )}
            </div>

            {/* Global Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearNotifications}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <span className="text-white text-sm font-medium">JS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Navigation Sidebar */}
          <AdvancedNavigation
            theme={theme}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Content Area */}
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Global Loading Overlay */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Refreshing dashboard data...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};