import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeSync } from './RealTimeSyncProvider';
import {
  Bell,
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
  Globe,
  Volume2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Plus,
  Edit,
  Trash2,
  Save,
  User,
  Phone,
  Shield,
  Zap,
  BarChart3,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { format, subHours } from 'date-fns';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  category: 'orders' | 'products' | 'revenue' | 'loyalty' | 'system' | 'alerts';
  trigger: 'threshold' | 'event' | 'schedule' | 'anomaly';
  conditions: {
    metric?: string;
    operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    value?: number;
    timeframe?: string;
  };
  channels: ('email' | 'sms' | 'push' | 'in-app')[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  cooldownMinutes: number;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  category: string;
  variables: string[];
  channels: string[];
}

interface Notification {
  id: string;
  ruleId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  channel: 'email' | 'sms' | 'push' | 'in-app';
  isRead: boolean;
  isDelivered: boolean;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
    verificationCode?: string;
    verified: boolean;
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
    verificationCode?: string;
    verified: boolean;
  };
  push: {
    enabled: boolean;
    permissions: boolean;
  };
  inApp: {
    enabled: boolean;
    sounds: boolean;
    desktop: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  preferences: {
    categories: Record<string, { email: boolean; sms: boolean; push: boolean; inApp: boolean }>;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  };
}

const notificationTypes = {
  info: { icon: Info, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' },
  warning: { icon: AlertTriangle, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  error: { icon: XCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
  success: { icon: CheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-800' }
};

const NotificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'notifications' | 'settings' | 'templates'>('rules');
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Real-time sync for notifications
  const { data: realTimeData } = useRealTimeSync({
    channel: 'notifications',
    onMessage: handleRealTimeNotification
  });

  function handleRealTimeNotification(message: any) {
    if (message.type === 'NEW_NOTIFICATION') {
      setNotifications(prev => [message.data, ...prev.slice(0, 99)]); // Keep latest 100
    } else if (message.type === 'NOTIFICATION_READ') {
      setNotifications(prev => prev.map(n => 
        n.id === message.data.id ? { ...n, isRead: true } : n
      ));
    }
  }

  // Mock data generators
  const generateMockRules = useCallback((): NotificationRule[] => [
    {
      id: 'rule-1',
      name: 'Low Stock Alert',
      description: 'Alert when product stock falls below 10 units',
      category: 'products',
      trigger: 'threshold',
      conditions: { metric: 'stock', operator: 'lt', value: 10, timeframe: '1h' },
      channels: ['email', 'push'],
      isActive: true,
      priority: 'high',
      cooldownMinutes: 30,
      createdAt: subHours(new Date(), 24),
      triggerCount: 5
    },
    {
      id: 'rule-2',
      name: 'High Order Volume',
      description: 'Alert when orders exceed 100 per hour',
      category: 'orders',
      trigger: 'threshold',
      conditions: { metric: 'orders_per_hour', operator: 'gt', value: 100, timeframe: '1h' },
      channels: ['sms', 'email'],
      isActive: true,
      priority: 'medium',
      cooldownMinutes: 60,
      createdAt: subHours(new Date(), 48),
      triggerCount: 2
    },
    {
      id: 'rule-3',
      name: 'Revenue Milestone',
      description: 'Celebrate when daily revenue exceeds $10,000',
      category: 'revenue',
      trigger: 'threshold',
      conditions: { metric: 'daily_revenue', operator: 'gt', value: 10000, timeframe: '1d' },
      channels: ['in-app', 'email'],
      isActive: true,
      priority: 'low',
      cooldownMinutes: 1440,
      createdAt: subHours(new Date(), 72),
      triggerCount: 1
    },
    {
      id: 'rule-4',
      name: 'System Error Detection',
      description: 'Alert on system errors or failures',
      category: 'system',
      trigger: 'event',
      conditions: {},
      channels: ['email', 'sms', 'push'],
      isActive: true,
      priority: 'critical',
      cooldownMinutes: 5,
      createdAt: subHours(new Date(), 12),
      triggerCount: 0
    },
    {
      id: 'rule-5',
      name: 'Loyalty Member Milestone',
      description: 'Notify when a member reaches 10,000 points',
      category: 'loyalty',
      trigger: 'threshold',
      conditions: { metric: 'loyalty_points', operator: 'gte', value: 10000, timeframe: '1d' },
      channels: ['in-app', 'email'],
      isActive: true,
      priority: 'medium',
      cooldownMinutes: 120,
      createdAt: subHours(new Date(), 96),
      triggerCount: 3
    }
  ], []);

  const generateMockNotifications = useCallback((): Notification[] => [
    {
      id: 'notif-1',
      ruleId: 'rule-1',
      title: 'Low Stock Alert',
      message: 'Product "Wireless Headphones" is running low on stock (8 units remaining)',
      type: 'warning',
      category: 'products',
      channel: 'email',
      isRead: false,
      isDelivered: true,
      timestamp: subHours(new Date(), 1),
      priority: 'high',
      actions: [
        { label: 'View Product', action: 'view_product', url: '/products/headphones' },
        { label: 'Restock Now', action: 'restock', url: '/products/headphones/restock' }
      ]
    },
    {
      id: 'notif-2',
      title: 'Revenue Milestone Reached!',
      message: 'Congratulations! Today\'s revenue has exceeded $12,000. You\'re 20% above target.',
      type: 'success',
      category: 'revenue',
      channel: 'in-app',
      isRead: false,
      isDelivered: true,
      timestamp: subHours(new Date(), 3),
      priority: 'low'
    },
    {
      id: 'notif-3',
      title: 'New Order Alert',
      message: 'Order #12345 received from John Smith - Total: $245.99',
      type: 'info',
      category: 'orders',
      channel: 'push',
      isRead: true,
      isDelivered: true,
      timestamp: subHours(new Date(), 5),
      priority: 'medium'
    },
    {
      id: 'notif-4',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM EST. Some features may be unavailable.',
      type: 'info',
      category: 'system',
      channel: 'email',
      isRead: true,
      isDelivered: true,
      timestamp: subHours(new Date(), 24),
      priority: 'medium'
    },
    {
      id: 'notif-5',
      ruleId: 'rule-4',
      title: 'Payment Processing Error',
      message: 'Error detected in payment processing for order #12347. Manual review required.',
      type: 'error',
      category: 'system',
      channel: 'email',
      isRead: false,
      isDelivered: true,
      timestamp: subHours(new Date(), 12),
      priority: 'critical',
      actions: [
        { label: 'View Order', action: 'view_order', url: '/orders/12347' },
        { label: 'Process Manually', action: 'manual_process', url: '/orders/12347/process' }
      ]
    }
  ], []);

  const generateMockSettings = useCallback((): NotificationSettings => ({
    email: {
      enabled: true,
      address: 'admin@example.com',
      verified: true
    },
    sms: {
      enabled: true,
      phoneNumber: '+1234567890',
      verified: true
    },
    push: {
      enabled: true,
      permissions: true
    },
    inApp: {
      enabled: true,
      sounds: true,
      desktop: true
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
      timezone: 'America/New_York'
    },
    preferences: {
      categories: {
        orders: { email: true, sms: true, push: false, inApp: true },
        products: { email: true, sms: false, push: true, inApp: true },
        revenue: { email: true, sms: false, push: false, inApp: true },
        loyalty: { email: true, sms: false, push: false, inApp: true },
        system: { email: true, sms: true, push: true, inApp: true },
        alerts: { email: true, sms: true, push: true, inApp: true }
      },
      frequency: 'immediate'
    }
  }), []);

  const generateMockTemplates = useCallback((): NotificationTemplate[] => [
    {
      id: 'template-1',
      name: 'Low Stock Alert',
      subject: 'Low Stock Alert - {{product_name}}',
      message: 'Dear Team,\n\nProduct "{{product_name}}" is running low on stock. Current stock: {{stock_quantity}} units.\n\nPlease restock this item as soon as possible.\n\nThank you!',
      category: 'products',
      variables: ['{{product_name}}', '{{stock_quantity}}', '{{category}}'],
      channels: ['email', 'push']
    },
    {
      id: 'template-2',
      name: 'Revenue Milestone',
      subject: '🎉 Revenue Milestone Achieved!',
      message: 'Fantastic news! We\'ve reached our revenue target of {{target_amount}}. Current revenue: {{current_revenue}} ({{percentage_of_target}}% of target).\n\nKeep up the excellent work!',
      category: 'revenue',
      variables: ['{{target_amount}}', '{{current_revenue}}', '{{percentage_of_target}}', '{{date}}'],
      channels: ['in-app', 'email']
    },
    {
      id: 'template-3',
      name: 'High Priority Order',
      subject: 'High Priority Order #{{order_number}}',
      message: 'A high priority order has been received:\n\nOrder #: {{order_number}}\nCustomer: {{customer_name}}\nTotal: ${{order_total}}\nPriority: {{priority}}\n\nPlease process this order with priority.',
      category: 'orders',
      variables: ['{{order_number}}', '{{customer_name}}', '{{order_total}}', '{{priority}}'],
      channels: ['sms', 'email', 'push']
    }
  ], []);

  // Load data
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setNotificationRules(generateMockRules());
      setNotifications(generateMockNotifications());
      setSettings(generateMockSettings());
      setTemplates(generateMockTemplates());
      setIsConnected(true);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(() => {
      // Simulate new notifications occasionally
      if (Math.random() > 0.9) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          title: 'Test Notification',
          message: 'This is a test notification to demonstrate real-time updates.',
          type: 'info',
          category: 'system',
          channel: 'in-app',
          isRead: false,
          isDelivered: true,
          timestamp: new Date(),
          priority: 'low'
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 99)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [generateMockRules, generateMockNotifications, generateMockSettings, generateMockTemplates]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const toggleRule = (ruleId: string) => {
    setNotificationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification System</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage alerts, notifications, and communication preferences</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          
          <button
            onClick={() => setShowCreateRule(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', name: 'Rules', icon: Settings },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'settings', name: 'Settings', icon: User },
            { id: 'templates', name: 'Templates', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Rules</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notificationRules.map(rule => (
                  <div key={rule.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{rule.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rule.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rule.priority}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{rule.description}</p>
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Category: {rule.category}</span>
                          <span>Trigger: {rule.trigger}</span>
                          <span>Cooldown: {rule.cooldownMinutes}m</span>
                          <span>Triggered: {rule.triggerCount}x</span>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          {rule.channels.map(channel => (
                            <span key={channel} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            rule.isActive 
                              ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900' 
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {rule.isActive ? <Bell className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="orders">Orders</option>
                <option value="products">Products</option>
                <option value="revenue">Revenue</option>
                <option value="loyalty">Loyalty</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map(notification => {
                  const TypeIcon = notificationTypes[notification.type].icon;
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${notificationTypes[notification.type].bg}`}>
                            <TypeIcon className={`w-5 h-5 text-${notificationTypes[notification.type].color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                notification.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{format(notification.timestamp, 'MMM dd, yyyy HH:mm')}</span>
                              <span>{notification.category}</span>
                              <span>{notification.channel}</span>
                              {notification.isDelivered && (
                                <span className="text-green-600">Delivered</span>
                              )}
                            </div>
                            {notification.actions && (
                              <div className="mt-3 flex space-x-2">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && settings && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Email Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Email Notifications</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => prev ? { ...prev, email: { ...prev.email, enabled: !prev.email.enabled } } : prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.email.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                      type="email"
                      value={settings.email.address}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className={`px-3 py-2 text-sm rounded-md ${
                      settings.email.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {settings.email.verified ? 'Verified' : 'Pending Verification'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SMS Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                SMS Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable SMS Notifications</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive critical notifications via SMS</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => prev ? { ...prev, sms: { ...prev.sms, enabled: !prev.sms.enabled } } : prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.sms.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sms.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      value={settings.sms.phoneNumber}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className={`px-3 py-2 text-sm rounded-md ${
                      settings.sms.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {settings.sms.verified ? 'Verified' : 'Pending Verification'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Quiet Hours
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Quiet Hours</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pause non-critical notifications during specific hours</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => prev ? { ...prev, quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled } } : prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                    <select
                      value={settings.quietHours.timezone}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Templates</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Template</span>
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.map(template => (
                  <div key={template.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <div className="mt-2 space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{template.subject}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{template.message}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variables</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {template.variables.map(variable => (
                                <span key={variable} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded font-mono">
                                  {variable}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Channels</label>
                            <div className="flex space-x-2 mt-1">
                              {template.channels.map(channel => (
                                <span key={channel} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                  {channel}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;