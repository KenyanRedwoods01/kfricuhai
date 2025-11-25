import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdvancedDocumentGenerator } from '../components/AdvancedDocumentGenerator';
import { AdvancedSpreadsheet, SpreadsheetAnalytics } from '../components/AdvancedSpreadsheet';
import { DownloadManager } from '../components/DocumentDownloadManager';
import { useKpiData } from '../contexts/KpiContext';

/**
 * Main Document Generation Page
 * Comprehensive document management and generation interface
 */
export default function DocumentGenerationPage() {
  const { kpiData, isLoading } = useKpiData();
  const [activeTab, setActiveTab] = useState<'generator' | 'spreadsheet' | 'downloads' | 'analytics'>('generator');

  const tabs = [
    { id: 'generator', label: 'Document Generator', icon: 'FileCheck' },
    { id: 'spreadsheet', label: 'Data Spreadsheet', icon: 'Grid3X3' },
    { id: 'downloads', label: 'Download Manager', icon: 'Download' },
    { id: 'analytics', label: 'Data Analytics', icon: 'BarChart3' }
  ];

  const sampleKpiData = [
    { id: 1, name: 'Gross Profit Margin', value: 0.35, target: 0.30, status: 'On Track', trend: 'Up' },
    { id: 2, name: 'Sales Growth Rate', value: 0.12, target: 0.15, status: 'Behind', trend: 'Down' },
    { id: 3, name: 'Inventory Turnover', value: 8.5, target: 8.0, status: 'On Track', trend: 'Up' },
    { id: 4, name: 'Customer Lifetime Value', value: 2500, target: 2300, status: 'Exceeding', trend: 'Up' },
    { id: 5, name: 'Net Profit Margin', value: 0.18, target: 0.15, status: 'Exceeding', trend: 'Up' },
    { id: 6, name: 'Customer Acquisition Cost', value: 45, target: 50, status: 'On Track', trend: 'Down' }
  ];

  const spreadsheetColumns = [
    { id: 'name', label: 'KPI Name', type: 'text' as const, editable: true, sortable: true, filterable: true },
    { id: 'value', label: 'Current Value', type: 'currency' as const, editable: true, sortable: true, filterable: false },
    { id: 'target', label: 'Target', type: 'currency' as const, editable: true, sortable: true, filterable: false },
    { id: 'variance', label: 'Variance', type: 'percentage' as const, editable: false, sortable: true, filterable: true },
    { id: 'status', label: 'Status', type: 'text' as const, editable: true, sortable: true, filterable: true },
    { id: 'trend', label: 'Trend', type: 'text' as const, editable: true, sortable: true, filterable: true },
    { id: 'lastUpdated', label: 'Last Updated', type: 'date' as const, editable: false, sortable: true, filterable: false }
  ];

  // Process KPI data for spreadsheet format
  const spreadsheetData = sampleKpiData.map(kpi => ({
    ...kpi,
    variance: kpi.target > 0 ? (kpi.value - kpi.target) / kpi.target : 0,
    lastUpdated: new Date().toISOString()
  }));

  const iconComponents = {
    FileCheck: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Grid3X3: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    BarChart3: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Document Generation & Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create, manage, and export beautiful documents with advanced formatting and analytics
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl border border-white/20 shadow-lg overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = iconComponents[tab.icon as keyof typeof iconComponents];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <IconComponent />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeTab === 'generator' && (
            <AdvancedDocumentGenerator />
          )}

          {activeTab === 'spreadsheet' && (
            <div className="space-y-8">
              {/* Spreadsheet Header */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Interactive KPI Spreadsheet
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Edit, filter, and analyze your KPI data in real-time with beautiful formatting and visualizations
                </p>
              </div>

              {/* Advanced Spreadsheet Component */}
              <AdvancedSpreadsheet
                data={spreadsheetData}
                columns={spreadsheetColumns}
                title="KPI Data Spreadsheet"
                onDataChange={(data) => console.log('Data changed:', data)}
                onCellEdit={(rowIndex, columnId, value) => 
                  console.log(`Cell edited: Row ${rowIndex}, Column ${columnId}, Value:`, value)
                }
                enableVirtualization={true}
                maxHeight={600}
              />

              {/* Analytics Section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Data Analytics
                </h3>
                <SpreadsheetAnalytics
                  data={spreadsheetData}
                  columns={spreadsheetColumns}
                />
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-8">
              {/* Download Manager Header */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Download Manager
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage file downloads, uploads, and document exports with advanced queue management
                </p>
              </div>

              {/* Sample Download Files */}
              <DownloadManager
                files={[
                  {
                    id: '1',
                    name: 'KPI_Dashboard_Report.pdf',
                    size: 2048000,
                    type: 'application/pdf',
                    createdAt: new Date('2025-11-24T10:30:00'),
                    status: 'completed',
                    progress: 100
                  },
                  {
                    id: '2',
                    name: 'Financial_Analysis.xlsx',
                    size: 1536000,
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    createdAt: new Date('2025-11-24T09:15:00'),
                    status: 'completed',
                    progress: 100
                  },
                  {
                    id: '3',
                    name: 'Sales_Data.csv',
                    size: 512000,
                    type: 'text/csv',
                    createdAt: new Date('2025-11-24T08:45:00'),
                    status: 'downloading',
                    progress: 67
                  },
                  {
                    id: '4',
                    name: 'Customer_Segmentation.pdf',
                    size: 3072000,
                    type: 'application/pdf',
                    createdAt: new Date('2025-11-23T16:20:00'),
                    status: 'failed',
                    error: 'Network timeout',
                    progress: 0
                  }
                ]}
                onFileSelect={(files) => console.log('Files selected:', files)}
                maxConcurrent={3}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics Header */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Document Analytics & Insights
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Analyze document generation patterns, download statistics, and user engagement metrics
                </p>
              </div>

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Documents Generated"
                  value="127"
                  change="+12.5%"
                  trend="up"
                  icon="FileCheck"
                  color="blue"
                />
                <AnalyticsCard
                  title="Total Downloads"
                  value="2,847"
                  change="+8.3%"
                  trend="up"
                  icon="Download"
                  color="green"
                />
                <AnalyticsCard
                  title="Google Sheets Sync"
                  value="23"
                  change="-2.1%"
                  trend="down"
                  icon="Grid3X3"
                  color="purple"
                />
                <AnalyticsCard
                  title="PDF Reports"
                  value="89"
                  change="+15.7%"
                  trend="up"
                  icon="FileText"
                  color="orange"
                />
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DocumentTypeChart />
                <DownloadTrendChart />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Analytics Card Component
 */
const AnalyticsCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, change, trend, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const iconPaths = {
    FileCheck: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    Download: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    Grid3X3: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    FileText: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[icon as keyof typeof iconPaths]} />
          </svg>
        </div>
        <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend === 'up' ? '↗' : '↘'}</span>
          <span>{change}</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {title}
      </p>
    </div>
  );
};

/**
 * Document Type Chart Component (Placeholder)
 */
const DocumentTypeChart: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Document Types Generated
      </h3>
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">45%</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            PDF Reports are the most generated document type
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Download Trend Chart Component (Placeholder)
 */
const DownloadTrendChart: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Download Trends (Last 30 Days)
      </h3>
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-end space-x-2 mb-4">
            {[40, 65, 35, 80, 55, 70, 90].map((height, index) => (
              <div
                key={index}
                className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${height * 2}px` }}
              />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Downloads showing steady growth
          </p>
        </div>
      </div>
    </div>
  );
};