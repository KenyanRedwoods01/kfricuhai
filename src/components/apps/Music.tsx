'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  year: number;
  cover: string;
  audioUrl: string; // Placeholder for actual audio files
  isPlaying?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  songs: string[]; // song IDs
  cover: string;
  createdAt: Date;
  description: string;
}

const Music = () => {
  const [songs] = useState<Song[]>([
    {
      id: '1',
      title: 'Autumn Dreams',
      artist: 'Redwoods Ensemble',
      album: 'Portfolio Sounds',
      duration: '3:45',
      genre: 'Ambient',
      year: 2024,
      cover: '🍂',
      audioUrl: '/songs/autumn-dreams.mp3',
    },
    {
      id: '2',
      title: 'Code Symphony',
      artist: 'Developer Beats',
      album: 'Programming Tunes',
      duration: '4:12',
      genre: 'Electronic',
      year: 2024,
      cover: '💻',
      audioUrl: '/songs/code-symphony.mp3',
    },
    {
      id: '3',
      title: 'Digital Horizons',
      artist: 'NextJS Orchestra',
      album: 'Modern Web Sounds',
      duration: '3:58',
      genre: 'Ambient',
      year: 2024,
      cover: '🌐',
      audioUrl: '/songs/digital-horizons.mp3',
    },
    {
      id: '4',
      title: 'React Rhythm',
      artist: 'Component Collective',
      album: 'Frontend Melodies',
      duration: '4:33',
      genre: 'Electronic',
      year: 2024,
      cover: '⚛️',
      audioUrl: '/songs/react-rhythm.mp3',
    },
    {
      id: '5',
      title: 'TypeScript Tango',
      artist: 'Typed Performance',
      album: 'Type-Safe Beats',
      duration: '3:27',
      genre: 'Electronic',
      year: 2024,
      cover: '📘',
      audioUrl: '/songs/typescript-tango.mp3',
    },
    {
      id: '6',
      title: 'Tailwind Harmony',
      artist: 'Utility Class',
      album: 'Design Sounds',
      duration: '4:05',
      genre: 'Ambient',
      year: 2024,
      cover: '🎨',
      audioUrl: '/songs/tailwind-harmony.mp3',
    },
  ]);

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'favorites',
      name: 'Favorites',
      songs: ['1', '3', '5'],
      cover: '⭐',
      createdAt: new Date('2024-01-15'),
      description: 'My favorite tracks',
    },
    {
      id: 'coding',
      name: 'Coding Vibes',
      songs: ['2', '4', '5'],
      cover: '💻',
      createdAt: new Date('2024-02-20'),
      description: 'Perfect for programming sessions',
    },
    {
      id: 'ambient',
      name: 'Ambient Focus',
      songs: ['1', '3', '6'],
      cover: '🌙',
      createdAt: new Date('2024-03-10'),
      description: 'Calming sounds for concentration',
    },
  ]);

  const [currentView, setCurrentView] = useState<'library' | 'playlist' | 'nowPlaying'>('library');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [searchTerm, setSearchTerm] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulated audio player functionality
  useEffect(() => {
    if (currentSong && isPlaying) {
      // Start "playing" the song
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 180) { // 3 minutes max for demo
            if (repeatMode === 'one') {
              return 0;
            } else {
              playNext();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSong, isPlaying, repeatMode]);

  useEffect(() => {
    if (currentSong) {
      setDuration(180); // 3 minutes for demo
    }
  }, [currentSong]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    let nextIndex = isShuffled 
      ? Math.floor(Math.random() * songs.length)
      : (currentIndex + 1) % songs.length;
    
    playSong(songs[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    
    playSong(songs[prevIndex]);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlaylistSongs = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return playlist.songs.map(songId => songs.find(s => s.id === songId)).filter(Boolean) as Song[];
  };

  const createPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name,
        songs: [],
        cover: '🎵',
        createdAt: new Date(),
        description: 'My new playlist',
      };
      setPlaylists(prev => [...prev, newPlaylist]);
    }
  };

  const LibraryView = () => (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {filteredSongs.map((song, index) => (
          <motion.div
            key={song.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentSong?.id === song.id && isPlaying
                ? 'bg-blue-100 border-l-4 border-l-blue-500'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => playSong(song)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                {song.cover}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{song.title}</h4>
                <p className="text-sm text-gray-600">{song.artist} • {song.album}</p>
              </div>
              <div className="text-sm text-gray-500">{song.duration}</div>
              {currentSong?.id === song.id && isPlaying && (
                <motion.div
                  className="text-blue-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎵
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const PlaylistView = () => {
    if (!selectedPlaylist) return null;
    
    const playlistSongs = getPlaylistSongs(selectedPlaylist.id);
    
    return (
      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-3xl">
            {selectedPlaylist.cover}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedPlaylist.name}</h2>
            <p className="text-gray-600">{playlistSongs.length} songs</p>
            <p className="text-sm text-gray-500">{selectedPlaylist.description}</p>
          </div>
        </div>

        <div className="space-y-1">
          {playlistSongs.map((song, index) => (
            <div
              key={song.id}
              className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => playSong(song)}
            >
              <div className="flex items-center gap-4">
                <div className="w-4 text-center text-gray-500">{index + 1}</div>
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-sm">
                  {song.cover}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{song.title}</h4>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
                <div className="text-sm text-gray-500">{song.duration}</div>
              </div>
            </div>
          ))}
          
          {playlistSongs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No songs in this playlist yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NowPlayingView = () => (
    <div className="p-6">
      {currentSong ? (
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-6xl shadow-2xl">
            {currentSong.cover}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentSong.title}</h2>
          <p className="text-lg text-gray-600 mb-1">{currentSong.artist}</p>
          <p className="text-gray-500">{currentSong.album} • {currentSong.year}</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No song playing</h3>
          <p className="text-gray-600">Select a song from your library to start playing</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Music</h1>
          <motion.button
            onClick={createPlaylist}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + New Playlist
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentView('library');
              setSelectedPlaylist(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'library' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setCurrentView('nowPlaying')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'nowPlaying' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Now Playing
          </button>
          <button
            onClick={() => setCurrentView('playlist')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'playlist' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Playlists
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentView === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LibraryView />
            </motion.div>
          )}
          
          {currentView === 'playlist' && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Playlist Selection */}
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {playlists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      className="p-4 bg-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setCurrentView('playlist');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-2xl">
                        {playlist.cover}
                      </div>
                      <h3 className="font-medium text-gray-900 text-center">{playlist.name}</h3>
                      <p className="text-sm text-gray-600 text-center">
                        {getPlaylistSongs(playlist.id).length} songs
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                {selectedPlaylist && <PlaylistView />}
              </div>
            </motion.div>
          )}
          
          {currentView === 'nowPlaying' && (
            <motion.div
              key="nowPlaying"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <NowPlayingView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Controls */}
      {currentSong && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {/* Song Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-lg">
                {currentSong.cover}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{currentSong.title}</h4>
                <p className="text-sm text-gray-600">{currentSong.artist}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1 cursor-pointer">
                  <motion.div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                    onClick={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        const clickX = e.clientX - rect.left;
                        const newTime = (clickX / rect.width) * duration;
                        seekTo(newTime);
                      }
                    }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded ${isShuffled ? 'text-blue-500' : 'text-gray-600'}`}
              >
                🔀
              </button>
              
              <motion.button
                onClick={playPrevious}
                className="p-2 text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⏮️
              </motion.button>

              <motion.button
                onClick={togglePlayPause}
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </motion.button>

              <motion.button
                onClick={playNext}
                className="p-2 text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⏭️
              </motion.button>

              <button
                onClick={() => {
                  setRepeatMode(mode => 
                    mode === 'none' ? 'one' : mode === 'one' ? 'all' : 'none'
                  );
                }}
                className={`p-2 rounded ${repeatMode !== 'none' ? 'text-blue-500' : 'text-gray-600'}`}
              >
                {repeatMode === 'one' ? '🔂' : '🔁'}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Music;