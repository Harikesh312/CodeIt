import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Briefcase, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, user, role } = useInterview();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (user) {
      navigate(role === ROLES.HR ? '/dashboard' : '/join', { replace: true });
    }
  }, [user, role, navigate]);

  const handleContinue = async () => {
    if (!selectedRole) { setError('Please select a role.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError('');
    setLoading(true);

    try {
      await login(name.trim(), selectedRole);
      // Navigation happens after login() resolves — state is fully set
      navigate(selectedRole === ROLES.HR ? '/dashboard' : '/join');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: ROLES.HR,
      label: 'Interviewer',
      subtitle: 'Create & manage interview rooms',
      icon: Briefcase,
      color: 'blue',
      accent: 'border-blue-500 bg-blue-500/10',
      ring: 'ring-blue-500/40',
      iconBg: 'bg-blue-600',
    },
    {
      id: ROLES.CANDIDATE,
      label: 'Candidate',
      subtitle: 'Join a room with your invite code',
      icon: UserCheck,
      color: 'violet',
      accent: 'border-violet-500 bg-violet-500/10',
      ring: 'ring-violet-500/40',
      iconBg: 'bg-violet-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-500/30 mb-4">
            <Code2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Code<span className="text-blue-400">It</span>
          </h1>
          <p className="text-gray-400 mt-2 text-center text-sm">
            Real-time technical interview platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-gray-200 font-semibold text-lg mb-5">Get Started</h2>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => { setSelectedRole(r.id); setError(''); }}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `${r.accent} ${r.ring} ring-2`
                      : 'border-gray-800 bg-gray-800/30 hover:border-gray-700 hover:bg-gray-800/60'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? r.iconBg : 'bg-gray-700'} transition-colors`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {r.label}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-tight">{r.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Name input */}
          <div className="mb-5">
            <label htmlFor="login-name" className="block text-xs font-medium text-gray-400 mb-2">
              Your Name
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              placeholder="Enter your full name"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Continue button */}
          <Button
            id="login-continue-btn"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            iconRight={ArrowRight}
            onClick={handleContinue}
          >
            {loading ? 'Signing in…' : 'Continue'}
          </Button>
        </div>

        <p className="text-gray-700 text-xs text-center mt-6">
          CodeIt · Real-time coding interviews
        </p>
      </div>
    </div>
  );
}
