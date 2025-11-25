/**
 * Advanced Dashboard Builder with Drag & Drop Grid Layout
 * Implements modern patterns from 2025 research
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedKPIDashboard } from './advancedKPIEngine';
import { AdvancedKpiCard, AdvancedChart } from './advancedKPIEngine';
import { 
  ChartBarIcon, 
  CubeIcon, 
  SwatchIcon, 
  Cog6ToothIcon,
  PlusIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

// Sortable Dashboard Widget Component
interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

function SortableWidget({ id, children, isDragging }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: sortableIsDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative ${isDragging || sortableIsDragging ? 'opacity-50' : ''}`}
    >
      {children}
    </div>
  );
}

// Grid Layout Configuration Component
interface GridConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: any) => void;
}

function GridConfigPanel({ isOpen, onClose, onConfigChange }: GridConfigPanelProps) {
  const [gridConfig, setGridConfig] = useState({
    columns: 12,
    rowHeight: 100,
    margin: 10,
    containerPadding: 10,
    isResizable: true,
    isDraggable: true,
    autoSize: true,
    compactType: 'vertical' as 'vertical' | 'horizontal' | null,
    preventCollision: false,
    useCSSTransforms: true,
    droppingItem: null,
    isDroppable: true
  });

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
    onConfigChange(newConfig);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 p-6 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Grid Configuration</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Columns
          </label>
          <input
            type="number"
            min="1"
            max="24"
            value={gridConfig.columns}
            onChange={(e) => handleConfigChange('columns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Row Height (px)
          </label>
          <input
            type="number"
            min="50"
            max="500"
            value={gridConfig.rowHeight}
            onChange={(e) => handleConfigChange('rowHeight', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margin (px)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={gridConfig.margin}
            onChange={(e) => handleConfigChange('margin', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Container Padding (px)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={gridConfig.containerPadding}
            onChange={(e) => handleConfigChange('containerPadding', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isResizable"
              checked={gridConfig.isResizable}
              onChange={(e) => handleConfigChange('isResizable', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isResizable" className="ml-2 text-sm text-gray-700">
              Enable Resizing
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDraggable"
              checked={gridConfig.isDraggable}
              onChange={(e) => handleConfigChange('isDraggable', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isDraggable" className="ml-2 text-sm text-gray-700">
              Enable Dragging
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSize"
              checked={gridConfig.autoSize}
              onChange={(e) => handleConfigChange('autoSize', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoSize" className="ml-2 text-sm text-gray-700">
              Auto Size
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="preventCollision"
              checked={gridConfig.preventCollision}
              onChange={(e) => handleConfigChange('preventCollision', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="preventCollision" className="ml-2 text-sm text-gray-700">
              Prevent Collision
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compact Type
          </label>
          <select
            value={gridConfig.compactType || ''}
            onChange={(e) => handleConfigChange('compactType', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No Compact</option>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

// Dashboard Widget Type Selection Modal
interface WidgetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWidget: (type: string, position: { x: number; y: number }) => void;
  availableMetrics: any[];
}

function WidgetSelector({ isOpen, onClose, onSelectWidget, availableMetrics }: WidgetSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>('kpi-card');
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const widgetTypes = [
    { id: 'kpi-card', name: 'KPI Card', icon: CubeIcon, description: 'Display key performance indicators' },
    { id: 'line-chart', name: 'Line Chart', icon: ChartBarIcon, description: 'Show trends over time' },
    { id: 'area-chart', name: 'Area Chart', icon: SwatchIcon, description: 'Display cumulative data' },
    { id: 'bar-chart', name: 'Bar Chart', icon: ChartBarIcon, description: 'Compare categories' },
    { id: 'pie-chart', name: 'Pie Chart', icon: ChartBarIcon, description: 'Show proportional data' },
    { id: 'radar-chart', name: 'Radar Chart', icon: ChartBarIcon, description: 'Display multi-dimensional data' },
  ];

  const handleAddWidget = () => {
    if (selectedType) {
      onSelectWidget(selectedType, { x: 0, y: 0 });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add Widget</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Widget Type</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {widgetTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <type.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {availableMetrics.length > 0 && ['kpi-card', 'line-chart', 'area-chart'].includes(selectedType) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Select Metric</h4>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a metric...</option>
                {availableMetrics.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWidget}
              disabled={!selectedType || (['kpi-card', 'line-chart', 'area-chart'].includes(selectedType) && !selectedMetric)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Widget
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Dashboard Builder Component
interface DashboardBuilderProps {
  className?: string;
}

export function DashboardBuilder({ className = '' }: DashboardBuilderProps) {
  const {
    metrics,
    config,
    selectedMetrics,
    setMetrics,
    setConfig,
    setSelectedMetrics,
    addMetric,
    removeMetric
  } = useAdvancedKPIDashboard();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);
  const [dragPreview, setDragPreview] = useState<React.ReactNode>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Create drag preview
    const draggedMetric = metrics.find(m => m.id === active.id);
    if (draggedMetric) {
      setDragPreview(
        <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-blue-500 opacity-90">
          <AdvancedKpiCard metric={draggedMetric} animated={false} />
        </div>
      );
    }
  }, [metrics]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setMetrics(
        arrayMove(metrics, metrics.findIndex((item) => item.id === active.id), metrics.findIndex((item) => item.id === over?.id))
      );
    }
    
    setActiveId(null);
    setDragPreview(null);
  }, [metrics, setMetrics]);

  const handleAddWidget = useCallback((type: string, position: { x: number; y: number }) => {
    // Generate a new widget based on type
    const newWidget = {
      id: `widget-${Date.now()}`,
      x: position.x,
      y: position.y,
      w: 4,
      h: 2,
      i: `widget-${Date.now()}`,
      metricId: '',
      visualizationType: type,
      customProps: {}
    };
    
    // Add to layout
    setConfig({
      layout: [...config.layout, newWidget]
    });
  }, [config.layout, setConfig]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${config.columns || 12}, 1fr)`,
    gridTemplateRows: `repeat(auto-fill, ${config.rowHeight || 100}px)`,
    gap: `${config.margin || 10}px`,
    padding: `${config.containerPadding || 10}px`,
    minHeight: '100vh'
  };

  const renderWidget = (layoutItem: any) => {
    const metric = metrics.find(m => m.id === layoutItem.metricId);
    
    if (!metric) {
      return (
        <div
          key={layoutItem.i}
          className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
          style={{
            gridColumn: `${layoutItem.x + 1} / span ${layoutItem.w}`,
            gridRow: `${layoutItem.y + 1} / span ${layoutItem.h}`,
            minHeight: `${layoutItem.h * (config.rowHeight || 100)}px`
          }}
        >
          <div className="text-center text-gray-500">
            <CubeIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm">Widget Placeholder</div>
          </div>
        </div>
      );
    }

    const widgetContent = () => {
      switch (layoutItem.visualizationType) {
        case 'kpi-card':
          return (
            <AdvancedKpiCard 
              metric={metric} 
              onClick={() => console.log('Clicked metric:', metric.id)}
            />
          );
        case 'line-chart':
          return (
            <AdvancedChart
              data={metric.metadata?.timeSeriesData || []}
              type="line"
              metric={metric}
              height={layoutItem.h * (config.rowHeight || 100) - 32}
            />
          );
        case 'area-chart':
          return (
            <AdvancedChart
              data={metric.metadata?.timeSeriesData || []}
              type="area"
              metric={metric}
              height={layoutItem.h * (config.rowHeight || 100) - 32}
            />
          );
        case 'bar-chart':
          return (
            <AdvancedChart
              data={metric.metadata?.timeSeriesData || []}
              type="bar"
              metric={metric}
              height={layoutItem.h * (config.rowHeight || 100) - 32}
            />
          );
        case 'pie-chart':
          return (
            <AdvancedChart
              data={metric.metadata?.timeSeriesData || []}
              type="pie"
              metric={metric}
              height={layoutItem.h * (config.rowHeight || 100) - 32}
            />
          );
        case 'radar-chart':
          return (
            <AdvancedChart
              data={metric.metadata?.timeSeriesData || []}
              type="radar"
              metric={metric}
              height={layoutItem.h * (config.rowHeight || 100) - 32}
            />
          );
        default:
          return (
            <AdvancedKpiCard metric={metric} />
          );
      }
    };

    return (
      <SortableWidget key={layoutItem.i} id={layoutItem.i}>
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{
            gridColumn: `${layoutItem.x + 1} / span ${layoutItem.w}`,
            gridRow: `${layoutItem.y + 1} / span ${layoutItem.h}`,
            minHeight: `${layoutItem.h * (config.rowHeight || 100)}px`
          }}
        >
          {widgetContent()}
        </div>
      </SortableWidget>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">{config.name}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsWidgetSelectorOpen(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Widget
              </button>
              <button
                onClick={() => setIsConfigPanelOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-white rounded-md shadow-sm">
                Edit
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div ref={containerRef} style={gridStyle} className="p-6">
          <SortableContext items={config.layout.map(item => item.i)} strategy={rectSortingStrategy}>
            {config.layout.map(renderWidget)}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? dragPreview : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <AnimatePresence>
        {isConfigPanelOpen && (
          <GridConfigPanel
            isOpen={isConfigPanelOpen}
            onClose={() => setIsConfigPanelOpen(false)}
            onConfigChange={(newConfig) => setConfig(newConfig)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWidgetSelectorOpen && (
          <WidgetSelector
            isOpen={isWidgetSelectorOpen}
            onClose={() => setIsWidgetSelectorOpen(false)}
            onSelectWidget={handleAddWidget}
            availableMetrics={metrics}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardBuilder;