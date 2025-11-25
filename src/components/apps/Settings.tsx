'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SystemSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: boolean;
  soundEnabled: boolean;
  volume: number;
  autoSave: boolean;
  autoSaveInterval: number;
  screenResolution: string;
  dockPosition: 'bottom' | 'left' | 'right';
  dockSize: 'small' | 'medium' | 'large';
  transparency: number;
  animations: boolean;
  compactMode: boolean;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({
    theme: 'light',
    language: 'en-US',
    timezone: 'America/New_York',
    notifications: true,
    soundEnabled: true,
    volume: 75,
    autoSave: true,
    autoSaveInterval: 5,
    screenResolution: '1920x1080',
    dockPosition: 'bottom',
    dockSize: 'medium',
    transparency: 80,
    animations: true,
    compactMode: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('redwoods-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('redwoods-settings', JSON.stringify(settings));
    
    // Apply theme changes
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Apply transparency
    document.documentElement.style.setProperty('--transparency', `${settings.transparency}%`);
  }, [settings]);

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      setSettings({
        theme: 'light',
        language: 'en-US',
        timezone: 'America/New_York',
        notifications: true,
        soundEnabled: true,
        volume: 75,
        autoSave: true,
        autoSaveInterval: 5,
        screenResolution: '1920x1080',
        dockPosition: 'bottom',
        dockSize: 'medium',
        transparency: 80,
        animations: true,
        compactMode: false,
      });
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'redwoods-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...imported });
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const sections = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'display', name: 'Display', icon: '🖥️' },
    { id: 'dock', name: 'Dock', icon: '🪝' },
    { id: 'sound', name: 'Sound', icon: '🔊' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'privacy', name: 'Privacy', icon: '🛡️' },
    { id: 'network', name: 'Network', icon: '🌐' },
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
              <option value="de-DE">Deutsch</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">GMT</option>
              <option value="Europe/Paris">CET</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Enable Notifications</p>
            <p className="text-sm text-gray-600">Show system notifications and alerts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto Save</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Auto Save</p>
              <p className="text-sm text-gray-600">Automatically save changes to files</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {settings.autoSave && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Save Interval (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.autoSaveInterval}
                onChange={(e) => updateSetting('autoSaveInterval', Number(e.target.value))}
                className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', name: 'Light', preview: '☀️' },
            { value: 'dark', name: 'Dark', preview: '🌙' },
            { value: 'auto', name: 'Auto', preview: '🌓' },
          ].map((theme) => (
            <motion.button
              key={theme.value}
              onClick={() => updateSetting('theme', theme.value as any)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                settings.theme === theme.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{theme.preview}</div>
              <div className="font-medium text-gray-900">{theme.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transparency: {settings.transparency}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.transparency}
              onChange={(e) => updateSetting('transparency', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Animations</p>
              <p className="text-sm text-gray-600">Smooth transitions and effects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => updateSetting('animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Compact Mode</p>
              <p className="text-sm text-gray-600">Reduce spacing and padding</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSetting('compactMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const DisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Resolution</h3>
        <select
          value={settings.screenResolution}
          onChange={(e) => updateSetting('screenResolution', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1920x1080">1920 x 1080 (Full HD)</option>
          <option value="2560x1440">2560 x 1440 (QHD)</option>
          <option value="3840x2160">3840 x 2160 (4K)</option>
          <option value="1366x768">1366 x 768 (HD)</option>
          <option value="1280x720">1280 x 720 (HD)</option>
        </select>
      </div>
    </div>
  );

  const DockSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Position</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'bottom', name: 'Bottom', icon: '⬇️' },
            { value: 'left', name: 'Left', icon: '⬅️' },
            { value: 'right', name: 'Right', icon: '➡️' },
          ].map((position) => (
            <motion.button
              key={position.value}
              onClick={() => updateSetting('dockPosition', position.value as any)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                settings.dockPosition === position.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{position.icon}</div>
              <div className="font-medium text-gray-900">{position.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'small', name: 'Small', preview: '🪝' },
            { value: 'medium', name: 'Medium', preview: '🪝' },
            { value: 'large', name: 'Large', preview: '🪝' },
          ].map((size) => (
            <motion.button
              key={size.value}
              onClick={() => updateSetting('dockSize', size.value as any)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                settings.dockSize === size.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{size.preview}</div>
              <div className="font-medium text-gray-900">{size.name}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const SoundSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Enable Sound</p>
          <p className="text-sm text-gray-600">Play system sounds and alerts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Volume: {settings.volume}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => updateSetting('volume', Number(e.target.value))}
          disabled={!settings.soundEnabled}
          className="w-full disabled:opacity-50"
        />
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Security & Privacy</h3>
        <p className="text-sm text-yellow-700">
          This is a demo portfolio. In a real application, this section would contain 
          password management, biometric settings, and security preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Change Password
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600">Add an extra layer of security</p>
          </div>
          <span className="text-sm text-gray-500">Not configured</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Screen Lock</p>
            <p className="text-sm text-gray-600">Automatically lock after inactivity</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Configure
          </button>
        </div>
      </div>
    </div>
  );

  const NetworkSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">Network Status</h3>
        <div className="space-y-2 text-sm text-green-700">
          <p>🟢 Connected to WiFi: Redwoods-Network</p>
          <p>📊 Signal Strength: Excellent (85%)</p>
          <p>🌐 IP Address: 192.168.1.100</p>
          <p>📈 Speed: 100 Mbps</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Networks</h3>
        <div className="space-y-2">
          {[
            { name: 'Redwoods-Network', signal: 95, secured: true, connected: true },
            { name: 'Guest_WiFi', signal: 78, secured: false, connected: false },
            { name: 'Office_5G', signal: 87, secured: true, connected: false },
            { name: 'Public_Library', signal: 65, secured: false, connected: false },
          ].map((network, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg ${
                network.connected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📶</span>
                  <div>
                    <p className="font-medium text-gray-900">{network.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        Signal: {network.signal}%
                      </span>
                      {network.secured && <span className="text-xs text-blue-600">🔒</span>}
                    </div>
                  </div>
                </div>
                {network.connected ? (
                  <span className="text-green-600 font-medium">Connected</span>
                ) : (
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'general': return <GeneralSettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'display': return <DisplaySettings />;
      case 'dock': return <DockSettings />;
      case 'sound': return <SoundSettings />;
      case 'security': return <SecuritySettings />;
      case 'privacy': return <PrivacySettings />;
      case 'network': return <NetworkSettings />;
      default: return <GeneralSettings />;
    }
  };

  const PrivacySettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Privacy Settings</h3>
        <p className="text-sm text-blue-700">
          Control what data is collected and shared to improve your experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Analytics</p>
            <p className="text-sm text-gray-600">Help improve the application</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Error Reports</p>
            <p className="text-sm text-gray-600">Automatically send error reports</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeSection === section.id ? 'bg-blue-50 border-r-2 border-r-blue-500 text-blue-700' : 'text-gray-700'
              }`}
              whileHover={{ x: 4 }}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <motion.button
            onClick={exportSettings}
            className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📤 Export Settings
          </motion.button>
          
          <label className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer block text-center">
            📥 Import Settings
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          
          <motion.button
            onClick={resetSettings}
            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 Reset to Defaults
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderSettingsContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;