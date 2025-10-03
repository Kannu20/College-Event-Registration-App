import { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import StudentView from './components/StudentView';
import { Event, Registration } from './types';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      ...eventData
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (id: string, eventData: Omit<Event, 'id'>) => {
    setEvents(events.map(event => event.id === id ? { ...eventData, id } : event));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setRegistrations(registrations.filter(reg => reg.event_id !== id));
  };

  const handleRegister = (eventId: string, name: string, email: string) => {
    const existingReg = registrations.find(
      r => r.event_id === eventId && r.student_email === email
    );

    if (existingReg) {
      alert('You are already registered for this event!');
      return;
    }

    const newRegistration: Registration = {
      id: crypto.randomUUID(),
      event_id: eventId,
      student_name: name,
      student_email: email,
      registered_at: new Date().toISOString()
    };
    setRegistrations([...registrations, newRegistration]);
    alert('Registration successful!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">College Events</h1>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isAdmin
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isAdmin ? (
                <>
                  <Shield size={20} />
                  Admin Mode
                </>
              ) : (
                <>
                  <Users size={20} />
                  Student View
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {isAdmin ? (
          <AdminPanel
            events={events}
            registrations={registrations}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        ) : (
          <StudentView
            events={events}
            registrations={registrations}
            onRegister={handleRegister}
          />
        )}
      </main>
    </div>
  );
}

export default App;
