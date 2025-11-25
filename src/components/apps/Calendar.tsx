'use client';

import { motion } from 'framer-motion';

const Calendar = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = currentDate.getDate();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const events = [
    { date: today, time: '9:00 AM', title: 'Team Meeting', type: 'meeting' },
    { date: today + 2, time: '2:00 PM', title: 'Project Review', type: 'review' },
    { date: today + 5, time: '4:00 PM', title: 'Client Call', type: 'call' },
  ];

  return (
    <div className="h-full bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{month}</h1>
        <div className="flex gap-2">
          <motion.button 
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <motion.div
            key={index}
            className={`p-2 text-center text-sm border border-gray-200 ${
              day === today 
                ? 'bg-blue-500 text-white font-semibold' 
                : 'hover:bg-gray-50'
            } ${!day ? 'invisible' : ''}`}
            whileHover={day ? { scale: 1.05 } : {}}
          >
            {day}
            {events.filter(e => e.date === day).map((event, i) => (
              <div key={i} className="text-xs mt-1 truncate">
                {event.title}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Today's Events</h3>
        <div className="space-y-2">
          {events.filter(e => e.date === today).map((event, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-sm font-medium text-blue-700">{event.time}</div>
              <div className="text-sm text-gray-900">{event.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;