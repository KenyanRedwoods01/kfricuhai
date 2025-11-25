'use client';

import { motion } from 'framer-motion';
import { useAppsStore, useWindowStore } from '@/lib/stores';

const Dock = () => {
  const { apps, openApp } = useAppsStore();
  const { windows } = useWindowStore();

  const handleAppClick = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    const window = windows.find(w => w.id === appId);
    
    if (window) {
      // If window exists, focus it
      useWindowStore.getState().focusWindow(appId);
    } else {
      // If no window, open the app
      openApp(appId);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <motion.div
        className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-2 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3">
          {apps.filter(app => app.isInstalled).map((app) => {
            const window = windows.find(w => w.id === app.id);
            const isActive = window && window.zIndex === Math.max(...windows.map(w => w.zIndex));
            const isOpen = window && !window.isMinimized;
            
            return (
              <motion.div
                key={app.id}
                className={`relative group cursor-pointer p-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-white/30' : 'hover:bg-white/20'
                }`}
                whileHover={{ 
                  scale: 1.1,
                  y: -10
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAppClick(app.id)}
              >
                {/* Dock Icon */}
                <div className="w-12 h-12 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/30 flex items-center justify-center text-xl group-hover:bg-white/90 transition-all duration-200">
                  <span className="text-2xl">{app.icon}</span>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                    {app.name}
                  </div>
                </div>
                
                {/* Running Indicator */}
                {isOpen && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </motion.div>
            );
          })}
          
          {/* Trash Bin */}
          <motion.div
            className="relative group cursor-pointer p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
            whileHover={{ 
              scale: 1.1,
              y: -10
            }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/30 flex items-center justify-center text-xl group-hover:bg-white/90 transition-all duration-200">
              <span className="text-2xl">🗑️</span>
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                Trash
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dock;