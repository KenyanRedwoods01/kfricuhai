'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: string;
}

const Paint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentTool, setCurrentTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(1);
  const [background, setBackground] = useState('#ffffff');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tools = [
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'pencil', name: 'Pencil', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'text', name: 'Text', icon: '📝' },
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#90EE90', '#FF69B4',
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Fill background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveState();
  }, []);

  // Redraw canvas when paths change
  useEffect(() => {
    redrawCanvas();
  }, [paths, background]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const previousState = history[historyIndex - 1];
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = previousState;
      
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const nextState = history[historyIndex + 1];
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = nextState;
      
      setHistoryIndex(historyIndex + 1);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPaths([]);
    saveState();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    paths.forEach(path => {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      path.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });

    // Draw current path if drawing
    if (currentPath.length > 0 && currentTool !== 'fill' && currentTool !== 'text') {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = currentTool === 'eraser' ? background : currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentPath([pos]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setCurrentPath(prev => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    
    if (currentPath.length > 0) {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        points: currentPath,
        color: currentColor,
        width: brushSize,
        tool: currentTool,
      };
      setPaths(prev => [...prev, newPath]);
      setCurrentPath([]);
      saveState();
    }
  };

  const fillBucket = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'fill') return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple flood fill simulation
    ctx.fillStyle = currentColor;
    ctx.fillRect(pos.x - 10, pos.y - 10, 20, 20);
    saveState();
  };

  const addText = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'text') return;

    const text = prompt('Enter text:');
    if (!text) return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = currentColor;
    ctx.font = `${brushSize * 5}px Arial`;
    ctx.fillText(text, pos.x, pos.y);
    saveState();
  };

  const exportCanvas = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `paint-artwork.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="h-full bg-gray-100 flex">
      {/* Toolbar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col">
        {/* Tools */}
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Tools</h3>
          <div className="grid grid-cols-1 gap-1">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id)}
                className={`p-2 rounded-lg text-xl ${
                  currentTool === tool.id 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                title={tool.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {tool.icon}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="p-2 border-b border-gray-200 flex-1">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Colors</h3>
          <div className="grid grid-cols-2 gap-1">
            {colors.map((color) => (
              <motion.button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          <motion.button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="mt-2 w-full px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            More Colors
          </motion.button>
        </div>

        {/* Actions */}
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Actions</h3>
          <div className="space-y-1">
            <motion.button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="w-full px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↶ Undo
            </motion.button>
            <motion.button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="w-full px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↷ Redo
            </motion.button>
            <motion.button
              onClick={clearCanvas}
              className="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Clear
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Paint</h2>

        {/* Brush Size */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Background */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['#ffffff', '#000000', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'].map((bg) => (
              <button
                key={bg}
                onClick={() => setBackground(bg)}
                className={`w-8 h-8 rounded border-2 ${
                  background === bg ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: bg }}
              />
            ))}
          </div>
        </div>

        {/* Export */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export
          </label>
          <div className="space-y-2">
            <motion.button
              onClick={() => exportCanvas('png')}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📁 Save as PNG
            </motion.button>
            <motion.button
              onClick={() => exportCanvas('jpg')}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📁 Save as JPG
            </motion.button>
          </div>
        </div>

        {/* Current Tool Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">Current Tool</h3>
          <p className="text-sm text-gray-600">{tools.find(t => t.id === currentTool)?.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {currentTool === 'brush' && 'Free-hand drawing with adjustable brush size'}
            {currentTool === 'pencil' && 'Light sketch lines'}
            {currentTool === 'eraser' && 'Remove parts of your drawing'}
            {currentTool === 'fill' && 'Fill areas with color (click to use)'}
            {currentTool === 'line' && 'Draw straight lines'}
            {currentTool === 'rectangle' && 'Draw rectangles'}
            {currentTool === 'circle' && 'Draw circles'}
            {currentTool === 'text' && 'Add text (click to use)'}
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="inline-block bg-gray-200 p-4 rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded cursor-crosshair bg-white"
            onMouseDown={currentTool === 'text' ? addText : currentTool === 'fill' ? fillBucket : startDrawing}
            onMouseMove={currentTool === 'fill' || currentTool === 'text' ? undefined : draw}
            onMouseUp={currentTool === 'fill' || currentTool === 'text' ? undefined : stopDrawing}
            onMouseLeave={currentTool === 'fill' || currentTool === 'text' ? undefined : stopDrawing}
            style={{
              cursor: 
                currentTool === 'fill' ? 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M6 2h12a2 2 0 0 1 2 2v16l-4-4h-6l-4 4V2z%22/%3E%3C/svg%3E") 10 10, crosshair' :
                currentTool === 'text' ? 'text' :
                'crosshair'
            }}
          />
        </div>

        {/* Canvas Info */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Canvas Size: 800 × 600 pixels</p>
          <p>Layers: {paths.length} drawing path{paths.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowColorPicker(false)}
        >
          <motion.div
            className="bg-white p-6 rounded-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Color</h3>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowColorPicker(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowColorPicker(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Paint;