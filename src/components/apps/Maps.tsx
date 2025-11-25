'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'user' | 'search' | 'bookmark' | 'recent';
  id: string;
}

const Maps = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number}>({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [mapView, setMapView] = useState<'map' | 'satellite'>('map');
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [bookmarks, setBookmarks] = useState<Location[]>([]);
  const [directions, setDirections] = useState<{from: string, to: string, steps: string[]} | null>(null);
  const [isGettingDirections, setIsGettingDirections] = useState(false);

  // Initialize with default location
  useEffect(() => {
    // Simulate getting user location
    const defaultLocation: Location = {
      id: 'user-location',
      name: 'Current Location',
      address: 'New York, NY, USA',
      lat: 40.7128,
      lng: -74.0060,
      type: 'user'
    };
    setUserLocation(defaultLocation);
    setCurrentLocation({ lat: defaultLocation.lat, lng: defaultLocation.lng });
  }, []);

  // Predefined locations for demonstration
  const popularLocations = [
    { name: 'Times Square', address: 'Times Square, New York, NY', lat: 40.7580, lng: -73.9855 },
    { name: 'Central Park', address: 'Central Park, New York, NY', lat: 40.7829, lng: -73.9654 },
    { name: 'Brooklyn Bridge', address: 'Brooklyn Bridge, New York, NY', lat: 40.7061, lng: -73.9969 },
    { name: 'Empire State Building', address: '350 5th Ave, New York, NY', lat: 40.7484, lng: -73.9857 },
    { name: 'Statue of Liberty', address: 'Liberty Island, New York, NY', lat: 40.6892, lng: -74.0445 },
  ];

  const popularSearches = [
    'Restaurants near me',
    'Gas stations',
    'Hospitals',
    'Hotels',
    'Shopping malls',
    'Coffee shops',
    'Supermarkets',
    'ATMs'
  ];

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Simulate search results
    const results: Location[] = popularLocations
      .filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase())
      )
      .map((loc, index) => ({
        ...loc,
        id: `search-${index}`,
        type: 'search' as const
      }));

    setSearchResults(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocations(searchQuery);
    
    // Add to recent searches
    if (searchQuery.trim()) {
      const newSearch: Location = {
        id: `recent-${Date.now()}`,
        name: searchQuery,
        address: searchQuery,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        type: 'recent'
      };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
    }
  };

  const selectLocation = (location: Location) => {
    setCurrentLocation({ lat: location.lat, lng: location.lng });
    setSearchResults([]);
    setSearchQuery(location.address);
  };

  const getDirections = (toLocation: Location) => {
    if (!userLocation) return;

    setIsGettingDirections(true);
    setDirections({
      from: userLocation.address,
      to: toLocation.address,
      steps: [
        `Head ${Math.abs(currentLocation.lat - toLocation.lat) > 0.01 ? 'north' : 'east'} on ${Math.abs(currentLocation.lat - toLocation.lat) > 0.01 ? 'Broadway' : '5th Avenue'}`,
        `Continue for ${Math.floor(Math.random() * 10 + 1)} blocks`,
        `Turn ${Math.random() > 0.5 ? 'left' : 'right'} onto ${toLocation.name} Street`,
        `Destination will be on your ${Math.random() > 0.5 ? 'left' : 'right'}`
      ]
    });

    setTimeout(() => setIsGettingDirections(false), 1000);
  };

  const addBookmark = (location: Location) => {
    const bookmark: Location = {
      ...location,
      id: `bookmark-${Date.now()}`,
      type: 'bookmark'
    };
    setBookmarks(prev => [...prev, bookmark]);
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  return (
    <div className="h-full bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Maps</h2>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for places..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    searchLocations(e.target.value);
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🔍
              </motion.button>
            </div>
          </form>

          {/* Map View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setMapView('map')}
              className={`flex-1 px-3 py-2 text-sm ${mapView === 'map' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Map
            </button>
            <button
              onClick={() => setMapView('satellite')}
              className={`flex-1 px-3 py-2 text-sm ${mapView === 'satellite' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <motion.div
                    key={result.id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => selectLocation(result)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{result.name}</h4>
                        <p className="text-sm text-gray-600">{result.address}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(result);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Get Directions"
                        >
                          🧭
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addBookmark(result);
                          }}
                          className="text-gray-500 hover:text-yellow-500"
                          title="Add Bookmark"
                        >
                          ⭐
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent</h3>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="p-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      setSearchQuery(search.name);
                      searchLocations(search.name);
                    }}
                  >
                    🕒 {search.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Bookmarks</h3>
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1"
                        onClick={() => selectLocation(bookmark)}
                      >
                        <div className="font-medium text-gray-900">{bookmark.name}</div>
                        <div className="text-sm text-gray-600">{bookmark.address}</div>
                      </div>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-3 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Popular</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <motion.button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    searchLocations(search);
                  }}
                  className="px-3 py-1 text-xs bg-gray-200 rounded-full hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {search}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Directions */}
          {directions && (
            <div className="p-3 border-t border-gray-200 bg-blue-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">🧭 Directions</h3>
              <div className="text-xs text-gray-600 mb-2">
                From: {directions.from}
                <br />
                To: {directions.to}
              </div>
              <div className="space-y-1">
                {directions.steps.map((step, index) => (
                  <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="font-medium text-blue-600">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <motion.button
                onClick={() => setDirections(null)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                whileHover={{ scale: 1.02 }}
              >
                Clear directions
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Map Display */}
      <div className="flex-1 flex flex-col">
        {/* Map Container */}
        <div className="flex-1 relative bg-gray-200 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-green-300">
            {/* Simulated Map Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Location Markers */}
            {userLocation && (
              <motion.div
                className="absolute"
                style={{
                  left: `${50}%`,
                  top: `${50}%`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-sm">
                  📍
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap mt-1">
                  {userLocation.name}
                </div>
              </motion.div>
            )}

            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                className="absolute"
                style={{
                  left: `${30 + index * 15}%`,
                  top: `${40 + index * 10}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
                  📍
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap mt-1">
                  {result.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <motion.button
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-xl hover:bg-gray-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {/* Zoom in logic */}}
            >
              +
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-xl hover:bg-gray-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {/* Zoom out logic */}}
            >
              −
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-sm hover:bg-gray-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {/* Center on user location */}}
            >
              🎯
            </motion.button>
          </div>

          {/* Loading indicator for directions */}
          {isGettingDirections && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <motion.div
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Calculating directions...</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentLocation ? 'Selected Location' : 'Maps'}
              </h3>
              <p className="text-sm text-gray-600">
                {userLocation ? userLocation.address : 'Click on search results to navigate'}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!searchResults.length}
                onClick={() => {
                  if (searchResults[0]) {
                    getDirections(searchResults[0]);
                  }
                }}
              >
                Get Directions
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setDirections(null);
                }}
              >
                Clear
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;