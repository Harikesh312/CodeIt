import React, { useEffect, useCallback } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') onConfirm();
  }, [onClose, onConfirm]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          border: '1px solid var(--color-border)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.15)' }}
          >
            <LogOut size={24} className="text-red-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Logout?
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)' 
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#EF4444' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
