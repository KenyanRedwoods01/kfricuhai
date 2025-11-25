'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppsStore, useWindowStore } from '@/lib/stores';

const MenuBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { apps } = useAppsStore();
  const { windows } = useWindowStore();

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeAllWindows = () => {
    windows.forEach(window => {
      useWindowStore.getState().removeWindow(window.id);
    });
    setActiveMenu(null);
  };

  const toggleTheme = () => {
    // Simple theme toggle - could be enhanced
    document.body.style.filter = 
      document.body.style.filter === 'invert(1) hue-rotate(180deg)' ? 
      '' : 'invert(1) hue-rotate(180deg)';
    setActiveMenu(null);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40">
      {/* Menu Bar Background */}
      <div className="bg-white/20 backdrop-blur-xl border-b border-white/30 h-16 flex items-center justify-between px-6 shadow-lg">
        
        {/* Left Section - Apple Menu */}
        <div className="flex items-center gap-4">
          <motion.button
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-lg">🍎</span>
          </motion.button>
          
          {/* Menu Items */}
          {[
            { name: 'Finder', id: 'finder' },
            { name: 'File', id: 'file' },
            { name: 'Edit', id: 'edit' },
            { name: 'View', id: 'view' },
            { name: 'Go', id: 'go' },
            { name: 'Window', id: 'window' },
            { name: 'Help', id: 'help' },
          ].map((menuItem) => (
            <motion.button
              key={menuItem.id}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-white/20 rounded-lg transition-all duration-200"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuClick(menuItem.id)}
            >
              {menuItem.name}
            </motion.button>
          ))}
        </div>

        {/* Center Section - Current App */}
        <div className="flex items-center gap-2">
          {windows.length > 0 && (
            <span className="text-sm text-gray-600">
              {windows.find(w => w.zIndex === Math.max(...windows.map(window => window.zIndex)))?.title || 'Desktop'}
            </span>
          )}
        </div>

        {/* Right Section - System Controls */}
        <div className="flex items-center gap-4">
          {/* WiFi */}
          <motion.div
            className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            📶
          </motion.div>
          
          {/* Battery */}
          <motion.div
            className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            🔋
          </motion.div>
          
          {/* Search */}
          <motion.div
            className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            🔍
          </motion.div>
          
          {/* Time */}
          <div className="text-sm text-gray-600 font-medium">
            {new Date().toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>

      {/* Dropdown Menus */}
      {activeMenu && (
        <motion.div
          className="absolute top-16 left-6 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-2xl py-2 min-w-[200px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeMenu === 'finder' && (
            <>
              <button className="macos-menu-item">About Finder</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="macos-menu-item">Empty Trash</button>
              <button className="macos-menu-item">Hide Finder</button>
            </>
          )}
          
          {activeMenu === 'file' && (
            <>
              <button className="macos-menu-item">New Folder</button>
              <button className="macos-menu-item">New Smart Folder</button>
              <button className="macos-menu-item">Open</button>
              <button className="macos-menu-item">Close</button>
            </>
          )}
          
          {activeMenu === 'edit' && (
            <>
              <button className="macos-menu-item">Undo</button>
              <button className="macos-menu-item">Redo</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="macos-menu-item">Cut</button>
              <button className="macos-menu-item">Copy</button>
              <button className="macos-menu-item">Paste</button>
            </>
          )}
          
          {activeMenu === 'view' && (
            <>
              <button className="macos-menu-item">Show Toolbar</button>
              <button className="macos-menu-item">Hide Sidebar</button>
              <button className="macos-menu-item">Hide Preview</button>
              <button className="macos-menu-item">Enter Full Screen</button>
            </>
          )}
          
          {activeMenu === 'go' && (
            <>
              <button className="macos-menu-item">Back</button>
              <button className="macos-menu-item">Forward</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="macos-menu-item">Computer</button>
              <button className="macos-menu-item">Home</button>
              <button className="macos-menu-item">Desktop</button>
              <button className="macos-menu-item">Documents</button>
            </>
          )}
          
          {activeMenu === 'window' && (
            <>
              {windows.length === 0 ? (
                <span className="macos-menu-item opacity-50">No windows open</span>
              ) : (
                windows.map((window) => (
                  <button
                    key={window.id}
                    className={`macos-menu-item ${window.zIndex === Math.max(...windows.map(w => w.zIndex)) ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => useWindowStore.getState().focusWindow(window.id)}
                  >
                    {window.title}
                  </button>
                ))
              )}
              <div className="border-t border-gray-200 my-1"></div>
              <button className="macos-menu-item" onClick={closeAllWindows}>
                Close All
              </button>
            </>
          )}
          
          {activeMenu === 'help' && (
            <>
              <button className="macos-menu-item">Redwoods Help</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="macos-menu-item">Keyboard Shortcuts</button>
              <button className="macos-menu-item">About</button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MenuBar;