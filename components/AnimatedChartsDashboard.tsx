"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BarChart, LineChart, PieChart, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  color: string;
  category: string;
}

interface AnimatedBarChartProps {
  data: ChartData[];
  title: string;
  animate: boolean;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, title, animate }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!animate) return;

    const bars = barsRef.current;
    if (!bars.length) return;

    // Animate bars with stagger
    gsap.fromTo(bars,
      {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'bottom',
      },
      {
        scaleY: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.2,
      }
    );

    // Animate values counting up
    const values = chartRef.current?.querySelectorAll('.chart-value');
    if (values) {
      values.forEach((value) => {
        const targetValue = parseInt((value as HTMLElement).dataset.value || '0');
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: targetValue,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            (value as HTMLElement).textContent = obj.value.toLocaleString();
          }
        });
      });
    }
  }, [data, animate]);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm font-medium">{item.name}</span>
              <span className="chart-value text-white font-bold" data-value={item.value}>
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="relative h-8 bg-white/10 rounded-lg overflow-hidden">
              <div
                ref={(el) => { if (el) barsRef.current[index] = el; }}
                className="h-full rounded-lg transition-all duration-300 hover:brightness-110"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/90 text-xs font-medium px-2 py-1 bg-black/20 rounded">
                  {item.category}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RacingBarChart: React.FC = () => {
  const [raceData, setRaceData] = useState<ChartData[]>([
    { name: 'Alpha Corp', value: 45, color: '#3B82F6', category: 'Technology' },
    { name: 'Beta Industries', value: 38, color: '#10B981', category: 'Healthcare' },
    { name: 'Gamma Solutions', value: 52, color: '#F59E0B', category: 'Finance' },
    { name: 'Delta Systems', value: 29, color: '#EF4444', category: 'Retail' },
    { name: 'Epsilon Tech', value: 41, color: '#8B5CF6', category: 'Technology' },
  ]);
  
  const [isRacing, setIsRacing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  const startRace = () => {
    setIsRacing(true);
    
    intervalRef.current = setInterval(() => {
      setRaceData(prevData => {
        const newData = prevData.map(item => ({
          ...item,
          value: Math.max(10, Math.min(100, item.value + (Math.random() - 0.5) * 20))
        }));
        
        // Sort by value for racing effect
        return newData.sort((a, b) => b.value - a.value);
      });
    }, 2000);
  };

  const stopRace = () => {
    setIsRacing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isRacing) {
      // Animate bar positions during race
      gsap.to(barsRef.current, {
        y: -5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        stagger: 0.1,
      });
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRacing]);

  const maxValue = Math.max(...raceData.map(d => d.value));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Racing Bar Chart
        </h3>
        <div className="flex gap-2">
          <button
            onClick={isRacing ? stopRace : startRace}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300"
          >
            {isRacing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRacing ? 'Pause' : 'Start Race'}
          </button>
          <button
            onClick={() => {
              stopRace();
              setRaceData([
                { name: 'Alpha Corp', value: 45, color: '#3B82F6', category: 'Technology' },
                { name: 'Beta Industries', value: 38, color: '#10B981', category: 'Healthcare' },
                { name: 'Gamma Solutions', value: 52, color: '#F59E0B', category: 'Finance' },
                { name: 'Delta Systems', value: 29, color: '#EF4444', category: 'Retail' },
                { name: 'Epsilon Tech', value: 41, color: '#8B5CF6', category: 'Technology' },
              ]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {raceData.map((item, index) => (
          <div
            key={item.name}
            className="space-y-1 transition-all duration-500"
            style={{
              order: raceData.indexOf(item),
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/90 text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-white font-bold">{item.value.toFixed(1)}</span>
            </div>
            <div className="relative h-6 bg-white/10 rounded-lg overflow-hidden">
              <div
                ref={(el) => { if (el) barsRef.current[index] = el; }}
                className="h-full rounded-lg transition-all duration-1000 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-white/90 text-xs font-medium">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-white/60 text-sm">
          {isRacing ? 'Racing in progress...' : 'Click "Start Race" to see live data competition'}
        </div>
      </div>
    </div>
  );
};

const AnimatedPieChart: React.FC = () => {
  const [pieData, setPieData] = useState([
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' },
  ]);
  
  const pathRefs = useRef<SVGPathElement[]>([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      // Animate pie chart arcs
      gsap.fromTo(pathRefs.current,
        {
          strokeDasharray: "0 100",
          strokeDashoffset: 100,
        },
        {
          strokeDasharray: "100 0",
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.out",
          stagger: 0.2,
        }
      );
    }
  }, [animate]);

  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createArcPath = (value: number, index: number) => {
    const percentage = (value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = 60 + 40 * Math.cos(startAngleRad);
    const y1 = 60 + 40 * Math.sin(startAngleRad);
    const x2 = 60 + 40 * Math.cos(endAngleRad);
    const y2 = 60 + 40 * Math.sin(endAngleRad);
    
    const pathData = [
      `M 60 60`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');
    
    cumulativePercentage += percentage;
    return pathData;
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Device Usage Distribution
        </h3>
        <button
          onClick={() => setAnimate(!animate)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300"
        >
          {animate ? 'Pause Animation' : 'Animate'}
        </button>
      </div>
      
      <div className="flex items-center justify-center">
        <svg width="120" height="120" className="drop-shadow-lg">
          {pieData.map((item, index) => (
            <path
              key={index}
              ref={(el) => { if (el) pathRefs.current[index] = el; }}
              d={createArcPath(item.value, index)}
              fill={item.color}
              className="hover:brightness-110 transition-all duration-300"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            />
          ))}
        </svg>
      </div>
      
      <div className="mt-6 space-y-2">
        {pieData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/80 text-sm">{item.name}</span>
            </div>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnimatedChartsDashboard: React.FC = () => {
  const [chartData] = useState([
    { name: 'Sales', value: 847293, color: '#3B82F6', category: 'Revenue' },
    { name: 'Marketing', value: 562847, color: '#10B981', category: 'Spend' },
    { name: 'Support', value: 234567, color: '#F59E0B', category: 'Cost' },
    { name: 'Development', value: 445678, color: '#EF4444', category: 'Investment' },
    { name: 'Operations', value: 367892, color: '#8B5CF6', category: 'Efficiency' },
  ]);

  const [animateAll, setAnimateAll] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animateAll && dashboardRef.current) {
      const cards = dashboardRef.current.querySelectorAll('.chart-card');
      gsap.fromTo(cards,
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
          stagger: 0.1,
        }
      );
    }
  }, [animateAll]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Animated Charts Dashboard
          </h1>
          <p className="text-white/60 mb-6">
            Interactive data visualizations with GSAP-powered animations
          </p>
          <button
            onClick={() => setAnimateAll(!animateAll)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            {animateAll ? 'Reset Animation' : 'Animate All Charts'}
          </button>
        </div>

        <div 
          ref={dashboardRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="chart-card">
            <AnimatedBarChart 
              data={chartData} 
              title="Revenue by Department"
              animate={animateAll}
            />
          </div>
          
          <div className="chart-card">
            <RacingBarChart />
          </div>
          
          <div className="chart-card lg:col-span-2">
            <AnimatedPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChartsDashboard;