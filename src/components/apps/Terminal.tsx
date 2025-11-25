'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Command {
  command: string;
  output: string;
  timestamp: string;
}

const Terminal = () => {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: 'welcome',
      output: 'Welcome to Redwoods Terminal!\nType "help" to see available commands.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    let output = '';

    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        output = `Available commands:
  help      - Show this help message
  clear     - Clear the terminal
  whoami    - Display current user
  date      - Show current date and time
  pwd       - Print working directory
  ls        - List directory contents
  cat       - Display file contents
  echo      - Display text
  about     - About Redwoods Portfolio
  skills    - Show skills
  contact   - Contact information`;
        break;
        
      case 'clear':
        setCommands([]);
        setCurrentCommand('');
        return;
        
      case 'whoami':
        output = 'RedwoodsKenyan - Full Stack Developer';
        break;
        
      case 'date':
        output = new Date().toString();
        break;
        
      case 'pwd':
        output = '/Users/redwoods/portfolio';
        break;
        
      case 'ls':
        output = `Desktop/    Documents/    Downloads/    Pictures/    Music/
Projects/    Work/        Contact.md    Resume.pdf`;
        break;
        
      case 'echo hello world':
        output = 'hello world';
        break;
        
      case 'about':
        output = `Redwoods Portfolio - MacOS-inspired showcase
A fully functional desktop environment built with:
• Next.js 14 & React 18
• TypeScript & Tailwind CSS
• Framer Motion & Zustand
• Responsive design with draggable windows

Features:
✓ 15+ functional applications
✓ Drag & drop window management
✓ MacOS-inspired UI/UX
✓ Responsive design
✓ Smooth animations`;
        break;
        
      case 'skills':
        output = `Technical Skills:
Frontend:
• React, Next.js, TypeScript
• Tailwind CSS, Framer Motion
• State Management (Zustand)

Backend:
• Node.js, Express
• Database Design
• API Development

Tools:
• Git, Docker, AWS
• CI/CD Pipelines
• Testing & Debugging`;
        break;
        
      case 'contact':
        output = `Contact Information:
📧 Email: redwoods@portfolio.dev
🌐 Website: redwoods.dev
💼 LinkedIn: /in/redwoods-kenyan
🐙 GitHub: github.com/redwoods-kenyan

Let's connect and build something amazing!`;
        break;
        
      case '':
        return;
        
      default:
        output = `Command not found: ${trimmedCmd}
Type "help" for available commands.`;
    }

    const newCommand: Command = {
      command: trimmedCmd,
      output,
      timestamp,
    };

    setCommands(prev => [...prev, newCommand]);
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const commands = ['help', 'clear', 'whoami', 'date', 'pwd', 'ls', 'about', 'skills', 'contact'];
      const matches = commands.filter(cmd => cmd.startsWith(currentCommand));
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    }
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono p-4 flex flex-col">
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-black"
      >
        {commands.map((cmd, index) => (
          <motion.div
            key={index}
            className="mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2 text-green-300">
              <span className="text-yellow-400">redwoods@portfolio</span>
              <span className="text-blue-400">~</span>
              <span className="text-gray-400">{cmd.timestamp}</span>
            </div>
            <div className="text-white">
              $ <span className="text-green-400">{cmd.command}</span>
            </div>
            <pre className="text-green-300 whitespace-pre-wrap mt-1">{cmd.output}</pre>
          </motion.div>
        ))}
        
        {/* Current command line */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">redwoods@portfolio</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none border-none"
            autoFocus
          />
          {currentCommand && (
            <motion.span
              className="text-white"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              █
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;