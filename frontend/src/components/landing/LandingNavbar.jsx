import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterview } from '../../context/InterviewContext';
import { ROLES } from '../../utils/constants';
import Logo from '../Logo';
import { cn } from '../../utils/cn';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
    { name: 'Login', href: '/login' },
  ];

  const handleDashboardRedirect = () => {
    navigate(role === ROLES.HR ? '/dashboard' : '/join');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-[#050816]/80 backdrop-blur-xl border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-4'
          : 'bg-transparent border-transparent py-6'
      )}
    >
      <div className="container mx-auto px-8 max-w-[1500px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <Logo />
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            Code<span className="text-[#6366F1]">It</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors relative group flex items-center gap-2"
              >
                {link.icon && <link.icon size={16} />}
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors relative group flex items-center gap-2"
              >
                {link.icon && <link.icon size={16} />}
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6 relative z-10">
          {user ? (
            <button
              onClick={handleDashboardRedirect}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED] shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 duration-200 border border-white/10"
            >
              Open Dashboard
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED] shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 duration-200 border border-white/10"
            >
              Start Free
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white relative z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#111827] border-b border-white/10 shadow-xl md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[#94A3B8] hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED]"
              >
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED]"
              >
                Sign In / Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
