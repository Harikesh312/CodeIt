import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, UserCheck, ArrowRight, AlertCircle, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';

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

  // Removed auto-redirect. Users stay on Landing Page until they click "Go to Dashboard"

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
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] bg-[#0B1220]/80 border border-white/10 text-white placeholder-[#64748B]";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#050816]">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] bg-gradient-to-r from-[#6366F1]/30 to-[#7C3AED]/20"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] bg-gradient-to-l from-[#06B6D4]/20 to-[#6366F1]/20"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-5">
            <Logo />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Code<span className="text-[#7C3AED]">It</span>
          </h1>
          <p className="mt-3 text-center text-sm font-medium text-[#94A3B8]">
            Enterprise Technical Interview Suite
          </p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl p-8 shadow-2xl bg-[#111827]/90 backdrop-blur-xl border border-white/10 relative overflow-hidden"
        >
          {/* Subtle gradient border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#6366F1]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {user ? (
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 bg-gradient-to-br from-[#6366F1] to-[#7C3AED]">
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <h2 className="text-2xl font-bold text-center text-white">
                  Welcome back, {user.name?.split(' ')[0]}
                </h2>
                <p className="text-sm mt-2 text-center text-[#94A3B8]">
                  Continue to your dashboard
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-2xl font-bold text-center text-white">
                  {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm mt-2 text-center text-[#94A3B8]">
                  {isLogin ? 'Enter your credentials to continue' : 'Join our premium platform'}
                </p>
              </div>
            )}

            {!user ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-4">
                      {/* Role selection */}
                      <div className="flex gap-2 p-1.5 rounded-xl bg-[#0B1220] border border-white/5">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(ROLES.HR)}
                          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            selectedRole === ROLES.HR 
                              ? 'bg-[#6366F1]/15 text-[#6366F1] shadow-sm border border-[#6366F1]/20' 
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <Briefcase size={16} /> Interviewer
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole(ROLES.CANDIDATE)}
                          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            selectedRole === ROLES.CANDIDATE 
                              ? 'bg-[#06B6D4]/15 text-[#06B6D4] shadow-sm border border-[#06B6D4]/20' 
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          <UserCheck size={16} /> Candidate
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[#94A3B8]">Full Name</label>
                        <div className="relative">
                          <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="John Doe"
                            className={inputClasses}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[#94A3B8]">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@company.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[#94A3B8]">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400"
                    >
                      <AlertCircle size={15} />
                      {error}
                    </motion.div>
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

                <div className="mt-6 text-center text-sm text-[#94A3B8]">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="font-semibold text-[#6366F1] hover:text-[#7C3AED] transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  variant="primary"
                  size="xl"
                  className="w-full"
                  iconRight={ArrowRight}
                  onClick={() => navigate(role === ROLES.HR ? '/dashboard' : '/join')}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-xs text-center mt-8 font-medium text-[#64748B]">
          CodeIt · Enterprise Interview Platform
        </p>
      </motion.div>
    </div>
  );
}
