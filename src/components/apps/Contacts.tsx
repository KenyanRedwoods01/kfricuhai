'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  notes: string;
  avatar: string;
  createdAt: Date;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('redwoods-contacts');
    if (savedContacts) {
      try {
        const parsedContacts = JSON.parse(savedContacts).map((contact: any) => ({
          ...contact,
          createdAt: new Date(contact.createdAt),
        }));
        setContacts(parsedContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    } else {
      // Load sample contacts
      const sampleContacts: Contact[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Solutions Inc',
          position: 'Senior Developer',
          notes: 'Met at conference. Interested in React development.',
          avatar: '👨‍💻',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 987-6543',
          company: 'Design Studio',
          position: 'UX Designer',
          notes: 'Collaboration partner. Great design skills.',
          avatar: '👩‍🎨',
          createdAt: new Date('2024-02-20'),
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike.wilson@email.com',
          phone: '+1 (555) 456-7890',
          company: 'StartupCorp',
          position: 'Product Manager',
          notes: 'Potential client. Follow up next week.',
          avatar: '👔',
          createdAt: new Date('2024-03-10'),
        },
      ];
      setContacts(sampleContacts);
      localStorage.setItem('redwoods-contacts', JSON.stringify(sampleContacts));
    }
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('redwoods-contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContactData = contacts.find(c => c.id === selectedContact);

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    notes: '',
    avatar: '👤',
  });

  const createContact = () => {
    if (!newContact.firstName || !newContact.lastName) return;

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact,
      createdAt: new Date(),
    };

    setContacts(prev => [contact, ...prev]);
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      notes: '',
      avatar: '👤',
    });
    setShowNewContact(false);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setIsEditing(false);
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    if (selectedContact === contactId) {
      setSelectedContact(null);
      setIsEditing(false);
    }
  };

  const ContactForm = ({ contact, onSave, onCancel }: {
    contact: Contact;
    onSave: (contact: Contact) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(contact);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            {formData.avatar}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about this contact..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <motion.button
            onClick={() => onSave(formData)}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Contact
          </motion.button>
          <motion.button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
            <motion.button
              onClick={() => setShowNewContact(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + New
            </motion.button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedContact === contact.id 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                setSelectedContact(contact.id);
                setIsEditing(false);
              }}
              whileHover={{ backgroundColor: selectedContact === contact.id ? '#dbeafe' : '#f9fafb' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.position} at {contact.company}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.email}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showNewContact ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Contact</h2>
            <ContactForm
              contact={newContact as Contact}
              onSave={(contact) => {
                setNewContact({
                  firstName: contact.firstName,
                  lastName: contact.lastName,
                  email: contact.email,
                  phone: contact.phone,
                  company: contact.company,
                  position: contact.position,
                  notes: contact.notes,
                  avatar: contact.avatar,
                });
                createContact();
              }}
              onCancel={() => setShowNewContact(false)}
            />
          </div>
        ) : selectedContactData ? (
          <div className="flex-1 flex flex-col">
            {/* Contact Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                    {selectedContactData.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {selectedContactData.firstName} {selectedContactData.lastName}
                    </h1>
                    <p className="text-gray-600">{selectedContactData.position}</p>
                    <p className="text-sm text-gray-500">{selectedContactData.company}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <motion.button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => deleteContact(selectedContactData.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex-1 p-6 bg-gray-50">
              {isEditing ? (
                <ContactForm
                  contact={selectedContactData}
                  onSave={updateContact}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="max-w-2xl space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{selectedContactData.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{selectedContactData.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <p className="text-gray-900">{selectedContactData.company || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <p className="text-gray-900">{selectedContactData.position || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedContactData.notes || 'No notes for this contact.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Created</h3>
                    <p className="text-gray-700">{selectedContactData.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Contact Selected</h3>
              <p className="text-gray-600 mb-4">Select a contact from the sidebar or create a new one.</p>
              <motion.button
                onClick={() => setShowNewContact(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add New Contact
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;