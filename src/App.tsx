import { useState, useEffect } from 'react';
import { Shield, Users, LogOut, Moon, Sun } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import StudentView from './components/StudentView';
import HomePage from './components/HomePage';
import { Event, Registration } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { user, profile, signIn, signUp, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

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

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signIn(email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, fullName: string, role: 'student' | 'admin') => {
    setAuthLoading(true);
    try {
      await signUp(email, password, fullName, role);
    } finally {
      setAuthLoading(false);
    }
  };

  if (!user) {
    return <HomePage onLogin={handleLogin} onSignup={handleSignup} loading={authLoading} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="animate-slide-in">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">College Events</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Welcome, {profile?.full_name}</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                title={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isAdmin
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              }`}>
                {isAdmin ? (
                  <>
                    <Shield size={20} />
                    Admin
                  </>
                ) : (
                  <>
                    <Users size={20} />
                    Student
                  </>
                )}
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-all duration-300 transform hover:scale-105"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
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
