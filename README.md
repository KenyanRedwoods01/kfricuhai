# Redwoods Portfolio - MacOS-Inspired Desktop Experience

A stunning, fully functional MacOS-inspired portfolio website showcasing modern web development with interactive applications and smooth animations.

## 🚀 Features

### 💻 Complete Desktop Environment
- **MacOS-style Interface**: Authentic MacOS design with glassmorphism effects
- **Interactive Window System**: Draggable, resizable, minimizable, and maximizable windows
- **Menu Bar**: Functional menu bar with dropdown menus and system controls
- **Dock**: Bottom dock with app launching and running indicators
- **Desktop Icons**: Double-click to open applications

### 📱 15+ Functional Applications

1. **Calculator** - Full-featured calculator with all basic operations
2. **Terminal** - Interactive terminal with commands, history, and tab completion
3. **Notes** - Note-taking app with auto-save and local storage
4. **Safari** - Web browser with bookmarks, search, and navigation
5. **Calendar** - Monthly calendar with event management
6. **Contacts** - Full contact management system with search and editing
7. **Finder** - File browser with folder navigation and file operations
8. **Maps** - Interactive map with search, directions, and location services
9. **Music** - Music player with playlists, controls, and media management
10. **Photos** - Photo gallery with albums, search, and management
11. **Settings** - System settings with real functionality and persistence
12. **Weather** - Weather app with current conditions and forecasts
13. **Paint** - Drawing application with tools, colors, and export
14. **Video Player** - Media player with playlists and controls
15. **Contacts** - Professional contact management system

### 🎨 Modern Technology Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Responsive Design** - Works on all screen sizes

### ✨ Interactive Features
- **Drag & Drop**: Move windows around the desktop
- **Window Management**: Minimize, maximize, close, and resize
- **Keyboard Shortcuts**: Full keyboard navigation
- **Auto-Save**: Notes and settings automatically saved
- **Real-time Updates**: Live time display and notifications
- **Search**: Find content across all applications
- **Data Persistence**: All data saved locally

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone or create the project
cd Redwoods

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Redwoods/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout with providers
│   │   └── page.tsx        # Main desktop page
│   ├── components/         # React components
│   │   ├── apps/           # Individual applications
│   │   │   ├── Calculator.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── Safari.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Contacts.tsx
│   │   │   ├── Finder.tsx
│   │   │   ├── Maps.tsx
│   │   │   ├── Music.tsx
│   │   │   ├── Photos.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Weather.tsx
│   │   │   ├── Paint.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── index.ts    # Component exports
│   │   ├── Desktop.tsx     # Desktop icons management
│   │   ├── Dock.tsx        # Bottom dock component
│   │   ├── MenuBar.tsx     # Top menu bar
│   │   ├── WindowManager.tsx # Window rendering system
│   │   └── WindowWrapper.tsx # Draggable window wrapper
│   ├── lib/                # Utility libraries
│   │   └── stores.tsx      # Zustand state management
│   └── styles/             # CSS styles
│       └── globals.css     # Global styles and components
├── public/                 # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Key Components

### Window Management System
- **Draggable Windows**: Move any window around the desktop
- **Resize Handles**: Resize windows from all sides and corners
- **Z-Index Management**: Proper layering and focus management
- **Minimize/Maximize**: Native window controls with animations

### State Management
- **Zustand Stores**: Lightweight state management
- **Window Store**: Manages all window states and interactions
- **Apps Store**: Handles application installation and launching
- **Persistent Storage**: Local storage for user data

### Application Architecture
- **Component-Based**: Each app is a self-contained React component
- **Shared UI Components**: Common components for consistency
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Adapts to different screen sizes

## 🎨 Design Features

### MacOS Aesthetic
- **Glassmorphism**: Blurred backgrounds with transparency
- **Smooth Animations**: Framer Motion powered transitions
- **Authentic Colors**: MacOS-inspired color palette
- **Typography**: San Francisco font family (system fonts)

### User Experience
- **Intuitive Navigation**: Natural MacOS interaction patterns
- **Visual Feedback**: Hover states and loading animations
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized for smooth 60fps animations

## 📱 Application Details

### Calculator
- Full mathematical operations
- Memory functions (M+, M-, MR, MC)
- Scientific notation support
- Keyboard input support

### Terminal
- Interactive command-line interface
- Command history with arrow key navigation
- Tab completion for commands
- Built-in help system
- Portfolio information commands

### Notes
- Rich text note editing
- Auto-save functionality
- Search across all notes
- Local storage persistence
- Note organization and management

### Safari
- Bookmark management
- Search functionality
- Navigation controls
- Tab management
- Real browser-like interface

### Music Player
- Playlist creation and management
- Media controls (play, pause, skip, volume)
- Visual now playing display
- Search and filter functionality
- Multiple view modes

### Paint
- Drawing tools (brush, pencil, eraser)
- Color picker with custom colors
- Line and shape tools
- Text insertion
- Export to PNG/JPG

## 🔧 Customization

### Adding New Applications
1. Create component in `src/components/apps/`
2. Add to `stores.tsx` in the apps store
3. Update the apps index export
4. Add appropriate icon and metadata

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `globals.css` for global styles
- Component-specific styles in individual files

### State Management
- Extend Zustand stores for new functionality
- Add persistent storage for user preferences
- Implement real-time updates where needed

## 🚀 Performance

### Optimizations
- **Code Splitting**: Automatic Next.js optimization
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Animation Performance**: GPU-accelerated transforms

### Bundle Size
- **Dependencies**: ~500KB (gzipped)
- **Code Splitting**: Separate bundles for each app
- **Tree Shaking**: Unused code elimination

## 🌟 Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile**: Responsive design with touch support

## 📄 License

This project is created for portfolio purposes. Feel free to use as reference for your own projects.

## 🙏 Acknowledgments

- **Apple** - MacOS design inspiration
- **Next.js Team** - Amazing React framework
- **Framer Motion** - Beautiful animations
- **Tailwind CSS** - Utility-first styling
- **Open Source Community** - Various libraries and tools

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

*This portfolio demonstrates advanced React development, state management, and UI/UX design principles in a real-world application.*