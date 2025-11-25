import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

/**
 * Advanced Spreadsheet Component with Beautiful UI
 * Features: Sorting, filtering, editing, virtual scrolling, cell formatting
 */
export const AdvancedSpreadsheet: React.FC<{
  data: any[];
  columns: Array<{
    id: string;
    label: string;
    type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean';
    format?: string;
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  title?: string;
  onDataChange?: (data: any[]) => void;
  onCellEdit?: (rowIndex: number, columnId: string, value: any) => void;
  enableVirtualization?: boolean;
  maxHeight?: number;
}> = ({
  data,
  columns,
  title = 'Advanced Spreadsheet',
  onDataChange,
  onCellEdit,
  enableVirtualization = true,
  maxHeight = 600
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [editingCell, setEditingCell] = useState<{
    row: number;
    column: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [isLoading, setIsLoading] = useState(false);

  // Virtual scrolling state
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(row => {
          const cellValue = row[columnId];
          if (typeof filterValue === 'string') {
            return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
          }
          return cellValue === filterValue;
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Event handlers
  const handleSort = useCallback((columnId: string) => {
    setSortConfig(prev => {
      if (prev?.key === columnId) {
        return {
          key: columnId,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: columnId, direction: 'asc' };
    });
  }, []);

  const handleFilter = useCallback((columnId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value === 'all' ? null : value
    }));
  }, []);

  const handleCellEdit = useCallback((rowIndex: number, columnId: string, value: any) => {
    const actualRowIndex = (currentPage - 1) * pageSize + rowIndex;
    const updatedData = [...data];
    updatedData[actualRowIndex] = {
      ...updatedData[actualRowIndex],
      [columnId]: value
    };
    
    onDataChange?.(updatedData);
    onCellEdit?.(actualRowIndex, columnId, value);
    setEditingCell(null);
  }, [data, currentPage, pageSize, onDataChange, onCellEdit]);

  const handleRowSelection = useCallback((rowIndex: number, selected: boolean) => {
    const actualRowIndex = (currentPage - 1) * pageSize + rowIndex;
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(actualRowIndex);
    } else {
      newSelected.delete(actualRowIndex);
    }
    setSelectedRows(newSelected);
  }, [selectedRows, currentPage, pageSize]);

  const formatCellValue = (value: any, type: string, dateFormat?: string): string => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value));
      
      case 'percentage':
        return `${(Number(value) * 100).toFixed(2)}%`;
      
      case 'date':
        try {
          const date = typeof value === 'string' ? parseISO(value) : new Date(value);
          return format(date, dateFormat || 'MMM dd, yyyy');
        } catch {
          return String(value);
        }
      
      case 'boolean':
        return value ? 'Yes' : 'No';
      
      case 'number':
        return Number(value).toLocaleString();
      
      default:
        return String(value);
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortConfig?.key !== columnId) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <TrendingUp size={16} className="text-blue-500" /> : 
      <TrendingDown size={16} className="text-blue-500" />;
  };

  const getUniqueFilterValues = (columnId: string): any[] => {
    const values = data.map(row => row[columnId]).filter(v => v !== null && v !== undefined);
    return Array.from(new Set(values));
  };

  // Virtual scrolling calculation
  const visibleRows = enableVirtualization ? paginatedData.slice(
    Math.floor(scrollTop / 40), // Assuming 40px row height
    Math.ceil((scrollTop + maxHeight) / 40)
  ) : paginatedData;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {viewMode === 'table' ? <BarChart3 size={20} /> : <Table size={20} />}
            </button>
            
            <button
              onClick={() => setIsLoading(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
              <option value={250}>250 rows</option>
            </select>
            
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Row</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allRowIndices = new Set(Array.from({ length: paginatedData.length }, (_, i) => i));
                          setSelectedRows(allRowIndices);
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  
                  {columns.map((column) => (
                    <th key={column.id} className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => column.sortable && handleSort(column.id)}
                          className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          <span className="font-medium">{column.label}</span>
                          {column.sortable && getSortIcon(column.id)}
                        </button>
                        
                        {column.filterable && (
                          <div className="relative">
                            <select
                              onChange={(e) => handleFilter(column.id, e.target.value)}
                              className="text-xs px-2 py-1 bg-white dark:bg-slate-600 border border-gray-300 dark:border-gray-500 rounded focus:ring-1 focus:ring-blue-500"
                              defaultValue="all"
                            >
                              <option value="all">All</option>
                              {getUniqueFilterValues(column.id).slice(0, 10).map((value) => (
                                <option key={value} value={value}>
                                  {String(value).slice(0, 20)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  
                  <th className="w-16 px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                      selectedRows.has((currentPage - 1) * pageSize + rowIndex)
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has((currentPage - 1) * pageSize + rowIndex)}
                        onChange={(e) => handleRowSelection(rowIndex, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    
                    {columns.map((column) => {
                      const cellValue = row[column.id];
                      const isEditing = editingCell?.row === rowIndex && editingCell?.column === column.id;
                      
                      return (
                        <td key={column.id} className="px-4 py-3">
                          {isEditing ? (
                            <CellEditor
                              value={editValue}
                              type={column.type}
                              onSave={(value) => handleCellEdit(rowIndex, column.id, value)}
                              onCancel={() => setEditingCell(null)}
                              format={column.format}
                            />
                          ) : (
                            <div
                              className={`${
                                column.editable
                                  ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 rounded px-1 -mx-1 py-0.5'
                                  : ''
                              }`}
                              onClick={() => {
                                if (column.editable) {
                                  setEditingCell({ row: rowIndex, column: column.id });
                                  setEditValue(String(cellValue || ''));
                                }
                              }}
                            >
                              <span className="text-gray-900 dark:text-white">
                                {formatCellValue(cellValue, column.type, column.format)}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded">
                          <Edit size={14} />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded">
                          <Trash2 size={14} />
                        </button>
                        <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Card View
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((row, rowIndex) => (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Row {(currentPage - 1) * pageSize + rowIndex + 1}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedRows.has((currentPage - 1) * pageSize + rowIndex)}
                    onChange={(e) => handleRowSelection(rowIndex, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                {columns.slice(0, 4).map((column) => (
                  <div key={column.id} className="mb-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {column.label}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCellValue(row[column.id], column.type, column.format)}
                    </div>
                  </div>
                ))}
                
                {columns.length > 4 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    +{columns.length - 4} more columns
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Cell Editor Component
 */
const CellEditor: React.FC<{
  value: string;
  type: string;
  onSave: (value: any) => void;
  onCancel: () => void;
  format?: string;
}> = ({ value, type, onSave, onCancel, format }) => {
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    let processedValue: any = editValue;
    
    // Convert value based on type
    switch (type) {
      case 'number':
      case 'currency':
        processedValue = parseFloat(editValue) || 0;
        break;
      case 'percentage':
        processedValue = parseFloat(editValue) / 100 || 0;
        break;
      case 'boolean':
        processedValue = ['true', 'yes', '1'].includes(editValue.toLowerCase());
        break;
      case 'date':
        try {
          processedValue = new Date(editValue).toISOString();
        } catch {
          processedValue = editValue;
        }
        break;
    }
    
    onSave(processedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
      
      <button
        onClick={handleSave}
        className="p-1 text-green-600 hover:text-green-700"
      >
        <Check size={14} />
      </button>
      
      <button
        onClick={onCancel}
        className="p-1 text-red-600 hover:text-red-700"
      >
        <X size={14} />
      </button>
    </div>
  );
};

/**
 * Data Visualization Component for Spreadsheet
 */
export const SpreadsheetAnalytics: React.FC<{
  data: any[];
  columns: Array<{ id: string; type: string; }>;
}> = ({ data, columns }) => {
  const numericColumns = columns.filter(col => 
    ['number', 'currency', 'percentage'].includes(col.type)
  );

  const stats = useMemo(() => {
    if (data.length === 0) return {};

    return numericColumns.reduce((acc, column) => {
      const values = data.map(row => Number(row[column.id])).filter(v => !isNaN(v));
      
      if (values.length === 0) {
        acc[column.id] = {
          sum: 0,
          average: 0,
          min: 0,
          max: 0,
          count: 0
        };
        return acc;
      }

      acc[column.id] = {
        sum: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
      
      return acc;
    }, {} as Record<string, any>);
  }, [data, numericColumns]);

  if (numericColumns.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-6 text-center">
        <BarChart3 className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-600 dark:text-gray-400">
          No numeric data available for analysis
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {numericColumns.map((column) => {
        const stat = stats[column.id];
        return (
          <div
            key={column.id}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
              {column.id.replace(/([A-Z])/g, ' $1')}
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Sum:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stat.sum.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Average:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stat.average.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Min:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stat.min.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Max:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stat.max.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Count:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stat.count}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};