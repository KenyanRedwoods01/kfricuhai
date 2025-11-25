'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  category: string;
  uploadDate: Date;
  views: string;
  resolution: string;
  filePath: string;
}

interface Playlist {
  id: string;
  name: string;
  videos: string[];
  cover: string;
  description: string;
}

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos] = useState<Video[]>([
    {
      id: '1',
      title: 'Portfolio Demo - MacOS Inspired Interface',
      duration: '3:24',
      thumbnail: '🎬',
      description: 'A comprehensive demo of the MacOS-inspired portfolio interface showcasing all the interactive features and applications.',
      category: 'Demo',
      uploadDate: new Date('2024-03-15'),
      views: '1.2K',
      resolution: '1080p',
      filePath: '/videos/portfolio-demo.mp4',
    },
    {
      id: '2',
      title: 'Terminal Application Showcase',
      duration: '2:45',
      thumbnail: '⚡',
      description: 'Explore the fully functional terminal application with interactive commands, history, and tab completion.',
      category: 'Development',
      uploadDate: new Date('2024-03-10'),
      views: '856',
      resolution: '720p',
      filePath: '/videos/terminal-demo.mp4',
    },
    {
      id: '3',
      title: 'Calculator App - Full Functionality',
      duration: '1:58',
      thumbnail: '🧮',
      description: 'See the MacOS-style calculator in action with all mathematical operations and memory functions.',
      category: 'App Demo',
      uploadDate: new Date('2024-03-05'),
      views: '642',
      resolution: '1080p',
      filePath: '/videos/calculator-demo.mp4',
    },
    {
      id: '4',
      title: 'Music Player Interface Walkthrough',
      duration: '4:12',
      thumbnail: '🎵',
      description: 'Complete walkthrough of the music player featuring playlists, controls, and visual design.',
      category: 'Media',
      uploadDate: new Date('2024-02-28'),
      views: '1.1K',
      resolution: '1080p',
      filePath: '/videos/music-player-demo.mp4',
    },
    {
      id: '5',
      title: 'Drawing Application Tutorial',
      duration: '5:33',
      thumbnail: '🎨',
      description: 'Learn how to use all the drawing tools, colors, and export features of the paint application.',
      category: 'Tutorial',
      uploadDate: new Date('2024-02-20'),
      views: '923',
      resolution: '1080p',
      filePath: '/videos/paint-demo.mp4',
    },
    {
      id: '6',
      title: 'Weather App with Real Data',
      duration: '2:17',
      thumbnail: '🌤️',
      description: 'Demonstration of the weather application showing current conditions and 7-day forecasts.',
      category: 'Lifestyle',
      uploadDate: new Date('2024-02-15'),
      views: '567',
      resolution: '720p',
      filePath: '/videos/weather-demo.mp4',
    },
  ]);

  const [playlists] = useState<Playlist[]>([
    {
      id: 'demo-collection',
      name: 'Demo Collection',
      videos: ['1', '2', '3'],
      cover: '🎬',
      description: 'Essential portfolio demonstrations',
    },
    {
      id: 'app-showcases',
      name: 'App Showcases',
      videos: ['2', '3', '4', '5'],
      cover: '📱',
      description: 'Individual application features',
    },
    {
      id: 'tutorials',
      name: 'Tutorials',
      videos: ['5', '6'],
      cover: '📚',
      description: 'How-to guides and tutorials',
    },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [showControls, setShowControls] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  const categories = ['All', 'Demo', 'Development', 'App Demo', 'Media', 'Tutorial', 'Lifestyle'];

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['Auto', '1080p', '720p', '480p', '360p'];

  // Simulate video loading and playback
  useEffect(() => {
    if (currentVideo && videoRef.current) {
      const video = videoRef.current;
      setDuration(204); // 3:24 in seconds for demo
      
      // Auto-play simulation
      const interval = setInterval(() => {
        if (isPlaying && currentTime < duration) {
          setCurrentTime(prev => prev + 1);
        } else if (currentTime >= duration) {
          setIsPlaying(false);
          playNext();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentVideo, isPlaying, currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playPause = () => {
    if (!currentVideo) {
      // Play first video if none selected
      setCurrentVideo(videos[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentVideo) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideo(videos[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentVideo) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    setCurrentVideo(videos[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPlaylistVideos = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return playlist.videos.map(id => videos.find(v => v.id === id)).filter(Boolean) as Video[];
  };

  const VideoControls = () => (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: showControls ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div
          className="h-2 bg-white/30 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            seekTo(percentage * duration);
          }}
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-white text-sm mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={playPrevious}
            className="text-white hover:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⏮️
          </motion.button>

          <motion.button
            onClick={playPause}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>

          <motion.button
            onClick={playNext}
            className="text-white hover:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⏭️
          </motion.button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-blue-400"
            >
              {isMuted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20"
            />
          </div>

          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Playback Speed */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="bg-white/20 text-white text-sm rounded px-2 py-1"
          >
            {playbackRates.map(rate => (
              <option key={rate} value={rate} className="text-black">
                {rate}x
              </option>
            ))}
          </select>

          {/* Quality */}
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="bg-white/20 text-white text-sm rounded px-2 py-1"
          >
            {qualities.map(q => (
              <option key={q} value={q} className="text-black">
                {q}
              </option>
            ))}
          </select>

          <motion.button
            onClick={toggleFullscreen}
            className="text-white hover:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Video Player</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPlaylist ? '📺 Hide' : '📺 Show'} Playlist
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Player Area */}
        <div className={`${showPlaylist ? 'flex-1' : 'w-full'} flex flex-col`}>
          {/* Video Display */}
          <div 
            className="relative bg-black flex-1 flex items-center justify-center"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {currentVideo ? (
              <>
                {/* Video Thumbnail/Simulated Player */}
                <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">{currentVideo.thumbnail}</div>
                    <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                    <p className="text-lg opacity-90">{currentVideo.description}</p>
                    <div className="mt-4 text-sm opacity-75">
                      {currentVideo.duration} • {currentVideo.views} views • {currentVideo.resolution}
                    </div>
                  </div>

                  {/* Play Overlay */}
                  {!isPlaying && (
                    <motion.button
                      onClick={playPause}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
                      </div>
                    </motion.button>
                  )}
                </div>

                <VideoControls />
              </>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-8xl mb-4">🎬</div>
                <h3 className="text-xl font-medium mb-2">Select a Video</h3>
                <p>Choose a video from the playlist to start playing</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          {currentVideo && (
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentVideo.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{currentVideo.views} views</span>
                    <span>{currentVideo.uploadDate.toLocaleDateString()}</span>
                    <span>{currentVideo.resolution}</span>
                  </div>
                  <p className="text-gray-700">{currentVideo.description}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ❤️ Like
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📤 Share
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Video Library</h3>
                <div className="text-sm text-gray-600">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Playlists */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Playlists</h4>
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        currentPlaylist?.id === playlist.id 
                          ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPlaylist(
                        currentPlaylist?.id === playlist.id ? null : playlist
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{playlist.cover}</span>
                        <div>
                          <div className="font-medium text-gray-900">{playlist.name}</div>
                          <div className="text-xs text-gray-600">
                            {getPlaylistVideos(playlist.id).length} videos
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Video List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {(currentPlaylist ? getPlaylistVideos(currentPlaylist.id) : filteredVideos).map((video) => (
                    <motion.div
                      key={video.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        currentVideo?.id === video.id 
                          ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setCurrentVideo(video);
                        setCurrentTime(0);
                        setIsPlaying(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                          {video.thumbnail}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>{video.views} views</span>
                              <span>•</span>
                              <span>{video.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                                {video.category}
                              </span>
                              <span className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                                {video.resolution}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoPlayer;