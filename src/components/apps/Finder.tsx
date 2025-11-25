'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  dateModified: Date;
  path: string;
  icon: string;
  content?: string;
}

const Finder = () => {
  const [currentPath, setCurrentPath] = useState('/Desktop');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize file system
  useEffect(() => {
    const initialFiles: FileItem[] = [
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        dateModified: new Date('2024-01-15'),
        path: '/Documents',
        icon: '📁',
      },
      {
        id: '2',
        name: 'Downloads',
        type: 'folder',
        dateModified: new Date('2024-02-10'),
        path: '/Downloads',
        icon: '📥',
      },
      {
        id: '3',
        name: 'Pictures',
        type: 'folder',
        dateModified: new Date('2024-03-05'),
        path: '/Pictures',
        icon: '🖼️',
      },
      {
        id: '4',
        name: 'Music',
        type: 'folder',
        dateModified: new Date('2024-02-20'),
        path: '/Music',
        icon: '🎵',
      },
      {
        id: '5',
        name: 'Portfolio.pdf',
        type: 'file',
        size: '2.3 MB',
        dateModified: new Date('2024-03-15'),
        path: '/Desktop/Portfolio.pdf',
        icon: '📄',
        content: 'This is my professional portfolio showcasing my skills and projects.',
      },
      {
        id: '6',
        name: 'Resume.docx',
        type: 'file',
        size: '156 KB',
        dateModified: new Date('2024-03-10'),
        path: '/Desktop/Resume.docx',
        icon: '📝',
        content: 'My updated resume with latest experience and skills.',
      },
      {
        id: '7',
        name: 'Project Photos',
        type: 'folder',
        dateModified: new Date('2024-03-20'),
        path: '/Desktop/Project Photos',
        icon: '📸',
      },
    ];
    setFiles(initialFiles);
  }, []);

  const getCurrentPathFiles = () => {
    if (currentPath === '/') {
      return files.filter(f => f.path.startsWith('/') && !f.path.includes('/'));
    }
    
    return files.filter(f => {
      if (f.path === currentPath) return false;
      if (currentPath === '/Desktop') {
        return f.path.startsWith('/Desktop') && f.path.split('/').length === 2;
      }
      return f.path.startsWith(currentPath + '/') && f.path.split('/').length === currentPath.split('/').length + 1;
    });
  };

  const navigateToPath = (path: string) => {
    if (path === '..') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      setCurrentPath('/' + pathParts.join('/'));
    } else {
      setCurrentPath(path);
    }
  };

  const filteredFiles = getCurrentPathFiles().filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToPath(file.path);
    } else {
      // Handle file opening
      alert(`Opening ${file.name}\n\nContent: ${file.content}`);
    }
  };

  const handleFileSelect = (fileId: string, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      setSelectedFiles(prev => 
        prev.includes(fileId) 
          ? prev.filter(id => id !== fileId)
          : [...prev, fileId]
      );
    } else {
      setSelectedFiles([fileId]);
    }
  };

  const createNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: folderName,
        type: 'folder',
        dateModified: new Date(),
        path: currentPath === '/Desktop' ? `/Desktop/${folderName}` : `${currentPath}/${folderName}`,
        icon: '📁',
      };
      setFiles(prev => [...prev, newFolder]);
    }
  };

  const deleteSelected = () => {
    if (selectedFiles.length > 0) {
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
    }
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Computer', path: '/' }];
    
    let current = '';
    parts.forEach(part => {
      current += '/' + part;
      breadcrumbs.push({ name: part, path: current });
    });
    
    return breadcrumbs;
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigateToPath('..')}
              disabled={currentPath === '/'}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
            <motion.button
              onClick={createNewFolder}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + New Folder
            </motion.button>
            <motion.button
              onClick={deleteSelected}
              disabled={selectedFiles.length === 0}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Delete
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <div className="flex border border-gray-300 rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                ⬛
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => navigateToPath(crumb.path)}
                className={`hover:underline ${index === getBreadcrumbs().length - 1 ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
              >
                {crumb.name}
              </button>
              {index < getBreadcrumbs().length - 1 && <span className="text-gray-400">/</span>}
            </div>
          ))}
        </div>
      </div>

      {/* File Grid/List */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`p-3 cursor-pointer rounded-lg border-2 transition-all ${
                  selectedFiles.includes(file.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:border-gray-300 hover:bg-white'
                }`}
                onClick={(e) => {
                  handleFileSelect(file.id, e.ctrlKey || e.metaKey);
                  handleFileClick(file);
                }}
                onDoubleClick={() => handleFileClick(file)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{file.icon}</div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                  {file.size && (
                    <div className="text-xs text-gray-500 mt-1">{file.size}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {file.dateModified.toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
              <div>Name</div>
              <div>Size</div>
              <div>Kind</div>
              <div>Date Modified</div>
            </div>
            
            {/* Files */}
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`grid grid-cols-4 gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedFiles.includes(file.id)
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  handleFileSelect(file.id, e.ctrlKey || e.metaKey);
                  handleFileClick(file);
                }}
                onDoubleClick={() => handleFileClick(file)}
                whileHover={{ backgroundColor: selectedFiles.includes(file.id) ? '#dbeafe' : '#f9fafb' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{file.icon}</span>
                  <span className="font-medium text-gray-900">{file.name}</span>
                </div>
                <div className="text-gray-600">{file.size || '—'}</div>
                <div className="text-gray-600">{file.type}</div>
                <div className="text-gray-600">{file.dateModified.toLocaleDateString()}</div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">This folder is empty</h3>
              <p className="text-gray-600">Create a new folder or add some files.</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex justify-between">
        <span>
          {filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''}
        </span>
        {selectedFiles.length > 0 && (
          <span>{selectedFiles.length} selected</span>
        )}
      </div>
    </div>
  );
};

export default Finder;