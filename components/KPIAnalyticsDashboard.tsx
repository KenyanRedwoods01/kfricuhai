/**
 * Advanced KPI Analytics & Insights Engine
 * Implements predictive analytics, anomaly detection, and trend analysis
 * Based on 2025 research findings
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChartBarIcon,
  BeakerIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AdvancedKPIMetric } from '../utils/advancedKPIEngine';
import { format, subDays, isAfter, parseISO, differenceInDays } from 'date-fns';

// Advanced Analytics Types
export interface KPITrend {
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  strength: number; // 0-1 scale
  confidence: number; // 0-1 scale
  projectedValue: number;
  projectedDate: Date;
  changeRate: number; // percentage change per period
  seasonality?: {
    detected: boolean;
    period: number;
    amplitude: number;
  };
}

export interface KPIAnomaly {
  id: string;
  timestamp: Date;
  metricId: string;
  type: 'spike' | 'drop' | 'outlier' | 'trend_break';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  expectedValue: number;
  deviation: number; // percentage deviation from expected
  description: string;
  possibleCauses: string[];
  recommendations: string[];
}

export interface KPIInsight {
  id: string;
  type: 'trend' | 'correlation' | 'anomaly' | 'prediction' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  data: any;
  generatedAt: Date;
  expiresAt?: Date;
}

export interface PredictiveModel {
  algorithm: 'linear_regression' | 'polynomial' | 'exponential_smoothing' | 'arima' | 'lstm';
  accuracy: number;
  rmse: number;
  mae: number;
  r2: number;
  lastTrained: Date;
  nextPrediction: {
    value: number;
    confidence: number;
    timestamp: Date;
  };
}

// Advanced Statistical Analysis Engine
class KPIAnalyticsEngine {
  private dataProcessor: Worker | null = null;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    const workerCode = `
      // Advanced analytics worker for KPI analysis
      class KPIAnalyticsEngine {
        constructor() {
          this.cache = new Map();
        }

        // Linear regression for trend analysis
        linearRegression(data) {
          const n = data.length;
          if (n < 2) return null;

          let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

          for (let i = 0; i < n; i++) {
            const x = i;
            const y = data[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
            sumYY += y * y;
          }

          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;

          // Calculate R-squared
          const ssTotal = sumYY - (sumY * sumY) / n;
          const ssResidual = data.reduce((acc, y, i) => {
            const predicted = slope * i + intercept;
            return acc + Math.pow(y - predicted, 2);
          }, 0);
          const r2 = 1 - (ssResidual / ssTotal);

          // Calculate standard error
          const mse = ssResidual / (n - 2);
          const se = Math.sqrt(mse);

          return {
            slope,
            intercept,
            r2,
            standardError: se,
            predictions: data.map((_, i) => slope * i + intercept)
          };
        }

        // Anomaly detection using statistical methods
        detectAnomalies(data, threshold = 2) {
          if (data.length < 3) return [];

          const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
          const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
          const stdDev = Math.sqrt(variance);

          return data.map((value, index) => {
            const zScore = Math.abs((value - mean) / stdDev);
            const isAnomaly = zScore > threshold;
            
            return {
              index,
              value,
              isAnomaly,
              zScore,
              deviation: (value - mean) / mean * 100,
              severity: zScore > 3 ? 'critical' : zScore > 2.5 ? 'high' : zScore > 2 ? 'medium' : 'low'
            };
          }).filter(result => result.isAnomaly);
        }

        // Seasonal decomposition (simplified)
        seasonalDecomposition(data, period = 7) {
          if (data.length < period * 2) return null;

          // Calculate trend using moving average
          const trend = [];
          const window = Math.floor(period / 2) * 2 + 1; // Make it odd
          
          for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - Math.floor(window / 2));
            const end = Math.min(data.length, i + Math.floor(window / 2) + 1);
            const windowData = data.slice(start, end);
            trend[i] = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
          }

          // Calculate seasonal components
          const seasonal = new Array(period).fill(0);
          const seasonalCounts = new Array(period).fill(0);

          for (let i = 0; i < data.length; i++) {
            const detrended = data[i] - trend[i];
            const seasonIndex = i % period;
            seasonal[seasonIndex] += detrended;
            seasonalCounts[seasonIndex]++;
          }

          for (let i = 0; i < period; i++) {
            if (seasonalCounts[i] > 0) {
              seasonal[i] /= seasonalCounts[i];
            }
          }

          // Normalize seasonal components
          const seasonalMean = seasonal.reduce((sum, val) => sum + val, 0) / period;
          for (let i = 0; i < period; i++) {
            seasonal[i] -= seasonalMean;
          }

          return {
            trend,
            seasonal,
            residual: data.map((val, i) => val - trend[i] - seasonal[i % period])
          };
        }

        // Correlation analysis
        correlationAnalysis(datasets) {
          const keys = Object.keys(datasets);
          const correlations = {};

          for (let i = 0; i < keys.length; i++) {
            for (let j = i + 1; j < keys.length; j++) {
              const key1 = keys[i];
              const key2 = keys[j];
              const data1 = datasets[key1];
              const data2 = datasets[key2];
              
              const correlation = this.calculatePearsonCorrelation(data1, data2);
              correlations[\`\${key1}_\${key2}\`] = {
                correlation,
                strength: Math.abs(correlation),
                type: correlation > 0 ? 'positive' : 'negative'
              };
            }
          }

          return correlations;
        }

        calculatePearsonCorrelation(x, y) {
          const n = Math.min(x.length, y.length);
          if (n < 2) return 0;

          const sumX = x.reduce((a, b) => a + b, 0);
          const sumY = y.reduce((a, b) => a + b, 0);
          const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
          const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
          const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

          const numerator = n * sumXY - sumX * sumY;
          const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

          return denominator === 0 ? 0 : numerator / denominator;
        }

        // Predictive modeling using simple algorithms
        predictiveModel(data, steps = 7) {
          if (data.length < 3) return null;

          const regression = this.linearRegression(data);
          if (!regression) return null;

          const predictions = [];
          const confidence = Math.max(0.1, 1 - Math.abs(regression.standardError / Math.abs(regression.slope)));

          for (let i = 1; i <= steps; i++) {
            const index = data.length - 1 + i;
            const value = regression.slope * index + regression.intercept;
            predictions.push({
              step: i,
              value: Math.max(0, value), // Ensure non-negative
              confidence: Math.max(0, confidence * Math.pow(0.9, i)) // Decreasing confidence
            });
          }

          return {
            algorithm: 'linear_regression',
            model: regression,
            predictions,
            accuracy: Math.max(0, regression.r2),
            confidence: confidence
          };
        }

        // Generate insights from data
        generateInsights(metrics) {
          const insights = [];

          for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];
            const timeSeriesData = metric.metadata?.timeSeriesData || [];
            const values = timeSeriesData.map(d => d.value);
            
            if (values.length < 3) continue;

            // Trend analysis
            const regression = this.linearRegression(values);
            if (regression) {
              const slope = regression.slope;
              const direction = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';
              const strength = Math.abs(slope);
              
              insights.push({
                type: 'trend',
                metricId: metric.id,
                title: \`\${metric.name} Trend Analysis\`,
                description: \`The \${metric.name} is showing a \${direction} trend\`,
                direction,
                strength,
                confidence: regression.r2,
                slope,
                impact: strength > 0.1 ? 'high' : strength > 0.05 ? 'medium' : 'low'
              });
            }

            // Anomaly detection
            const anomalies = this.detectAnomalies(values);
            anomalies.forEach(anomaly => {
              insights.push({
                type: 'anomaly',
                metricId: metric.id,
                title: \`\${metric.name} Anomaly Detected\`,
                description: \`Unusual \${anomaly.severity} deviation detected in \${metric.name}\`,
                severity: anomaly.severity,
                value: anomaly.value,
                deviation: anomaly.deviation,
                impact: anomaly.severity === 'critical' ? 'critical' : anomaly.severity === 'high' ? 'high' : 'medium'
              });
            });

            // Prediction
            const prediction = this.predictiveModel(values);
            if (prediction) {
              insights.push({
                type: 'prediction',
                metricId: metric.id,
                title: \`\${metric.name} Prediction\`,
                description: \`Predicted \${metric.name} value for next period\`,
                predictedValue: prediction.predictions[0].value,
                confidence: prediction.confidence,
                algorithm: prediction.algorithm,
                impact: prediction.confidence > 0.8 ? 'high' : 'medium'
              });
            }
          }

          return insights;
        }
      }

      const engine = new KPIAnalyticsEngine();

      self.onmessage = function(e) {
        const { id, type, data, params } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'analyze_trend':
              result = engine.linearRegression(data);
              break;
            case 'detect_anomalies':
              result = engine.detectAnomalies(data, params?.threshold || 2);
              break;
            case 'seasonal_analysis':
              result = engine.seasonalDecomposition(data, params?.period || 7);
              break;
            case 'correlation_analysis':
              result = engine.correlationAnalysis(data);
              break;
            case 'predictive_modeling':
              result = engine.predictiveModel(data, params?.steps || 7);
              break;
            case 'generate_insights':
              result = engine.generateInsights(data);
              break;
            default:
              result = { error: 'Unknown analysis type' };
          }
          
          self.postMessage({ id, success: true, result });
        } catch (error) {
          self.postMessage({ id, success: false, error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.dataProcessor = new Worker(URL.createObjectURL(blob));
  }

  async analyzeTrend(data: number[]): Promise<KPITrend | null> {
    return new Promise((resolve) => {
      if (!this.dataProcessor) {
        resolve(null);
        return;
      }

      const id = `trend_${Date.now()}`;
      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === id) {
          const result = e.data.result;
          if (result) {
            resolve({
              direction: result.slope > 0.01 ? 'increasing' : 
                      result.slope < -0.01 ? 'decreasing' : 'stable',
              strength: Math.abs(result.slope),
              confidence: result.r2,
              projectedValue: result.predictions[result.predictions.length - 1] || 0,
              projectedDate: subDays(new Date(), -7),
              changeRate: (result.slope / (result.intercept || 1)) * 100,
              seasonality: undefined // Will be filled by seasonal analysis
            });
          } else {
            resolve(null);
          }
          this.dataProcessor?.removeEventListener('message', handleMessage);
        }
      };

      this.dataProcessor.addEventListener('message', handleMessage);
      this.dataProcessor.postMessage({ id, type: 'analyze_trend', data });
    });
  }

  async detectAnomalies(data: number[], threshold = 2): Promise<KPIAnomaly[]> {
    return new Promise((resolve) => {
      if (!this.dataProcessor) {
        resolve([]);
        return;
      }

      const id = `anomaly_${Date.now()}`;
      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === id) {
          const anomalies = e.data.result || [];
          resolve(anomalies.map((a: any) => ({
            id: `anomaly_${a.index}`,
            timestamp: subDays(new Date(), -a.index),
            metricId: '', // Will be set by caller
            type: a.zScore > 3 ? 'spike' : a.zScore < -2 ? 'drop' : 'outlier',
            severity: a.severity,
            value: a.value,
            expectedValue: 0, // Will be calculated
            deviation: a.deviation,
            description: `${a.severity} deviation detected`,
            possibleCauses: ['Data entry error', 'System glitch', 'Business event', 'External factor'],
            recommendations: ['Investigate root cause', 'Verify data source', 'Check for system issues']
          })));
          this.dataProcessor?.removeEventListener('message', handleMessage);
        }
      };

      this.dataProcessor.addEventListener('message', handleMessage);
      this.dataProcessor.postMessage({ id, type: 'detect_anomalies', data, params: { threshold } });
    });
  }

  async generateInsights(metrics: AdvancedKPIMetric[]): Promise<KPIInsight[]> {
    return new Promise((resolve) => {
      if (!this.dataProcessor) {
        resolve([]);
        return;
      }

      const id = `insights_${Date.now()}`;
      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === id) {
          const insights = e.data.result || [];
          resolve(insights.map((insight: any) => ({
            id: `insight_${insight.type}_${insight.metricId}`,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            impact: insight.impact,
            confidence: insight.confidence || 0.5,
            actionable: true,
            priority: insight.impact === 'critical' ? 'high' : insight.impact === 'high' ? 'high' : 'medium',
            category: 'analytics',
            data: insight,
            generatedAt: new Date()
          })));
          this.dataProcessor?.removeEventListener('message', handleMessage);
        }
      };

      this.dataProcessor.addEventListener('message', handleMessage);
      this.dataProcessor.postMessage({ id, type: 'generate_insights', data: metrics });
    });
  }

  terminate() {
    if (this.dataProcessor) {
      this.dataProcessor.terminate();
      this.dataProcessor = null;
    }
  }
}

// Advanced Analytics Dashboard Component
interface KPIAnalyticsDashboardProps {
  metrics: AdvancedKPIMetric[];
  className?: string;
  onInsightClick?: (insight: KPIInsight) => void;
}

export function KPIAnalyticsDashboard({ 
  metrics, 
  className = '', 
  onInsightClick 
}: KPIAnalyticsDashboardProps) {
  const [insights, setInsights] = useState<KPIInsight[]>([]);
  const [anomalies, setAnomalies] = useState<KPIAnomaly[]>([]);
  const [trends, setTrends] = useState<Map<string, KPITrend>>(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<KPIInsight | null>(null);
  const analyticsEngine = useRef<KPIAnalyticsEngine>(new KPIAnalyticsEngine());

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Generate insights for all metrics
      const insightsData = await analyticsEngine.current.generateInsights(metrics);
      setInsights(insightsData);

      // Analyze trends and detect anomalies for each metric
      const trendMap = new Map<string, KPITrend>();
      const anomalyList: KPIAnomaly[] = [];

      for (let i = 0; i < metrics.length; i++) {
        const metric = metrics[i];
        const timeSeriesData = metric.metadata?.timeSeriesData || [];
        const values = timeSeriesData.map(d => d.value);

        if (values.length >= 3) {
          // Trend analysis
          const trend = await analyticsEngine.current.analyzeTrend(values);
          if (trend) {
            trendMap.set(metric.id, trend);
          }

          // Anomaly detection
          const metricAnomalies = await analyticsEngine.current.detectAnomalies(values);
          metricAnomalies.forEach(anomaly => {
            anomaly.metricId = metric.id;
            anomalyList.push(anomaly);
          });
        }
      }

      setTrends(trendMap);
      setAnomalies(anomalyList);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [metrics]);

  useEffect(() => {
    if (metrics.length > 0) {
      runAnalysis();
    }

    return () => {
      analyticsEngine.current.terminate();
    };
  }, [metrics, runAnalysis]);

  const criticalInsights = useMemo(() => 
    insights.filter(insight => insight.impact === 'critical' || insight.impact === 'high'),
    [insights]
  );

  const highPriorityAnomalies = useMemo(() =>
    anomalies.filter(anomaly => anomaly.severity === 'critical' || anomaly.severity === 'high'),
    [anomalies]
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUpIcon;
      case 'anomaly': return ExclamationTriangleIcon;
      case 'prediction': return LightBulbIcon;
      case 'correlation': return ChartBarIcon;
      default: return SparklesIcon;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Advanced Analytics</h2>
              <p className="text-sm text-gray-600">AI-powered insights and predictions</p>
            </div>
          </div>
          
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Analyzing...
              </>
            ) : (
              <>
                <BeakerIcon className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Critical Insights Alert */}
      {criticalInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Critical Insights Detected</h3>
          </div>
          <div className="space-y-2">
            {criticalInsights.slice(0, 3).map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-800">{insight.title}</h4>
                      <p className="text-sm text-red-700">{insight.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-yellow-500" />
                Key Insights ({insights.length})
              </h3>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {insights.map((insight) => {
                  const IconComponent = getInsightIcon(insight.type);
                  const colorClass = getInsightColor(insight.impact);
                  
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${colorClass}`}
                      onClick={() => {
                        setSelectedInsight(insight);
                        onInsightClick?.(insight);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm opacity-90 mt-1">{insight.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs">
                              <span>Impact: {insight.impact}</span>
                              <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                              <span>Priority: {insight.priority}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {insights.length === 0 && !isAnalyzing && (
                <div className="text-center py-8 text-gray-500">
                  <LightBulbIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No insights generated yet</p>
                  <p className="text-sm">Run analysis to get AI-powered insights</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Anomalies & Trends Panel */}
        <div className="space-y-4">
          {/* Anomalies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
                Anomalies ({anomalies.length})
              </h3>
            </div>
            
            <div className="p-6 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {highPriorityAnomalies.slice(0, 5).map((anomaly) => (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3 rounded-lg border mb-3 ${
                      anomaly.severity === 'critical' ? 'bg-red-50 border-red-200' : 
                      anomaly.severity === 'high' ? 'bg-orange-50 border-orange-200' : 
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium text-sm ${
                          anomaly.severity === 'critical' ? 'text-red-800' : 
                          anomaly.severity === 'high' ? 'text-orange-800' : 'text-yellow-800'
                        }`}>
                          {anomaly.type.toUpperCase()} Anomaly
                        </h4>
                        <p className={`text-xs mt-1 ${
                          anomaly.severity === 'critical' ? 'text-red-700' : 
                          anomaly.severity === 'high' ? 'text-orange-700' : 'text-yellow-700'
                        }`}>
                          {Math.abs(anomaly.deviation).toFixed(1)}% deviation
                        </p>
                      </div>
                      <div className={`text-xs font-medium ${
                        anomaly.severity === 'critical' ? 'text-red-600' : 
                        anomaly.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`}>
                        {anomaly.severity}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {highPriorityAnomalies.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No anomalies detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Trends Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
                Trends Summary
              </h3>
            </div>
            
            <div className="p-6 space-y-3">
              {Array.from(trends.entries()).slice(0, 5).map(([metricId, trend]) => {
                const metric = metrics.find(m => m.id === metricId);
                if (!metric) return null;

                const TrendIcon = trend.direction === 'increasing' ? TrendingUpIcon : 
                                trend.direction === 'decreasing' ? TrendingDownIcon : 
                                ChartBarIcon;
                
                return (
                  <div key={metricId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendIcon className={`w-4 h-4 ${
                        trend.direction === 'increasing' ? 'text-green-500' : 
                        trend.direction === 'decreasing' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-sm">{metric.name}</h4>
                        <p className="text-xs text-gray-600 capitalize">{trend.direction} trend</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">
                        {(trend.confidence * 100).toFixed(0)}% confidence
                      </div>
                      <div className="text-xs text-gray-600">
                        {trend.changeRate > 0 ? '+' : ''}{trend.changeRate.toFixed(1)}%/period
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {trends.size === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedInsight.title}</h3>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedInsight.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Impact</div>
                  <div className="font-semibold capitalize">{selectedInsight.impact}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="font-semibold">{(selectedInsight.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Generated: {selectedInsight.generatedAt.toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { KPIAnalyticsEngine };