import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Briefcase, UserCheck, ArrowRight, AlertCircle, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, registerUser, user, role } = useInterview();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(ROLES.HR);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (user) {
      navigate(role === ROLES.HR ? '/dashboard' : '/join', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required.');
        return;
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required.');
        return;
      }
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await registerUser(name.trim(), email.trim(), password, selectedRole);
      }
      // Navigation handled by effect or context
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 rounded-2xl shadow-2xl mb-5 animate-glow-pulse" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 40px rgba(91,108,255,0.3)' }}>
            <Code2 size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Code<span style={{ color: 'var(--color-primary-light)' }}>It</span>
          </h1>
          <p className="mt-3 text-center text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Enterprise Technical Interview Suite
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl animate-fade-in" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
              {isLogin ? 'Enter your credentials to continue' : 'Join our premium platform'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-4">
                {/* Role selection */}
                <div className="flex gap-4 p-1 rounded-xl" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.HR)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedRole === ROLES.HR ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Briefcase size={16} /> Interviewer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.CANDIDATE)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedRole === ROLES.CANDIDATE ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck size={16} /> Candidate
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      placeholder="John Doe"
                      className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@company.com"
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Continue button */}
            <Button
              type="submit"
              variant="primary"
              size="xl"
              className="w-full mt-2"
              loading={loading}
              iconRight={ArrowRight}
            >
              {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-xs text-center mt-8 font-medium text-slate-500">
          CodeIt · Enterprise Interview Platform
        </p>
      </div>
    </div>
  );
}
