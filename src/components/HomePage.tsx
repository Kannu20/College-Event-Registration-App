import { useState } from 'react';
import { Calendar, LogIn, UserPlus, Shield, Users } from 'lucide-react';

interface HomePageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, fullName: string, role: 'student' | 'admin') => Promise<void>;
  loading: boolean;
}

export default function HomePage({ onLogin, onSignup, loading }: HomePageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Calendar className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">College Events</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Discover & Register for Campus Events
            </h2>
            <p className="text-lg text-gray-600">
              Stay connected with all the exciting events happening on campus. Register with one click and never miss out!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">For Students</h3>
              </div>
              <p className="text-sm text-gray-600">Browse events, register instantly, and track your registrations</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="text-green-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">For Admins</h3>
              </div>
              <p className="text-sm text-gray-600">Create events, manage registrations, and view participant lists</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-600">
              {isLoginMode ? 'Sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Admin</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
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
            <p className="text-gray-600">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:text-blue-700 transition"
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
