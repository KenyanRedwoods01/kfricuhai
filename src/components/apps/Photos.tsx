'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Photo {
  id: string;
  url: string;
  filename: string;
  title: string;
  description: string;
  size: string;
  dateTaken: Date;
  dateAdded: Date;
  tags: string[];
  album: string;
  isFavorite: boolean;
  dimensions: { width: number; height: number };
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  photoCount: number;
  dateCreated: Date;
}

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  // Initialize with sample photos
  useEffect(() => {
    const sampleAlbums: Album[] = [
      {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Professional work and projects',
        coverPhoto: '💼',
        photoCount: 8,
        dateCreated: new Date('2024-01-15'),
      },
      {
        id: 'nature',
        name: 'Nature',
        description: 'Beautiful landscapes and outdoor shots',
        coverPhoto: '🌿',
        photoCount: 12,
        dateCreated: new Date('2024-02-01'),
      },
      {
        id: 'tech',
        name: 'Technology',
        description: 'Tech projects and equipment',
        coverPhoto: '💻',
        photoCount: 15,
        dateCreated: new Date('2024-02-10'),
      },
      {
        id: 'events',
        name: 'Events',
        description: 'Conferences, meetups, and gatherings',
        coverPhoto: '🎯',
        photoCount: 6,
        dateCreated: new Date('2024-03-01'),
      },
    ];

    const samplePhotos: Photo[] = [
      {
        id: '1',
        url: '/photos/macos-portfolio.jpg',
        filename: 'macos-portfolio.jpg',
        title: 'MacOS Portfolio Design',
        description: 'A beautiful MacOS-inspired portfolio design showcasing modern web development',
        size: '2.4 MB',
        dateTaken: new Date('2024-03-15'),
        dateAdded: new Date('2024-03-15'),
        tags: ['portfolio', 'design', 'macos'],
        album: 'portfolio',
        isFavorite: true,
        dimensions: { width: 1920, height: 1080 },
      },
      {
        id: '2',
        url: '/photos/terminal-app.jpg',
        filename: 'terminal-app.jpg',
        title: 'Terminal Application',
        description: 'Custom terminal emulator with modern features',
        size: '1.8 MB',
        dateTaken: new Date('2024-03-10'),
        dateAdded: new Date('2024-03-10'),
        tags: ['terminal', 'app', 'development'],
        album: 'tech',
        isFavorite: true,
        dimensions: { width: 1600, height: 900 },
      },
      {
        id: '3',
        url: '/photos/calculator-ui.jpg',
        filename: 'calculator-ui.jpg',
        title: 'Calculator Interface',
        description: 'Beautiful calculator UI with MacOS styling',
        size: '956 KB',
        dateTaken: new Date('2024-03-05'),
        dateAdded: new Date('2024-03-05'),
        tags: ['calculator', 'ui', 'design'],
        album: 'portfolio',
        isFavorite: false,
        dimensions: { width: 1400, height: 1000 },
      },
      {
        id: '4',
        url: '/photos/code-workspace.jpg',
        filename: 'code-workspace.jpg',
        title: 'Development Workspace',
        description: 'My current development setup with multiple monitors',
        size: '3.2 MB',
        dateTaken: new Date('2024-02-28'),
        dateAdded: new Date('2024-02-28'),
        tags: ['workspace', 'development', 'setup'],
        album: 'tech',
        isFavorite: true,
        dimensions: { width: 2560, height: 1440 },
      },
      {
        id: '5',
        url: '/photos/mountain-view.jpg',
        filename: 'mountain-view.jpg',
        title: 'Mountain View',
        description: 'Stunning mountain landscape during sunrise',
        size: '4.1 MB',
        dateTaken: new Date('2024-02-15'),
        dateAdded: new Date('2024-02-15'),
        tags: ['landscape', 'mountains', 'sunrise'],
        album: 'nature',
        isFavorite: true,
        dimensions: { width: 2048, height: 1365 },
      },
      {
        id: '6',
        url: '/photos/conference-talk.jpg',
        filename: 'conference-talk.jpg',
        title: 'Tech Conference',
        description: 'Giving a talk about modern web development at TechConf 2024',
        size: '2.7 MB',
        dateTaken: new Date('2024-02-10'),
        dateAdded: new Date('2024-02-10'),
        tags: ['conference', 'speaking', 'web-dev'],
        album: 'events',
        isFavorite: false,
        dimensions: { width: 1920, height: 1280 },
      },
      {
        id: '7',
        url: '/photos/forest-path.jpg',
        filename: 'forest-path.jpg',
        title: 'Forest Trail',
        description: 'Peaceful walk through an ancient forest',
        size: '3.8 MB',
        dateTaken: new Date('2024-02-05'),
        dateAdded: new Date('2024-02-05'),
        tags: ['forest', 'nature', 'trail'],
        album: 'nature',
        isFavorite: false,
        dimensions: { width: 1600, height: 1200 },
      },
      {
        id: '8',
        url: '/photos/project-showcase.jpg',
        filename: 'project-showcase.jpg',
        title: 'Project Showcase',
        description: 'Interactive demo of recent web applications',
        size: '1.9 MB',
        dateTaken: new Date('2024-01-30'),
        dateAdded: new Date('2024-01-30'),
        tags: ['project', 'demo', 'showcase'],
        album: 'portfolio',
        isFavorite: true,
        dimensions: { width: 1440, height: 900 },
      },
    ];

    setAlbums(sampleAlbums);
    setPhotos(samplePhotos);
  }, []);

  const filteredPhotos = photos
    .filter(photo => {
      if (selectedAlbum !== 'all' && photo.album !== selectedAlbum) return false;
      if (searchTerm && !photo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !photo.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.filename.localeCompare(b.filename);
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        case 'date':
        default:
          return b.dateTaken.getTime() - a.dateTaken.getTime();
      }
    });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const toggleFavorite = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo
    ));
  };

  const deleteSelectedPhotos = () => {
    if (selectedPhotos.length === 0) return;
    
    if (confirm(`Delete ${selectedPhotos.length} photo(s)?`)) {
      setPhotos(prev => prev.filter(photo => !selectedPhotos.includes(photo.id)));
      setSelectedPhotos([]);
    }
  };

  const createAlbum = () => {
    const name = prompt('Enter album name:');
    const description = prompt('Enter album description:');
    
    if (name) {
      const newAlbum: Album = {
        id: Date.now().toString(),
        name,
        description: description || 'New album',
        coverPhoto: '📸',
        photoCount: 0,
        dateCreated: new Date(),
      };
      setAlbums(prev => [...prev, newAlbum]);
    }
  };

  const PhotoGrid = () => (
    <div className={`p-4 ${
      viewMode === 'grid' 
        ? 'grid grid-cols-4 gap-4' 
        : viewMode === 'masonry'
        ? 'columns-4 gap-4'
        : 'space-y-2'
    }`}>
      <AnimatePresence>
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            className={`relative group cursor-pointer ${
              viewMode === 'list' 
                ? 'p-4 bg-white rounded-lg border border-gray-200' 
                : 'rounded-lg overflow-hidden'
            } ${
              selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => viewMode === 'list' ? togglePhotoSelection(photo.id) : handlePhotoClick(photo)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: viewMode === 'list' ? 1 : 1.02 }}
          >
            {viewMode === 'list' ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                  🖼️
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{photo.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{photo.description}</p>
                  <p className="text-xs text-gray-500">{photo.size} • {photo.dateTaken.toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(photo.id);
                    }}
                    className={`text-xl ${photo.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    {photo.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center text-6xl">
                  🖼️
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(photo.id);
                    }}
                    className={`text-xl ${photo.isFavorite ? 'text-yellow-500' : 'text-white'}`}
                  >
                    {photo.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <h4 className="font-medium text-sm">{photo.title}</h4>
                  <p className="text-xs opacity-90">{photo.size}</p>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const PhotoViewer = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => setSelectedPhoto(null)}
    >
      {selectedPhoto && (
        <div className="max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">{selectedPhoto.title}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center text-8xl">
              🖼️
            </div>
            
            {/* Details */}
            <div className="p-4">
              <p className="text-gray-700 mb-2">{selectedPhoto.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Filename: {selectedPhoto.filename}</p>
                <p>Size: {selectedPhoto.size}</p>
                <p>Dimensions: {selectedPhoto.dimensions.width} × {selectedPhoto.dimensions.height}</p>
                <p>Date: {selectedPhoto.dateTaken.toLocaleDateString()}</p>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPhoto.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={createAlbum}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Album
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Add Photos
            </motion.button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                // Handle file upload logic here
                console.log('Files selected:', e.target.files);
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Album Filter */}
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Photos ({photos.length})</option>
            <option value="favorites">Favorites ({photos.filter(p => p.isFavorite).length})</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name} ({album.photoCount})
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`px-3 py-2 ${viewMode === 'masonry' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              ≡
            </button>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedPhotos.length > 0 && (
          <motion.div
            className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-blue-700">{selectedPhotos.length} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  selectedPhotos.forEach(id => toggleFavorite(id));
                  setSelectedPhotos([]);
                }}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                ⭐ Favorite
              </button>
              <button
                onClick={deleteSelectedPhotos}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Delete
              </button>
              <button
                onClick={() => setSelectedPhotos([])}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-auto">
        {filteredPhotos.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload some photos to get started'}
              </p>
            </div>
          </div>
        ) : (
          <PhotoGrid />
        )}
      </div>

      {/* Albums Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Albums</h3>
        <div className="space-y-2">
          <motion.div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedAlbum === 'all' ? 'bg-blue-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedAlbum('all')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">📷</div>
              <div>
                <h4 className="font-medium text-gray-900">All Photos</h4>
                <p className="text-sm text-gray-600">{photos.length} photos</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedAlbum === 'favorites' ? 'bg-blue-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedAlbum('favorites')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">⭐</div>
              <div>
                <h4 className="font-medium text-gray-900">Favorites</h4>
                <p className="text-sm text-gray-600">{photos.filter(p => p.isFavorite).length} photos</p>
              </div>
            </div>
          </motion.div>

          {albums.map((album) => (
            <motion.div
              key={album.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedAlbum === album.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedAlbum(album.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{album.coverPhoto}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{album.name}</h4>
                  <p className="text-sm text-gray-600">{album.photoCount} photos</p>
                  <p className="text-xs text-gray-500">{album.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && <PhotoViewer />}
    </div>
  );
};

export default Photos;