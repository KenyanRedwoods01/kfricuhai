import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Image,
  Upload,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Eye,
  Share2,
  Copy,
  Archive,
  Loader2,
  Progress,
  Filter,
  Search,
  Grid3X3,
  List,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Download Manager Component
 * Advanced file download utility with progress tracking and queue management
 */
export const DownloadManager: React.FC<{
  files?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    blob?: Blob;
    createdAt: Date;
    status: 'pending' | 'downloading' | 'completed' | 'failed' | 'cancelled';
    progress?: number;
    error?: string;
  }>;
  onFileSelect?: (files: File[]) => void;
  maxConcurrent?: number;
}> = ({ files = [], onFileSelect, maxConcurrent = 3 }) => {
  const [activeDownloads, setActiveDownloads] = useState<Set<string>>(new Set());
  const [downloadQueue, setDownloadQueue] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = async (file: any) => {
    if (activeDownloads.size >= maxConcurrent) return;

    setActiveDownloads(prev => new Set([...prev, file.id]));

    try {
      if (file.blob) {
        saveAs(file.blob, file.name);
      } else if (file.url) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        saveAs(blob, file.name);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setActiveDownloads(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    onFileSelect?.(selectedFiles);
  };

  const statusIcons = {
    pending: <Clock className="text-yellow-500" size={16} />,
    downloading: <Loader2 className="text-blue-500 animate-spin" size={16} />,
    completed: <Check className="text-green-500" size={16} />,
    failed: <AlertCircle className="text-red-500" size={16} />,
    cancelled: <Pause className="text-gray-500" size={16} />
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      downloading: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Download Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your file downloads and uploads
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid3X3 size={20} />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Files</option>
              <option value="pending">Pending</option>
              <option value="downloading">Downloading</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {filteredFiles.length} files
            </div>
          </div>
        </div>
      </div>

      {/* Files Display */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <Download className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No files found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload files or download documents to get started'
              }
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={() => handleDownload(file)}
                isDownloading={activeDownloads.has(file.id)}
                formatFileSize={formatFileSize}
                getStatusColor={getStatusColor}
                statusIcons={statusIcons}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFiles.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onDownload={() => handleDownload(file)}
                    isDownloading={activeDownloads.has(file.id)}
                    formatFileSize={formatFileSize}
                    getStatusColor={getStatusColor}
                    statusIcons={statusIcons}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

/**
 * File Card Component for Grid View
 */
const FileCard: React.FC<{
  file: any;
  onDownload: () => void;
  isDownloading: boolean;
  formatFileSize: (size: number) => string;
  getStatusColor: (status: string) => string;
  statusIcons: Record<string, React.ReactNode>;
}> = ({ file, onDownload, isDownloading, formatFileSize, getStatusColor, statusIcons }) => {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-500" size={24} />;
    if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="text-green-500" size={24} />;
    if (type.includes('image')) return <Image className="text-purple-500" size={24} />;
    return <FileText className="text-gray-500" size={24} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4">
        {/* File Icon and Status */}
        <div className="flex items-center justify-between mb-3">
          {getFileIcon(file.type)}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)} flex items-center space-x-1`}>
            {statusIcons[file.status]}
            <span className="capitalize">{file.status}</span>
          </div>
        </div>

        {/* File Name */}
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
          {file.name}
        </h3>

        {/* File Size */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {formatFileSize(file.size)}
        </p>

        {/* Progress Bar */}
        {file.status === 'downloading' && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${file.progress || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {file.progress || 0}% complete
            </p>
          </div>
        )}

        {/* Error Message */}
        {file.status === 'failed' && file.error && (
          <p className="text-xs text-red-600 dark:text-red-400 mb-3">
            {file.error}
          </p>
        )}

        {/* Created Date */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {formatDistanceToNow(file.createdAt, { addSuffix: true })}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {file.status === 'completed' && (
            <>
              <button
                onClick={onDownload}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Eye size={14} />
              </button>
              
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Share2 size={14} />
              </button>
            </>
          )}
          
          {file.status === 'failed' && (
            <button
              onClick={onDownload}
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
            >
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
          )}
          
          {file.status === 'pending' && (
            <div className="flex-1 text-center py-2 text-sm text-gray-500 dark:text-gray-400">
              Queued
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * File Row Component for List View
 */
const FileRow: React.FC<{
  file: any;
  onDownload: () => void;
  isDownloading: boolean;
  formatFileSize: (size: number) => string;
  getStatusColor: (status: string) => string;
  statusIcons: Record<string, React.ReactNode>;
}> = ({ file, onDownload, isDownloading, formatFileSize, getStatusColor, statusIcons }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {file.name}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        {formatFileSize(file.size)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
          {statusIcons[file.status]}
          <span className="ml-1 capitalize">{file.status}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        {formatDistanceToNow(file.createdAt, { addSuffix: true })}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          {file.status === 'completed' && (
            <>
              <button
                onClick={onDownload}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Download size={16} />
              </button>
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                <Eye size={16} />
              </button>
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                <Share2 size={16} />
              </button>
            </>
          )}
          
          {file.status === 'failed' && (
            <button
              onClick={onDownload}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/**
 * Document Formatting Utilities
 */
export const DocumentFormatters = {
  /**
   * Apply consistent styling to documents
   */
  applyDocumentStyling: (element: HTMLElement, options: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
    spacing?: {
      margin?: string;
      padding?: string;
    };
    borders?: {
      radius?: string;
      width?: string;
      color?: string;
    };
  }) => {
    const style = element.style;
    
    if (options.fontFamily) style.fontFamily = options.fontFamily;
    if (options.fontSize) style.fontSize = options.fontSize;
    if (options.lineHeight) style.lineHeight = options.lineHeight;
    
    if (options.colors) {
      if (options.colors.primary) style.setProperty('--primary-color', options.colors.primary);
      if (options.colors.secondary) style.setProperty('--secondary-color', options.colors.secondary);
      if (options.colors.background) style.backgroundColor = options.colors.background;
      if (options.colors.text) style.color = options.colors.text;
    }
    
    if (options.spacing) {
      if (options.spacing.margin) style.margin = options.spacing.margin;
      if (options.spacing.padding) style.padding = options.spacing.padding;
    }
    
    if (options.borders) {
      if (options.borders.radius) style.borderRadius = options.borders.radius;
      if (options.borders.width) style.borderWidth = options.borders.width;
      if (options.borders.color) style.borderColor = options.borders.color;
    }
  },

  /**
   * Format table headers
   */
  formatTableHeaders: (table: HTMLTableElement, options: {
    backgroundColor?: string;
    textColor?: string;
    fontWeight?: string;
    padding?: string;
  }) => {
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      const style = header.style;
      if (options.backgroundColor) style.backgroundColor = options.backgroundColor;
      if (options.textColor) style.color = options.textColor;
      if (options.fontWeight) style.fontWeight = options.fontWeight;
      if (options.padding) style.padding = options.padding;
    });
  },

  /**
   * Format table rows with alternating colors
   */
  formatTableRows: (table: HTMLTableElement, options: {
    evenRowColor?: string;
    oddRowColor?: string;
    hoverColor?: string;
  }) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const style = row.style;
      if (options.evenRowColor && index % 2 === 0) style.backgroundColor = options.evenRowColor;
      if (options.oddRowColor && index % 2 === 1) style.backgroundColor = options.oddRowColor;
      
      if (options.hoverColor) {
        row.addEventListener('mouseenter', () => {
          style.backgroundColor = options.hoverColor;
        });
        row.addEventListener('mouseleave', () => {
          // Reset to original color
          if (options.evenRowColor && index % 2 === 0) style.backgroundColor = options.evenRowColor;
          if (options.oddRowColor && index % 2 === 1) style.backgroundColor = options.oddRowColor;
        });
      }
    });
  },

  /**
   * Add responsive design classes
   */
  makeResponsive: (element: HTMLElement) => {
    element.classList.add('w-full', 'overflow-x-auto');
    
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('min-w-full');
    });
  },

  /**
   * Add print styles
   */
  addPrintStyles: (element: HTMLElement) => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .page-break { page-break-after: always; }
        .print-friendly {
          background: white !important;
          color: black !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Advanced Download Queue Manager
 */
export class DownloadQueueManager {
  private queue: Array<{
    id: string;
    download: () => Promise<void>;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
  }> = [];
  private activeDownloads = 0;
  private maxConcurrent = 3;

  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  add(download: {
    id: string;
    download: () => Promise<void>;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
  }) {
    this.queue.push(download);
    this.processQueue();
  }

  private async processQueue() {
    while (this.activeDownloads < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeDownloads++;
      
      try {
        await item.download();
        item.onComplete?.();
      } catch (error) {
        item.onError?.(error as Error);
      } finally {
        this.activeDownloads--;
      }
    }
  }

  clear() {
    this.queue = [];
  }

  getQueueLength() {
    return this.queue.length;
  }

  getActiveCount() {
    return this.activeDownloads;
  }
}

/**
 * File Type Detection Utilities
 */
export const FileTypeDetector = {
  getMimeType: (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      csv: 'text/csv',
      json: 'application/json',
      txt: 'text/plain',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml'
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  },

  isImage: (filename: string): boolean => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension || '');
  },

  isDocument: (filename: string): boolean => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return docExtensions.includes(extension || '');
  },

  isSpreadsheet: (filename: string): boolean => {
    const sheetExtensions = ['xlsx', 'xls', 'csv'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return sheetExtensions.includes(extension || '');
  }
};