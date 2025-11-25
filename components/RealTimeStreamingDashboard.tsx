"use client";

import React, { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap'; // TEMP: Disabled due to missing dependency
import { Activity, Zap, TrendingUp, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

// Simple animation utility to replace GSAP
const simpleAnimate = (element: HTMLElement, from: any, to: any, duration = 0.8) => {
  if (!element) return;
  Object.assign(element.style, { ...from });
  setTimeout(() => {
    Object.assign(element.style, {
      ...to,
      transition: `all ${duration}s ease-out`
    });
  }, 100);
};

interface LiveMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  status: 'normal' | 'warning' | 'critical';
}

interface DataPoint {
  timestamp: number;
  value: number;
  label: string;
}

const LiveMetricCard: React.FC<{
  metric: LiveMetric;
  index: number;
  isVisible: boolean;
}> = ({ metric, index, isVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(metric.value);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const card = cardRef.current;
    if (!card) return;

    // Entrance animation
    setTimeout(() => {
      simpleAnimate(card, {
        opacity: 0,
        x: '-100px',
        transform: 'scale(0.8)',
      }, {
        opacity: 1,
        x: '0px',
        transform: 'scale(1)',
      }, 0.8);
    }, index * 100);
  }, [isVisible, index]);

  // Real-time value updates
  useEffect(() => {
    if (!valueRef.current) return;

    // Add subtle pulse for live data
    valueRef.current.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
      if (valueRef.current) {
        valueRef.current.style.transform = 'scale(1.05)';
        setTimeout(() => {
          if (valueRef.current) {
            valueRef.current.style.transform = 'scale(1)';
          }
        }, 300);
      }
    }, 10);
      ease: "power2.inOut",
    });

    // Update value with animation
    const startValue = displayValue;
    const endValue = metric.value;
    const duration = 500;
    const startTime = Date.now();
    
    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    animateValue();

    // Flash for significant changes
    if (Math.abs(metric.change) > 10) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1000);
    }
  }, [metric.value, metric.change, displayValue]);

  const getStatusIcon = () => {
    switch (metric.status) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 
        transition-all duration-300 hover:bg-white/15 group cursor-pointer relative overflow-hidden
        ${isFlashing ? 'ring-2 ring-yellow-400' : ''}
      `}
      style={{
        background: isFlashing 
          ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 255, 255, 0.1))'
          : `linear-gradient(135deg, ${metric.color}15, transparent)`,
      }}
    >
      {/* Background pulse animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${metric.color}20, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white/60 text-sm font-medium">{metric.label}</span>
          </div>
          {getTrendIcon()}
        </div>
        
        <div className="space-y-2">
          <div 
            ref={valueRef}
            className="text-3xl font-bold text-white"
          >
            {displayValue.toFixed(metric.unit === '%' ? 1 : 0)}{metric.unit}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              Change: {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}{metric.unit}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/40 text-xs">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated border for active state */}
      <div className="absolute inset-0 rounded-2xl border border-white/10">
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(45deg, transparent, ${metric.color}30, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

const RealTimeChart: React.FC<{ 
  data: DataPoint[];
  color: string;
  height?: number;
}> = ({ data, color, height = 200 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!svgRef.current || !pathRef.current || data.length < 2) return;

    const svg = svgRef.current;
    const path = pathRef.current;
    
    // Calculate path from data points
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue;
    
    const pointSpacing = 100 / (data.length - 1);
    let pathData = '';
    
    data.forEach((point, index) => {
      const x = index * pointSpacing;
      const y = height - ((point.value - minValue) / valueRange) * (height - 40);
      
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });

    // Animate path drawing
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();
    
    // Animate stroke dashoffset
    const startTime = Date.now();
    const duration = 1500;
    
    const animatePath = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out using cubic bezier
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const currentOffset = pathLength * (1 - easeOut);
      
      path.style.strokeDashoffset = currentOffset.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animatePath);
      } else {
        // Start glow effect after path animation completes
        startGlowEffect();
      }
    };

    function startGlowEffect() {
      let glowDirection = 1;
      const glowInterval = setInterval(() => {
        if (glowDirection === 1) {
          path.style.filter = 'drop-shadow(0 0 6px currentColor)';
        } else {
          path.style.filter = 'drop-shadow(0 0 0px currentColor)';
        }
        glowDirection *= -1;
      }, 1000);
      
      // Store cleanup function
      (path as any)._glowCleanup = () => clearInterval(glowInterval);
    }
    
    animatePath();
  }, [data, height, color]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      className="overflow-visible"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}
    >
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      <path
        ref={pathRef}
        d=""
        stroke={color}
        strokeWidth="2"
        fill="none"
        className="drop-shadow-lg"
      />
      
      {/* Area fill */}
      <path
        d=""
        fill={`url(#gradient-${color.replace('#', '')})`}
        stroke="none"
      />
      
      {/* Data points */}
      {data.slice(-10).map((point, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const valueRange = maxValue - minValue;
        
        const x = index * (100 / Math.min(data.length - 1, 9));
        const y = height - ((point.value - minValue) / valueRange) * (height - 40);
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill={color}
            className="opacity-0"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
            }}
          />
        );
      })}
    </svg>
  );
};

const RealTimeStreamingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      id: '1',
      label: 'Active Users',
      value: 1247,
      unit: '',
      change: 12.5,
      trend: 'up',
      color: '#10B981',
      status: 'normal'
    },
    {
      id: '2',
      label: 'Server Load',
      value: 73.2,
      unit: '%',
      change: -5.3,
      trend: 'down',
      color: '#F59E0B',
      status: 'warning'
    },
    {
      id: '3',
      label: 'Response Time',
      value: 145,
      unit: 'ms',
      change: 23.1,
      trend: 'up',
      color: '#EF4444',
      status: 'critical'
    },
    {
      id: '4',
      label: 'Throughput',
      value: 2847,
      unit: ' req/s',
      change: 8.7,
      trend: 'up',
      color: '#3B82F6',
      status: 'normal'
    },
    {
      id: '5',
      label: 'Error Rate',
      value: 0.8,
      unit: '%',
      change: -2.1,
      trend: 'down',
      color: '#8B5CF6',
      status: 'normal'
    },
    {
      id: '6',
      label: 'Memory Usage',
      value: 68.5,
      unit: '%',
      change: 15.2,
      trend: 'up',
      color: '#06B6D4',
      status: 'warning'
    }
  ]);

  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Simple setInterval for real-time updates
  useEffect(() => {
    if (!isVisible) return;

    const updateInterval = 2000; // Update every 2 seconds
    
    const updateData = () => {
      // Simulate real-time data updates
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 20),
          change: (Math.random() - 0.5) * 30,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          status: Math.random() > 0.8 ? 'warning' : metric.status
        }))
      );

      // Add new data point
      const newPoint: DataPoint = {
        timestamp: Date.now(),
        value: Math.random() * 100 + 500,
        label: 'Live Data'
      };
      
      setChartData(prevData => {
        const newData = [...prevData, newPoint];
        return newData.slice(-50); // Keep last 50 points
      });

      setLastUpdate(new Date());
    };

    const intervalId = setInterval(updateData, updateInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isVisible]);

  // Simulate connection status
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const container = dashboardRef.current;
    if (!container) return;

    // Background animated particles
    const particles = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const animateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      });
      
      // Continue animation if still visible
      if (isVisible) {
        requestAnimationFrame(animateParticles);
      }
    };

    // Start particle animation
    requestAnimationFrame(animateParticles);
    
    return () => {
      // No cleanup needed for requestAnimationFrame
    };
  }, [isVisible]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-white">
              Real-Time Streaming Dashboard
            </h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <p className="text-white/60">
            Live data streaming with GSAP ticker-powered animations
          </p>
          <div className="text-white/40 text-sm mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Main Dashboard */}
        <div ref={dashboardRef} className="space-y-8">
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <LiveMetricCard
                key={metric.id}
                metric={metric}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Real-time Chart */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Data Stream
              </h3>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-white/60 text-sm">Real-time processing</span>
              </div>
            </div>
            
            <div className="h-64">
              <RealTimeChart 
                data={chartData} 
                color="#3B82F6" 
                height={250}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs">Data Points</div>
                <div className="text-white font-bold text-lg">{chartData.length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs">Update Rate</div>
                <div className="text-white font-bold text-lg">2s</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-xs">Active Streams</div>
                <div className="text-white font-bold text-lg">3</div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              System Health
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Database', status: 'healthy', uptime: '99.9%' },
                { name: 'API Gateway', status: 'healthy', uptime: '99.8%' },
                { name: 'Message Queue', status: 'warning', uptime: '98.5%' },
                { name: 'Cache Layer', status: 'healthy', uptime: '99.7%' },
              ].map((service, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'
                    } animate-pulse`} />
                    <span className="text-white/80 text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="text-white/60 text-xs">Uptime: {service.uptime}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RealTimeStreamingDashboard;