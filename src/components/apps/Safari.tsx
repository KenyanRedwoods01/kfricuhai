'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Bookmark {
  title: string;
  url: string;
  icon: string;
}

const Safari = () => {
  const [currentUrl, setCurrentUrl] = useState('about:blank');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['about:blank']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const bookmarks: Bookmark[] = [
    { title: 'Google', url: 'https://google.com', icon: '🌐' },
    { title: 'GitHub', url: 'https://github.com', icon: '💻' },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '📚' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖' },
    { title: 'Redwoods Portfolio', url: '#', icon: '🏠' },
  ];

  const quickSites = [
    { title: 'Portfolio Overview', content: 'Welcome to the Redwoods Portfolio!\n\nThis is a demonstration of a fully functional MacOS-inspired desktop environment built with Next.js and React.\n\nFeatures:\n• 15+ Functional Applications\n• Drag & Drop Window Management\n• MacOS-style UI/UX\n• Smooth Animations\n• Responsive Design\n\nClick on any app icon to explore the functionality!' },
    { title: 'Skills Showcase', content: 'Technical Skills:\n\nFrontend Development:\n• React & Next.js\n• TypeScript\n• Tailwind CSS\n• Framer Motion\n• State Management (Zustand)\n\nBackend Development:\n• Node.js & Express\n• Database Design\n• API Development\n• Authentication\n\nTools & Technologies:\n• Git & GitHub\n• Docker & Kubernetes\n• AWS & Cloud Services\n• CI/CD Pipelines\n• Testing & Debugging' },
    { title: 'Project Gallery', content: 'Featured Projects:\n\n🚀 MacOS Portfolio\nA fully functional desktop environment showcasing modern web development practices.\n\n🧮 Calculator App\nA fully functional calculator with MacOS-style interface.\n\n⚡ Terminal Simulator\nCommand-line interface with interactive commands.\n\n📝 Notes Application\nFull-featured note-taking app with auto-save.\n\n🌐 Web Browser\nCustom browser implementation with tabs and bookmarks.\n\nEach application demonstrates different aspects of modern web development.' },
  ];

  const [activeSite, setActiveSite] = useState(0);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
        // Real URL simulation
        setHistory(prev => [...prev.slice(0, historyIndex + 1), currentUrl]);
        setHistoryIndex(prev => prev + 1);
      } else if (currentUrl === 'about:blank') {
        setHistory(prev => [...prev.slice(0, historyIndex + 1), currentUrl]);
        setHistoryIndex(prev => prev + 1);
      } else {
        // Search simulation
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(currentUrl)}`;
        setCurrentUrl(searchUrl);
        setHistory(prev => [...prev.slice(0, historyIndex + 1), searchUrl]);
        setHistoryIndex(prev => prev + 1);
      }
      setIsLoading(false);
    }, 1000);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentUrl(history[historyIndex + 1]);
    }
  };

  const navigateToUrl = (url: string) => {
    setCurrentUrl(url);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), url]);
    setHistoryIndex(prev => prev + 1);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex items-center gap-2 mb-2">
          {/* Navigation Buttons */}
          <div className="flex gap-1">
            <motion.button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              →
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ↻
            </motion.button>
          </div>

          {/* URL Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL or search..."
            />
          </form>

          {/* Reload Button */}
          <motion.button
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? '⏳' : '🔄'}
          </motion.button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex gap-2">
          {bookmarks.map((bookmark, index) => (
            <motion.button
              key={index}
              onClick={() => navigateToUrl(bookmark.url)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{bookmark.icon}</span>
              <span>{bookmark.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentUrl === 'about:blank' ? (
          <div className="max-w-2xl mx-auto">
            {/* Welcome Screen */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Safari</h1>
              <p className="text-gray-600 mb-6">Choose a site to visit or start browsing</p>
            </div>

            {/* Quick Access Sites */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {quickSites.map((site, index) => (
                <motion.div
                  key={index}
                  className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeSite === index ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSite(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{site.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{site.content.split('\n')[0]}</p>
                </motion.div>
              ))}
            </div>

            {/* Selected Site Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {quickSites[activeSite].title}
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {quickSites[activeSite].content}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isLoading ? 'Loading...' : 'Website Content'}
            </h2>
            <p className="text-gray-600">
              {isLoading 
                ? 'Please wait while we load the page...'
                : `This would show the content of ${currentUrl}`}
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 mb-2">In a real browser, this would display:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Full webpage content and functionality</li>
                <li>• Interactive elements and forms</li>
                <li>• Media content (images, videos)</li>
                <li>• JavaScript-driven features</li>
                <li>• Responsive layouts</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex justify-between">
        <span>
          {isLoading ? 'Loading...' : `Connected to ${currentUrl}`}
        </span>
        <span>
          {history.length} page{history.length !== 1 ? 's' : ''} visited
        </span>
      </div>
    </div>
  );
};

export default Safari;