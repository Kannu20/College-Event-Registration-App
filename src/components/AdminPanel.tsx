import { useState } from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Event, Registration } from '../types';

interface AdminPanelProps {
  events: Event[];
  registrations: Registration[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (id: string, event: Omit<Event, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function AdminPanel({ events, registrations, onAddEvent, onUpdateEvent, onDeleteEvent }: AdminPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingParticipants, setViewingParticipants] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    poster_url: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      poster_url: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateEvent(editingId, formData);
    } else {
      onAddEvent(formData);
    }
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
      poster_url: event.poster_url || ''
    });
    setEditingId(event.id);
    setIsAdding(true);
  };

  const getParticipants = (eventId: string) => {
    return registrations.filter(r => r.event_id === eventId);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={20} />
            Add Event
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 animate-slide-up transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClass}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <input
                  type="time"
                  required
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Poster URL (Optional)</label>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className={inputClass}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">All Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No events created yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] dark:bg-gray-750">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      <span>{event.event_time}</span>
                      <span>{event.location}</span>
                    </div>
                    {event.poster_url && (
                      <img src={event.poster_url} alt={event.title} className="mt-3 w-32 h-32 object-cover rounded shadow-md transition-transform duration-300 hover:scale-110" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingParticipants(viewingParticipants === event.id ? null : event.id)}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-all duration-300 transform hover:scale-110"
                      title="View Participants"
                    >
                      <Users size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-all duration-300 transform hover:scale-110"
                      title="Edit Event"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this event?')) {
                          onDeleteEvent(event.id);
                        }
                      }}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-all duration-300 transform hover:scale-110"
                      title="Delete Event"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {viewingParticipants === event.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Participants ({getParticipants(event.id).length})
                    </h4>
                    {getParticipants(event.id).length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No registrations yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {getParticipants(event.id).map(reg => (
                          <div key={reg.id} className="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded transition-colors duration-300">
                            <div className="font-medium dark:text-white">{reg.student_name}</div>
                            <div className="text-gray-600 dark:text-gray-300">{reg.student_email}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(reg.registered_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
