import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Image, 
  Upload,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  BarChart3,
  PieChart,
  TrendingUp,
  FileCheck,
  Loader2
} from 'lucide-react';
import { PDFGenerator } from '../utils/pdfGenerator';
import { ExcelGenerator, DataFormatters } from '../utils/excelGenerator';
import { DocumentManager, GoogleSheetsService, GoogleDriveService } from '../services/googleIntegration';
import { useKpiData } from '../contexts/KpiContext';

/**
 * Advanced Document Generator Component
 * Beautiful, modern UI for document generation and export
 */
export const AdvancedDocumentGenerator: React.FC = () => {
  const { kpiData, refreshKpiData, isLoading } = useKpiData();
  const [activeTab, setActiveTab] = useState<'generate' | 'export' | 'templates' | 'schedule'>('generate');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'google-sheets'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Array<{
    id: string;
    name: string;
    type: string;
    link?: string;
    timestamp: Date;
  }>>([]);

  // Document generation handlers
  const handlePDFGeneration = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      await PDFGenerator.generateKPIDashboard('kpi-dashboard', undefined, {
        includeCharts: true,
        includeSummary: true,
        customTitle: 'KPI Dashboard Report'
      });

      const fileRecord = {
        id: Date.now().toString(),
        name: `kpi-dashboard-${new Date().toISOString().split('T')[0]}.pdf`,
        type: 'PDF',
        timestamp: new Date()
      };

      setGeneratedFiles(prev => [fileRecord, ...prev]);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExcelGeneration = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      await ExcelGenerator.generateKPIDashboard(kpiData);

      const fileRecord = {
        id: Date.now().toString(),
        name: `kpi-dashboard-${new Date().toISOString().split('T')[0]}.xlsx`,
        type: 'Excel',
        timestamp: new Date()
      };

      setGeneratedFiles(prev => [fileRecord, ...prev]);
    } catch (error) {
      console.error('Excel generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoogleSheetsExport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const result = await DocumentManager.syncDataToSheets(
        kpiData,
        `KPI Dashboard ${new Date().toLocaleDateString()}`
      );

      const fileRecord = {
        id: Date.now().toString(),
        name: `KPI Dashboard - ${new Date().toLocaleDateString()}`,
        type: 'Google Sheets',
        link: result.link,
        timestamp: new Date()
      };

      setGeneratedFiles(prev => [fileRecord, ...prev]);
    } catch (error) {
      console.error('Google Sheets export failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'generate', label: 'Generate Documents', icon: FileCheck },
    { id: 'export', label: 'Data Export', icon: Download },
    { id: 'templates', label: 'Templates', icon: FileSpreadsheet },
    { id: 'schedule', label: 'Automation', icon: Calendar }
  ];

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
            Advanced Document Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create beautiful PDFs, Excel dashboards, and Google Sheets integrations with AI-powered insights
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl border border-white/20 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'generate' && <DocumentGenerationTab />}
            {activeTab === 'export' && <DataExportTab />}
            {activeTab === 'templates' && <TemplatesTab />}
            {activeTab === 'schedule' && <AutomationTab />}
          </motion.div>
        </AnimatePresence>

        {/* Recent Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <DocumentHistory files={generatedFiles} />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Document Generation Tab Component
 */
const DocumentGenerationTab: React.FC = () => {
  const { kpiData, isLoading } = useKpiData();
  const [isGenerating, setIsGenerating] = useState(false);

  const quickActions = [
    {
      title: 'KPI Dashboard PDF',
      description: 'Comprehensive KPI report with charts and insights',
      icon: FileText,
      color: 'from-red-500 to-pink-600',
      action: () => handlePDFGeneration()
    },
    {
      title: 'Excel Dashboard',
      description: 'Interactive Excel workbook with multiple sheets',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-emerald-600',
      action: () => handleExcelGeneration()
    },
    {
      title: 'Google Sheets',
      description: 'Real-time data synchronization to Google Sheets',
      icon: Grid3X3,
      color: 'from-blue-500 to-cyan-600',
      action: () => handleGoogleSheetsExport()
    },
    {
      title: 'Custom Report',
      description: 'Build custom reports with selected KPIs',
      icon: FileCheck,
      color: 'from-purple-500 to-violet-600',
      action: () => {/* Custom report logic */}
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Document Generation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={action.action}
              >
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Advanced Options */}
      <AdvancedGenerationOptions />
    </div>
  );
};

/**
 * Data Export Tab Component
 */
const DataExportTab: React.FC = () => {
  const { kpiData } = useKpiData();
  const [selectedData, setSelectedData] = useState<string[]>(['all']);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('xlsx');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const dataOptions = [
    { value: 'all', label: 'All KPI Data', count: kpiData.length },
    { value: 'phase1', label: 'Phase 1 - Quick Wins', count: 4 },
    { value: 'phase2', label: 'Phase 2 - Analytics', count: 4 },
    { value: 'phase3', label: 'Phase 3 - Intelligence', count: 5 },
  ];

  const exportFormats = [
    { value: 'xlsx', label: 'Excel Workbook', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV File', icon: Grid3X3 },
    { value: 'json', label: 'JSON Data', icon: FileText }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Filter data based on selection
      let filteredData = kpiData;
      if (!selectedData.includes('all')) {
        // Apply phase filtering logic here
      }

      // Export based on format
      switch (exportFormat) {
        case 'xlsx':
          await ExcelGenerator.exportRealtimeData(filteredData, 'xlsx');
          break;
        case 'csv':
          await ExcelGenerator.exportRealtimeData(filteredData, 'csv');
          break;
        case 'json':
          await ExcelGenerator.exportRealtimeData(filteredData, 'json');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Data Export Options
        </h2>
        
        {/* Data Selection */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Data to Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedData(prev => 
                        prev.includes('all') ? [option.value] : [...prev, option.value]
                      );
                    } else {
                      setSelectedData(prev => prev.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">{option.label}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({option.count} items)
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Format */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <label key={format.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format.value}
                    checked={exportFormat === format.value}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    exportFormat === format.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className={exportFormat === format.value ? 'text-blue-600' : 'text-gray-400'} />
                      <span className={`font-medium ${
                        exportFormat === format.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {format.label}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Export Options</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-900 dark:text-white">Include charts and visualizations</span>
            </label>
            
            <button
              onClick={handleExport}
              disabled={isExporting || selectedData.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Templates Tab Component
 */
const TemplatesTab: React.FC = () => {
  const templates = [
    {
      id: 'kpi-dashboard',
      name: 'KPI Dashboard',
      description: 'Comprehensive KPI report with charts and trends',
      preview: '/api/placeholder/300/200',
      category: 'Business Intelligence',
      elements: ['KPI Cards', 'Trend Charts', 'Summary Tables', 'Performance Metrics']
    },
    {
      id: 'financial-report',
      name: 'Financial Report',
      description: 'Detailed financial analysis and projections',
      preview: '/api/placeholder/300/200',
      category: 'Finance',
      elements: ['Revenue Charts', 'Cost Analysis', 'Profit Margins', 'Cash Flow']
    },
    {
      id: 'sales-report',
      name: 'Sales Report',
      description: 'Sales performance and forecasting analysis',
      preview: '/api/placeholder/300/200',
      category: 'Sales',
      elements: ['Sales Funnel', 'Conversion Rates', 'Territory Analysis', 'Pipeline']
    },
    {
      id: 'operational-dashboard',
      name: 'Operational Dashboard',
      description: 'Operations metrics and efficiency tracking',
      preview: '/api/placeholder/300/200',
      category: 'Operations',
      elements: ['Process Metrics', 'Efficiency KPIs', 'Resource Utilization', 'Quality Control']
    }
  ];

  const categories = ['All', 'Business Intelligence', 'Finance', 'Sales', 'Operations'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Document Templates
        </h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Template Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <FileSpreadsheet size={48} className="text-blue-500/60" />
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                
                {/* Template Elements */}
                <div className="space-y-2 mb-4">
                  {template.elements.map((element) => (
                    <div key={element} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{element}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                    Use Template
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
                    Preview
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Automation Tab Component
 */
const AutomationTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Automated Document Generation
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scheduled Reports */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Scheduled Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Weekly KPI Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Every Monday at 9:00 AM</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Monthly Financial Summary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">1st of each month at 8:00 AM</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Paused</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
              Add New Schedule
            </button>
          </div>
          
          {/* Automation Rules */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Automation Rules</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="text-green-500" size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">Threshold Alerts</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Generate report when KPI exceeds or falls below threshold
                </p>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                  Configure Rules
                </button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">Event Triggers</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Generate reports based on business events and milestones
                </p>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                  Set Up Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Advanced Generation Options Component
 */
const AdvancedGenerationOptions: React.FC = () => {
  const [options, setOptions] = useState({
    includeCharts: true,
    includeTables: true,
    includeSummary: true,
    includeTimestamp: true,
    customBranding: false,
    watermark: false
  });

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Advanced Generation Options</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * Document History Component
 */
const DocumentHistory: React.FC<{ files: Array<any> }> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Documents</h3>
      
      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {file.type} • {file.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {file.link && (
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  Open
                </button>
              )}
              <button className="text-gray-500 hover:text-gray-600">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions (these would typically be in separate files)
const handlePDFGeneration = async () => {
  await PDFGenerator.generateKPIDashboard('kpi-dashboard', undefined, {
    includeCharts: true,
    includeSummary: true,
    customTitle: 'KPI Dashboard Report'
  });
};

const handleExcelGeneration = async () => {
  // This would use the ExcelGenerator
  console.log('Generating Excel file...');
};

const handleGoogleSheetsExport = async () => {
  // This would use the GoogleSheetsService
  console.log('Exporting to Google Sheets...');
};