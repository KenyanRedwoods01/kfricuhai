"use client";

import React, { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap'; // TEMP: Disabled due to missing dependency
import { TrendingUp, TrendingDown, Minus, Target, Zap, Eye, BarChart3, Activity, Users, DollarSign } from 'lucide-react';

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

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  target?: string;
  color: string;
}

interface AnimatedMetricCardProps {
  metric: MetricCard;
  index: number;
  isVisible: boolean;
}

const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({ metric, index, isVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState('0');
  const [displayChange, setDisplayChange] = useState('0%');

  useEffect(() => {
    if (!isVisible) return;

    const card = cardRef.current;
    if (!card) return;

    // Staggered entrance animation
    setTimeout(() => {
      simpleAnimate(card, 
        {
          opacity: 0,
          y: '60px',
          transform: 'scale(0.8)',
        },
        {
          opacity: 1,
          y: '0px',
          transform: 'scale(1)',
        }
      );
    }, index * 100);
    );

    // Animate number counting
    const targetValue = parseFloat(metric.value.replace(/[$,]/g, '')) || 0;
    const targetChange = metric.change;

    // Animate value counting
    const animateValue = () => {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(startValue + (targetValue - startValue) * progress);
        
        setDisplayValue(
          metric.title.includes('Revenue') || metric.title.includes('Revenue') 
            ? `$${current.toLocaleString()}`
            : current.toLocaleString()
        );
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    // Animate change percentage
    const animateChange = () => {
      const duration = 1500;
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = startValue + (targetChange - startValue) * progress;
        
        setDisplayChange(current > 0 ? `+${current.toFixed(1)}%` : `${current.toFixed(1)}%`);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    animateValue();
    animateChange();

  }, [isVisible, metric, index]);

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${metric.color}15, transparent)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
          {metric.icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
          {getTrendIcon()}
          {displayChange}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white/70 text-sm font-medium">{metric.title}</h3>
        <div className="text-2xl font-bold text-white">
          {displayValue}
        </div>
        {metric.target && (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Target className="w-3 h-3" />
            <span>Target: {metric.target}</span>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-2000 ease-out"
            style={{
              width: isVisible ? `${Math.min(Math.abs(metric.change) * 10, 100)}%` : '0%',
              background: `linear-gradient(90deg, ${metric.color}, ${metric.color}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AnimatedKPIDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const metrics: MetricCard[] = [
    {
      id: '1',
      title: 'Total Revenue',
      value: '$2,847,392',
      change: 23.5,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6 text-white" />,
      target: '$3,000,000',
      color: '#10B981'
    },
    {
      id: '2',
      title: 'Active Users',
      value: '47,829',
      change: 18.2,
      trend: 'up',
      icon: <Users className="w-6 h-6 text-white" />,
      target: '50,000',
      color: '#3B82F6'
    },
    {
      id: '3',
      title: 'Conversion Rate',
      value: '3.47%',
      change: -2.1,
      trend: 'down',
      icon: <Target className="w-6 h-6 text-white" />,
      target: '4.0%',
      color: '#F59E0B'
    },
    {
      id: '4',
      title: 'Page Views',
      value: '1.2M',
      change: 12.8,
      trend: 'up',
      icon: <Eye className="w-6 h-6 text-white" />,
      target: '1.5M',
      color: '#8B5CF6'
    },
    {
      id: '5',
      title: 'API Requests',
      value: '89,247',
      change: 31.4,
      trend: 'up',
      icon: <Zap className="w-6 h-6 text-white" />,
      target: '100,000',
      color: '#EF4444'
    },
    {
      id: '6',
      title: 'Performance Score',
      value: '94.2',
      change: 5.3,
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      target: '95',
      color: '#06B6D4'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const container = dashboardRef.current;
    if (!container) return;

    // Background animation using CSS
    if (container) {
      container.style.background = `linear-gradient(-45deg, #1e293b, #7c3aed, #1e293b, #312e81)`;
      container.style.backgroundSize = '400% 400%';
      container.style.animation = 'gradient 20s ease infinite';
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
    }

    // Subtle floating animation for cards using CSS
    const cardElements = document.querySelectorAll('.hover\\:bg-white\\/15');
    cardElements.forEach((card, index) => {
      const element = card as HTMLElement;
      element.style.animation = `float 2s ease-in-out infinite ${index * 0.2}s`;
    });
    
    // Add CSS animation for floating
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(floatStyle);
  }, [isVisible]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Animated KPI Dashboard
          </h1>
          <p className="text-white/60">
            Real-time metrics with stunning animations and micro-interactions
          </p>
        </div>

        {/* Main Dashboard Container */}
        <div 
          ref={dashboardRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `,
            backgroundSize: '100% 100%',
          }}
        >
          {metrics.map((metric, index) => (
            <AnimatedMetricCard
              key={metric.id}
              metric={metric}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Real-time Activity Feed */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Real-time Activity</h3>
          </div>
          <div className="space-y-3">
            {[
              { action: 'New user registration', time: '2s ago', icon: <Users className="w-4 h-4" /> },
              { action: 'Payment processed', time: '5s ago', icon: <DollarSign className="w-4 h-4" /> },
              { action: 'API endpoint accessed', time: '8s ago', icon: <Zap className="w-4 h-4" /> },
              { action: 'Report generated', time: '12s ago', icon: <BarChart3 className="w-4 h-4" /> },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-1.5 rounded-full bg-white/10">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white/80 text-sm">{activity.action}</div>
                  <div className="text-white/40 text-xs">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedKPIDashboard;