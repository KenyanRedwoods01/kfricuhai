'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useWindowStore, type WindowState } from '@/lib/stores';

interface WindowWrapperProps {
  window: WindowState;
  children: React.ReactNode;
}

const WindowWrapper = ({ window, children }: WindowWrapperProps) => {
  const {
    updateWindowPosition,
    updateWindowSize,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    setDragging,
    setResizeHandle,
  } = useWindowStore();

  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    focusWindow(window.id);
    setDragStart({ x: e.clientX - window.x, y: e.clientY - window.y });
    setDragging(window.id, true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragStart && !window.isMaximized) {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      updateWindowPosition(window.id, newX, newY);
    }

    if (resizeStart && !window.isMaximized) {
      const newWidth = Math.max(400, e.clientX - resizeStart.x);
      const newHeight = Math.max(300, e.clientY - resizeStart.y);
      updateWindowSize(window.id, newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setResizeStart(null);
    setDragging(window.id, false);
    setResizeHandle(window.id, null);
  };

  useEffect(() => {
    if (dragStart || resizeStart) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart, resizeStart]);

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.width,
      height: window.height,
    });
    setResizeHandle(window.id, handle);
    focusWindow(window.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.isMaximized) {
      // Store current position and size before maximizing
      const currentPos = { x: window.x, y: window.y };
      const currentSize = { width: window.width, height: window.height };
      
      maximizeWindow(window.id);
      
      // Store position in dataset for restoring
      if (windowRef.current) {
        windowRef.current.dataset.currentX = currentPos.x.toString();
        windowRef.current.dataset.currentY = currentPos.y.toString();
        windowRef.current.dataset.currentWidth = currentSize.width.toString();
        windowRef.current.dataset.currentHeight = currentSize.height.toString();
      }
    } else {
      // Restore from maximize
      if (windowRef.current) {
        const currentX = parseInt(windowRef.current.dataset.currentX || '100');
        const currentY = parseInt(windowRef.current.dataset.currentY || '100');
        const currentWidth = parseInt(windowRef.current.dataset.currentWidth || '800');
        const currentHeight = parseInt(windowRef.current.dataset.currentHeight || '600');
        
        maximizeWindow(window.id);
        updateWindowPosition(window.id, currentX, currentY);
        updateWindowSize(window.id, currentWidth, currentHeight);
      }
    }
  };

  const position = window.isMaximized ? { x: 0, y: 0 } : { x: window.x, y: window.y };
  const size = window.isMaximized ? { width: '100vw', height: '100vh' } : { width: window.width, height: window.height };

  return (
    <motion.div
      ref={windowRef}
      className={`absolute pointer-events-auto ${
        window.isMaximized ? 'top-0 left-0 rounded-none' : 'rounded-lg'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        height: typeof size.height === 'number' ? `${size.height}px` : size.height,
        zIndex: window.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: 0.3 }
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={!window.isMaximized ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="macos-window h-full flex flex-col overflow-hidden">
        {/* Title Bar */}
        <div 
          className="macos-titlebar flex items-center justify-between px-4 py-2 cursor-move select-none"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <div className="flex items-center gap-3">
            {/* Window Controls */}
            <div className="flex gap-2">
              <motion.button
                className="macos-button macos-close"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(window.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.button
                className="macos-button macos-minimize"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(window.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.button
                className="macos-button macos-maximize"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(e);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
            
            <div className="text-sm font-medium text-gray-700">
              {window.title}
            </div>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Resize Handles */}
        {!window.isMaximized && (
          <>
            {/* Bottom right corner */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            >
              <div className="w-full h-full bg-gradient-to-tl from-gray-400/20 to-transparent"></div>
            </div>
            
            {/* Right edge */}
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-e-resize hover:bg-gray-400/20"
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
            />
            
            {/* Bottom edge */}
            <div
              className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize hover:bg-gray-400/20"
              onMouseDown={(e) => handleResizeMouseDown(e, 's')}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WindowWrapper;