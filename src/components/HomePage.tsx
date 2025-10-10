import { useState } from 'react';
import { Calendar, LogIn, UserPlus, Shield, Users, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HomePageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, fullName: string, role: 'student' | 'admin') => Promise<void>;
  loading: boolean;
}

export default function HomePage({ onLogin, onSignup, loading }: HomePageProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      await onLogin(email, password);
    } else {
      await onSignup(email, password, fullName, role);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('student');
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10"
        title={isDark ? 'Light Mode' : 'Dark Mode'}
      >
        {isDark ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-700" />}
      </button>

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10 animate-fade-in">
        <div className="space-y-6 animate-slide-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-3 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300 animate-pulse-slow">
              <Calendar className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">College Events</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              Discover & Register for Campus Events
              <Sparkles size={28} className="text-blue-600 dark:text-blue-400 animate-pulse" />
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay connected with all the exciting events happening on campus. Register with one click and never miss out!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Users className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white">For Students</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Browse events, register instantly, and track your registrations</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Shield className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white">For Admins</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Create events, manage registrations, and view participant lists</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-slide-up hover:shadow-3xl transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isLoginMode ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="your.email@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {!isLoginMode && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I am a
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4 text-blue-600 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4 text-blue-600 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Admin</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLoginMode ? (
                    <>
                      <LogIn size={20} />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Sign Up
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 hover:underline"
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
