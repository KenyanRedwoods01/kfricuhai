'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('redwoods-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    } else {
      // Create a welcome note if no notes exist
      const welcomeNote: Note = {
        id: 'welcome',
        title: 'Welcome to Notes',
        content: `Welcome to the Notes app!

This is a fully functional notes application with the following features:

• Create, edit, and delete notes
• Auto-save functionality
• Local storage persistence
• Responsive design
• Multiple notes support

Get started by clicking "New Note" and begin writing your thoughts!

---
Redwoods Portfolio - Built with Next.js & React`,
        createdAt: new Date(),
        updatedAt: new Date(),
        color: 'yellow',
      };
      setNotes([welcomeNote]);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('redwoods-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: 'blue',
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote.id);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const saveNote = () => {
    if (selectedNote && isEditing) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNote 
          ? { 
              ...note, 
              title: editTitle || 'Untitled',
              content: editContent,
              updatedAt: new Date()
            }
          : note
      ));
      setIsEditing(false);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const selectNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsEditing(false);
    }
  };

  const selectedNoteData = notes.find(note => note.id === selectedNote);

  return (
    <div className="h-full bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
            <motion.button
              onClick={createNewNote}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + New Note
            </motion.button>
          </div>
          <p className="text-sm text-gray-600">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedNote === note.id 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => selectNote(note.id)}
              whileHover={{ backgroundColor: selectedNote === note.id ? '#dbeafe' : '#f9fafb' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {note.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  🗑️
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNoteData ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xl font-semibold bg-transparent border-none outline-none flex-1"
                    placeholder="Note title..."
                    autoFocus
                  />
                ) : (
                  <h1 className="text-xl font-semibold text-gray-900">
                    {selectedNoteData.title}
                  </h1>
                )}
                <div className="flex gap-2">
                  {isEditing ? (
                    <motion.button
                      onClick={saveNote}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit
                    </motion.button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {selectedNoteData.updatedAt.toLocaleString()}
              </p>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-4">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full p-3 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Start writing your note..."
                />
              ) : (
                <div className="h-full p-3 border border-gray-200 rounded-lg bg-white">
                  <pre className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {selectedNoteData.content || 'This note is empty. Click Edit to add content.'}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Note Selected</h3>
              <p className="text-gray-600 mb-4">
                Select a note from the sidebar or create a new one.
              </p>
              <motion.button
                onClick={createNewNote}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create New Note
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;