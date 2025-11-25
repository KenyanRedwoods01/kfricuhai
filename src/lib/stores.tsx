import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface WindowState {
  id: string;
  title: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isResizable: boolean;
  isDragging: boolean;
  resizeHandle: string | null;
}

export interface AppState {
  id: string;
  name: string;
  icon: string;
  component: string;
  color: string;
  isInstalled: boolean;
}

interface WindowStore {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  addWindow: (appId: string, appName: string) => void;
  removeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number) => void;
  updateWindowSize: (windowId: string, width: number, height: number) => void;
  setDragging: (windowId: string, isDragging: boolean) => void;
  setResizeHandle: (windowId: string, handle: string | null) => void;
}

interface AppsStore {
  apps: AppState[];
  activeAppId: string | null;
  installApp: (app: AppState) => void;
  uninstallApp: (appId: string) => void;
  openApp: (appId: string) => void;
  closeApp: (appId: string) => void;
}

export const useWindowStore = create<WindowStore>()(
  devtools(
    (set, get) => ({
      windows: [],
      activeWindowId: null,
      nextZIndex: 100,
      
      addWindow: (appId, appName) => {
        const { windows, nextZIndex } = get();
        const existingWindow = windows.find(w => w.id === appId);
        
        if (existingWindow) {
          get().focusWindow(appId);
          return;
        }
        
        const newWindow: WindowState = {
          id: appId,
          title: appName,
          component: appId,
          x: 100 + windows.length * 30,
          y: 100 + windows.length * 30,
          width: 800,
          height: 600,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex,
          isResizable: true,
          isDragging: false,
          resizeHandle: null,
        };
        
        set({
          windows: [...windows, newWindow],
          activeWindowId: appId,
          nextZIndex: nextZIndex + 1,
        });
      },
      
      removeWindow: (windowId) => {
        const { windows } = get();
        const updatedWindows = windows.filter(w => w.id !== windowId);
        const newActiveId = get().activeWindowId === windowId ? null : get().activeWindowId;
        
        set({
          windows: updatedWindows,
          activeWindowId: newActiveId,
        });
      },
      
      minimizeWindow: (windowId) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, isMinimized: true } : w
          ),
          activeWindowId: null,
        });
      },
      
      maximizeWindow: (windowId) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
          ),
        });
      },
      
      focusWindow: (windowId) => {
        const { windows, nextZIndex } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
          ),
          activeWindowId: windowId,
          nextZIndex: nextZIndex + 1,
        });
      },
      
      updateWindowPosition: (windowId, x, y) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, x, y } : w
          ),
        });
      },
      
      updateWindowSize: (windowId, width, height) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, width, height } : w
          ),
        });
      },
      
      setDragging: (windowId, isDragging) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, isDragging } : w
          ),
        });
      },
      
      setResizeHandle: (windowId, handle) => {
        const { windows } = get();
        set({
          windows: windows.map(w =>
            w.id === windowId ? { ...w, resizeHandle: handle } : w
          ),
        });
      },
    }),
    { name: 'window-store' }
  )
);

export const useAppsStore = create<AppsStore>()(
  devtools(
    (set, get) => ({
      apps: [
        {
          id: 'finder',
          name: 'Finder',
          icon: '📁',
          component: 'Finder',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'safari',
          name: 'Safari',
          icon: '🌐',
          component: 'Safari',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'calculator',
          name: 'Calculator',
          icon: '🧮',
          component: 'Calculator',
          color: 'gray',
          isInstalled: true,
        },
        {
          id: 'terminal',
          name: 'Terminal',
          icon: '⚡',
          component: 'Terminal',
          color: 'black',
          isInstalled: true,
        },
        {
          id: 'photos',
          name: 'Photos',
          icon: '📸',
          component: 'Photos',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'music',
          name: 'Music',
          icon: '🎵',
          component: 'Music',
          color: 'red',
          isInstalled: true,
        },
        {
          id: 'notes',
          name: 'Notes',
          icon: '📝',
          component: 'Notes',
          color: 'yellow',
          isInstalled: true,
        },
        {
          id: 'calendar',
          name: 'Calendar',
          icon: '📅',
          component: 'Calendar',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'maps',
          name: 'Maps',
          icon: '🗺️',
          component: 'Maps',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'contacts',
          name: 'Contacts',
          icon: '👥',
          component: 'Contacts',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'settings',
          name: 'Settings',
          icon: '⚙️',
          component: 'Settings',
          color: 'gray',
          isInstalled: true,
        },
        {
          id: 'weather',
          name: 'Weather',
          icon: '🌤️',
          component: 'Weather',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'paint',
          name: 'Paint',
          icon: '🎨',
          component: 'Paint',
          color: 'blue',
          isInstalled: true,
        },
        {
          id: 'videoplayer',
          name: 'Video Player',
          icon: '🎬',
          component: 'VideoPlayer',
          color: 'blue',
          isInstalled: true,
        },
      ],
      activeAppId: null,
      
      installApp: (app) => {
        const { apps } = get();
        set({
          apps: [...apps, { ...app, isInstalled: true }],
        });
      },
      
      uninstallApp: (appId) => {
        const { apps } = get();
        set({
          apps: apps.map(app =>
            app.id === appId ? { ...app, isInstalled: false } : app
          ),
        });
      },
      
      openApp: (appId) => {
        const app = get().apps.find(a => a.id === appId);
        if (app) {
          useWindowStore.getState().addWindow(appId, app.name);
          set({ activeAppId: appId });
        }
      },
      
      closeApp: (appId) => {
        useWindowStore.getState().removeWindow(appId);
        set({ activeAppId: null });
      },
    }),
    { name: 'apps-store' }
  )
);

export interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <>{children}</>;
};