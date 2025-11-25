'use client';

import { motion } from 'framer-motion';
import { useWindowStore } from '@/lib/stores';
import Desktop from '@/components/Desktop';
import Dock from '@/components/Dock';
import MenuBar from '@/components/MenuBar';
import WindowManager from '@/components/WindowManager';

export default function Home() {
  const { windows } = useWindowStore();
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-pink-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Icons */}
      <Desktop />

      {/* Window Manager */}
      <WindowManager />

      {/* Dock */}
      <Dock />

      {/* Loading Screen */}
      {windows.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xl z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-xl text-gray-600 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Welcome to Redwoods Desktop
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
}