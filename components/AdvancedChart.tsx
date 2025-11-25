import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface AdvancedChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'radial';
  data: ChartData[];
  title: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  gradient?: boolean;
  formatValue?: (value: number) => string;
  currency?: string;
  theme?: 'light' | 'dark';
}

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const COLORS = {
  light: {
    background: '#ffffff',
    text: '#1f2937',
    grid: '#e5e7eb',
    tooltip: '#1f2937',
  },
  dark: {
    background: '#1f2937',
    text: '#f9fafb',
    grid: '#374151',
    tooltip: '#f9fafb',
  }
};

export const AdvancedChart: React.FC<AdvancedChartProps> = ({
  type,
  data,
  title,
  subtitle,
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  animated = true,
  gradient = true,
  formatValue,
  currency,
  theme = 'light'
}) => {
  const themeColors = COLORS[theme];
  
  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: item.fill || colors[index % colors.length]
    }));
  }, [data, colors]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = formatValue ? formatValue(value) : 
        currency ? `${currency} ${value.toLocaleString()}` : value.toLocaleString();
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-800 dark:text-gray-200 font-medium">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Value: <span className="font-semibold">{formattedValue}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />}
            <XAxis 
              dataKey="name" 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue ? formatValue(value) : value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors[0] }}
              animationDuration={animated ? 2000 : 0}
            />
          </LineChart>
        );

      case 'area':
        const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />}
            <XAxis 
              dataKey="name" 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue ? formatValue(value) : value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              fill={gradient ? `url(#${gradientId})` : colors[0]}
              fillOpacity={gradient ? 0.6 : 1}
              animationDuration={animated ? 2000 : 0}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />}
            <XAxis 
              dataKey="name" 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={themeColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue ? formatValue(value) : value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Bar 
              dataKey="value" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              animationDuration={animated ? 1000 : 0}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart {...chartProps}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationBegin={animated ? 0 : 500}
              animationDuration={animated ? 1500 : 0}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="10%" 
            outerRadius="80%" 
            data={processedData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={colors[0]}
              animationDuration={animated ? 2000 : 0}
            />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};