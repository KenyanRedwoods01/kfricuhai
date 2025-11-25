"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings, 
  Filter, 
  Download, 
  Share2,
  Eye,
  MoreHorizontal,
  Zap,
  Target,
  Activity
} from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  description
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial entrance animation
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (cardRef.current) {
      // Card lift effect
      gsap.to(cardRef.current, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });

      // Icon bounce effect
      const icon = cardRef.current.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Subtle glow effect
      gsap.to(cardRef.current, {
        boxShadow: `0 20px 40px ${color}40`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (cardRef.current) {
      // Reset card position
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
      });

      // Reset icon
      const icon = cardRef.current.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    
    if (cardRef.current) {
      // Click animation
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(cardRef.current, {
            scale: 1.02,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }
      });

      // Ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.background = color;
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.opacity = '0.3';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      
      cardRef.current.style.position = 'relative';
      cardRef.current.appendChild(ripple);
      
      gsap.fromTo(ripple, {
        scale: 0,
        opacity: 0.3,
      }, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          ripple.remove();
        }
      });
    }
    
    setTimeout(() => setIsClicked(false), 300);
  };

  const getTrendColor = () => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getTrendIcon = () => {
    return change >= 0 ? '↗' : '↘';
  };

  return (
    <div
      ref={cardRef}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/15 group"
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, ${color}20, rgba(255,255,255,0.1))`
          : `linear-gradient(135deg, ${color}15, transparent)`,
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="card-icon p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        <div ref={valueRef} className="text-2xl font-bold text-white">
          {value}
        </div>
        {description && (
          <p className="text-white/50 text-xs">{description}</p>
        )}
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden">
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `linear-gradient(45deg, transparent, ${color}60, transparent)`,
              animation: 'borderShimmer 2s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};

const InteractiveChartContainer: React.FC<{ 
  children: React.ReactNode; 
  title: string;
}> = ({ children, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Entrance animation
    gsap.fromTo(container,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: isExpanded ? 1 : 1.05,
        zIndex: isExpanded ? 1 : 1000,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  };

  const handleControlHover = (controlRef: HTMLElement | null, isHovering: boolean) => {
    if (!controlRef) return;

    gsap.to(controlRef, {
      scale: isHovering ? 1.1 : 1,
      backgroundColor: isHovering ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-500 ${
        isExpanded ? 'fixed inset-4 z-50 overflow-auto' : ''
      }`}
    >
      {/* Chart Header with Interactive Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Filter Control */}
          <div
            className="p-2 rounded-lg bg-white/10 cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleControlHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleControlHover(e.currentTarget, false)}
          >
            <Filter className="w-4 h-4 text-white" />
          </div>
          
          {/* Expand Control */}
          <div
            className="p-2 rounded-lg bg-white/10 cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleControlHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleControlHover(e.currentTarget, false)}
            onClick={handleExpand}
          >
            <Eye className="w-4 h-4 text-white" />
          </div>
          
          {/* Download Control */}
          <div
            className="p-2 rounded-lg bg-white/10 cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleControlHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleControlHover(e.currentTarget, false)}
          >
            <Download className="w-4 h-4 text-white" />
          </div>
          
          {/* Share Control */}
          <div
            className="p-2 rounded-lg bg-white/10 cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleControlHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleControlHover(e.currentTarget, false)}
          >
            <Share2 className="w-4 h-4 text-white" />
          </div>
          
          {/* More Options */}
          <div
            className="p-2 rounded-lg bg-white/10 cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleControlHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleControlHover(e.currentTarget, false)}
          >
            <MoreHorizontal className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="relative">
        {children}
      </div>

      {/* Expand Overlay */}
      {isExpanded && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
          onClick={handleExpand}
        >
          <div
            className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-2xl font-bold mb-4">{title} (Expanded)</h3>
            <p className="text-white/80">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};

const HoverRevealTooltip: React.FC<{
  content: string;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
    
    gsap.fromTo(tooltipRef.current,
      {
        opacity: 0,
        y: 10,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      }
    );
  };

  const handleMouseLeave = () => {
    gsap.to(tooltipRef.current, {
      opacity: 0,
      y: 10,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setIsVisible(false),
    });
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/20 z-50"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
        </div>
      )}
    </div>
  );
};

const MicroInteractionsDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
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

  const handleMetricSelect = (metricId: string) => {
    setSelectedMetric(metricId);
    
    // Highlight selected metric
    const metric = document.querySelector(`[data-metric="${metricId}"]`);
    if (metric) {
      gsap.to(metric, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Micro-Interactions Dashboard
          </h1>
          <p className="text-white/60">
            Interactive elements with hover effects, click animations, and dynamic feedback
          </p>
        </div>

        {/* Interactive Cards Grid */}
        <div ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              id: 'revenue',
              title: 'Total Revenue',
              value: '$2.4M',
              change: 15.3,
              icon: <DollarSign className="w-6 h-6 text-white" />,
              color: '#10B981',
              description: 'Monthly recurring revenue'
            },
            {
              id: 'users',
              title: 'Active Users',
              value: '24.5K',
              change: 8.7,
              icon: <Users className="w-6 h-6 text-white" />,
              color: '#3B82F6',
              description: 'Daily active users'
            },
            {
              id: 'conversion',
              title: 'Conversion Rate',
              value: '4.2%',
              change: -2.1,
              icon: <Target className="w-6 h-6 text-white" />,
              color: '#F59E0B',
              description: 'Visit to signup conversion'
            },
            {
              id: 'performance',
              title: 'Performance',
              value: '94.2%',
              change: 5.4,
              icon: <Zap className="w-6 h-6 text-white" />,
              color: '#8B5CF6',
              description: 'System uptime'
            },
          ].map((metric, index) => (
            <div key={metric.id} data-metric={metric.id}>
              <HoverRevealTooltip content={`${metric.description} • ${metric.change > 0 ? '+' : ''}${metric.change}%`}>
                <InteractiveCard
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  icon={metric.icon}
                  color={metric.color}
                  description={metric.description}
                />
              </HoverRevealTooltip>
            </div>
          ))}
        </div>

        {/* Interactive Chart Container */}
        <InteractiveChartContainer title="Revenue Analytics">
          <div className="h-64 bg-white/5 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <p className="text-white/80">Interactive Chart Area</p>
              <p className="text-white/40 text-sm">Hover over controls above for micro-interactions</p>
            </div>
          </div>
        </InteractiveChartContainer>

        {/* Action Buttons with Micro-interactions */}
        <div className="mt-8 flex flex-wrap gap-4">
          {[
            { icon: Settings, label: 'Settings', color: '#6B7280' },
            { icon: Filter, label: 'Filter', color: '#10B981' },
            { icon: Download, label: 'Export', color: '#3B82F6' },
            { icon: Share2, label: 'Share', color: '#F59E0B' },
          ].map((action, index) => (
            <HoverRevealTooltip key={index} content={`${action.label} dashboard data`}>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300 group"
                style={{
                  background: `linear-gradient(135deg, ${action.color}20, transparent)`,
                }}
              >
                <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                {action.label}
              </button>
            </HoverRevealTooltip>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Try These Interactions:</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              Hover over cards to see lift and glow effects
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Click on cards for ripple and scale animations
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              Hover over buttons for tooltips and icon animations
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              Use chart controls for micro-interaction feedback
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MicroInteractionsDashboard;