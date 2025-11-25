'use client';

import { motion } from 'framer-motion';
import { useAppsStore } from '@/lib/stores';

const Desktop = () => {
  const { apps, openApp } = useAppsStore();

  const handleDoubleClick = (appId: string) => {
    openApp(appId);
  };

  return (
    <div className="absolute top-16 left-6 right-6 bottom-20 z-10">
      <div className="grid grid-cols-6 gap-6 h-full place-content-start">
        {apps.filter(app => app.isInstalled).map((app, index) => (
          <motion.div
            key={app.id}
            className="flex flex-col items-center cursor-pointer group"
            onDoubleClick={() => handleDoubleClick(app.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 flex items-center justify-center text-2xl mb-2 group-hover:bg-white/90 transition-all duration-200">
              <span className="text-3xl">{app.icon}</span>
            </div>
            <p className="text-xs text-gray-700 font-medium text-center leading-tight group-hover:text-black transition-colors duration-200">
              {app.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Desktop;