'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/lib/stores';
import WindowWrapper from './WindowWrapper';
import { AppComponents } from './apps/index';

const WindowManager = () => {
  const { windows } = useWindowStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {windows
          .filter(window => !window.isMinimized)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((window) => {
            const AppComponent = AppComponents[window.component as keyof typeof AppComponents];
            
            if (!AppComponent) {
              console.warn(`Component ${window.component} not found`);
              return null;
            }

            return (
              <WindowWrapper key={window.id} window={window}>
                <AppComponent />
              </WindowWrapper>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;