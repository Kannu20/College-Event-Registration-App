import { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import StudentView from './components/StudentView';
import { Event, Registration } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();

    const eventsChannel = supabase
      .channel('events-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    const registrationsChannel = supabase
      .channel('registrations-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
        fetchRegistrations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(registrationsChannel);
    };
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data || []);
    }
  };

  const handleAddEvent = async (eventData: Omit<Event, 'id'>) => {
    const { error } = await supabase
      .from('events')
      .insert([eventData]);

    if (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Omit<Event, 'id'>) => {
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleRegister = async (eventId: string, name: string, email: string) => {
    const existingReg = registrations.find(
      r => r.event_id === eventId && r.student_email === email
    );

    if (existingReg) {
      alert('You are already registered for this event!');
      return;
    }

    const { error } = await supabase
      .from('registrations')
      .insert([{
        event_id: eventId,
        student_name: name,
        student_email: email
      }]);

    if (error) {
      console.error('Error registering:', error);
      alert('Failed to register for event');
    } else {
      alert('Registration successful!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

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
