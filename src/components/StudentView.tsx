import { useState } from 'react';
import { Calendar, Clock, MapPin, UserPlus } from 'lucide-react';
import { Event, Registration } from '../types';

interface StudentViewProps {
  events: Event[];
  registrations: Registration[];
  onRegister: (eventId: string, name: string, email: string) => void;
}

export default function StudentView({ events, registrations, onRegister }: StudentViewProps) {
  const [registeringFor, setRegisteringFor] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.event_id === eventId && r.student_email === email);
  };

  const handleRegister = (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    if (!name || !email) return;
    onRegister(eventId, name, email);
    setRegisteringFor(null);
    setName('');
    setEmail('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h1>

      {upcomingEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No upcoming events at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                {event.poster_url && (
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                )}
                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={18} />
                      <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={18} />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {registeringFor === event.id ? (
                    <form onSubmit={(e) => handleRegister(e, event.id)} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisteringFor(null)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setRegisteringFor(event.id)}
                      disabled={email && isRegistered(event.id)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
                        email && isRegistered(event.id)
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <UserPlus size={20} />
                      {email && isRegistered(event.id) ? 'Already Registered' : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
