"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Loader2, BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface LoadingAnimation {
  id: string;
  type: 'skeleton' | 'pulse' | 'spinner' | 'progress' | 'data-stream';
  duration: number;
}

interface SkeletonCardProps {
  isVisible: boolean;
  delay: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ isVisible, delay }) => {
  const skeletonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !skeletonRef.current) return;

    const skeleton = skeletonRef.current;
    
    // Shimmer effect
    gsap.fromTo(skeleton,
      {
        opacity: 0.6,
      },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay,
      }
    );
  }, [isVisible, delay]);

  return (
    <div
      ref={skeletonRef}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/20 rounded animate-pulse" />
          <div className="h-3 bg-white/15 rounded w-3/4 animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-white/20 rounded animate-pulse" />
        <div className="h-2 bg-white/15 rounded animate-pulse" />
        <div className="h-2 bg-white/15 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
};

const AnimatedSpinner: React.FC<{ size?: number; color?: string }> = ({ 
  size = 40, 
  color = '#3B82F6' 
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spinnerRef.current) return;

    const spinner = spinnerRef.current;
    
    gsap.to(spinner, {
      rotate: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div
      ref={spinnerRef}
      className="rounded-full border-4 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

const ProgressBar: React.FC<{ 
  progress: number; 
  label: string; 
  color?: string;
  animated?: boolean;
}> = ({ progress, label, color = '#3B82F6', animated = true }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!progressRef.current) return;

    const bar = progressRef.current;

    if (animated) {
      gsap.to({ value: displayProgress }, {
        value: progress,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function() {
          const current = this.targets()[0].value;
          setDisplayProgress(current);
          bar.style.width = `${current}%`;
        }
      });
    } else {
      setDisplayProgress(progress);
      bar.style.width = `${progress}%`;
    }
  }, [progress, animated, displayProgress]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white/80 text-sm font-medium">{label}</span>
        <span className="text-white/60 text-sm">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full rounded-full transition-all duration-300"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
    </div>
  );
};

const DataStreamLoader: React.FC = () => {
  const [streamData, setStreamData] = useState<Array<{ id: number; value: number; label: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const streamData = [
      { id: 1, value: 245, label: 'Requests/sec' },
      { id: 2, value: 89, label: 'Database Queries' },
      { id: 3, value: 156, label: 'Cache Hits' },
      { id: 4, value: 23, label: 'Errors' },
    ];

    streamData.forEach((item, index) => {
      gsap.fromTo(containerRef.current?.querySelector(`[data-id="${item.id}"]`),
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power2.out",
        }
      );
    });
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Live Data Stream
      </h3>
      <div ref={containerRef} className="space-y-4">
        {streamData.map((item) => (
          <div key={item.id} data-id={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-white/80">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{item.value}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdvancedLoadingDashboard: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState({
    skeleton: false,
    data: false,
    charts: false,
    metrics: false,
  });
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const loadingSteps = [
    { id: 'skeleton', label: 'Loading interface...', duration: 1500 },
    { id: 'data', label: 'Fetching data...', duration: 2000 },
    { id: 'charts', label: 'Rendering charts...', duration: 1800 },
    { id: 'metrics', label: 'Calculating metrics...', duration: 1200 },
  ];

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

  const startLoadingSequence = async () => {
    setIsComplete(false);
    setProgress(0);
    
    for (let i = 0; i < loadingSteps.length; i++) {
      const step = loadingSteps[i];
      setCurrentStep(step.label);
      setLoadingStates(prev => ({ ...prev, [step.id]: true }));
      
      // Animate progress
      const targetProgress = ((i + 1) / loadingSteps.length) * 100;
      gsap.to({ value: progress }, {
        value: targetProgress,
        duration: step.duration / 1000,
        ease: "power2.out",
        onUpdate: function() {
          setProgress(this.targets()[0].value);
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      setLoadingStates(prev => ({ ...prev, [step.id]: false }));
    }
    
    setCurrentStep('Complete!');
    setIsComplete(true);
    
    // Final celebration animation
    if (dashboardRef.current) {
      const cards = dashboardRef.current.querySelectorAll('.completion-card');
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.2,
        }
      );
    }
  };

  useEffect(() => {
    if (isVisible && !isComplete) {
      // Auto-start loading sequence when visible
      setTimeout(startLoadingSequence, 500);
    }
  }, [isVisible]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Advanced Loading Animations
          </h1>
          <p className="text-white/60 mb-6">
            Interactive loading states with GSAP-powered micro-animations
          </p>
          
          {!isComplete && (
            <div className="max-w-md mx-auto mb-8">
              <ProgressBar 
                progress={progress} 
                label={currentStep}
                color="#3B82F6"
                animated={true}
              />
            </div>
          )}
          
          {isComplete && (
            <button
              onClick={startLoadingSequence}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Loader2 className="w-5 h-5" />
              Restart Animation
            </button>
          )}
        </div>

        {/* Main Content */}
        <div ref={dashboardRef} className="space-y-8">
          {/* Loading States */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Loading */}
            {loadingStates.skeleton && (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard 
                    key={index} 
                    isVisible={true} 
                    delay={index * 0.1}
                  />
                ))}
              </>
            )}
            
            {/* Spinner States */}
            {loadingStates.data && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
                <AnimatedSpinner size={60} color="#10B981" />
                <p className="text-white/80 mt-4">Processing data...</p>
              </div>
            )}
            
            {/* Progress States */}
            {loadingStates.charts && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-6">
                <h3 className="text-white font-semibold">Rendering Charts</h3>
                <ProgressBar progress={85} label="Bar Charts" color="#F59E0B" />
                <ProgressBar progress={65} label="Line Charts" color="#8B5CF6" />
                <ProgressBar progress={45} label="Pie Charts" color="#EF4444" />
              </div>
            )}
            
            {/* Data Stream States */}
            {loadingStates.metrics && (
              <DataStreamLoader />
            )}
          </div>

          {/* Completion States */}
          {isComplete && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 completion-card">
              {/* Sample Dashboard Cards */}
              {[
                { icon: DollarSign, title: 'Revenue', value: '$2.4M', color: '#10B981' },
                { icon: Users, title: 'Users', value: '12.5K', color: '#3B82F6' },
                { icon: BarChart3, title: 'Growth', value: '+23%', color: '#F59E0B' },
                { icon: TrendingUp, title: 'Conversion', value: '4.2%', color: '#8B5CF6' },
              ].map((card, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}15, transparent)`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white/70 text-sm font-medium">{card.title}</h3>
                    <div className="text-2xl font-bold text-white">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Demo Section */}
          {!isComplete && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
              <AnimatedSpinner size={80} color="#3B82F6" />
              <h3 className="text-white text-xl font-semibold mt-4 mb-2">
                Dashboard Loading in Progress
              </h3>
              <p className="text-white/60">
                Please wait while we prepare your data visualization...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdvancedLoadingDashboard;