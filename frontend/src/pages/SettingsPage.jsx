import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Moon, Monitor, Sun, User, Lock, Info, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

function SettingSection({ title, description, icon: Icon, children }) {
  return (
    <div className="p-8 rounded-2xl mb-6 transition-all duration-250 hover:shadow-xl" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-start gap-4 mb-8 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Icon size={22} />
        </div>
        <div>
          <h2 style={{ color: 'var(--color-text-primary)' }}>{title}</h2>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
        </div>
      </div>
      <div className="pl-0 md:pl-[68px]">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className="max-w-4xl mx-auto h-full space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl transition-all duration-250 hover:shadow-xl mb-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-md" style={{ backgroundColor: 'var(--color-primary)' }}>
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Settings
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Manage your preferences and account configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* General / Account */}
        <SettingSection title="General" description="Update your basic account information." icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Timezone</span>
              <select className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors">
                <option value="pst">Pacific Time (PT)</option>
                <option value="est">Eastern Time (ET)</option>
                <option value="utc">UTC</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Language</span>
              <select className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors">
                <option value="en">English (US)</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="primary" size="sm">Save Preferences</Button>
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" description="Customize how CodeIt looks on your device." icon={Monitor}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            <button 
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${theme === 'system' ? 'border-indigo-500 bg-indigo-500/5' : 'border-transparent bg-slate-800/30 hover:border-slate-700'}`}
            >
              <Monitor size={24} className={theme === 'system' ? 'text-indigo-400' : 'text-slate-400'} />
              <span className="text-sm font-medium" style={{ color: theme === 'system' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>System</span>
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/5' : 'border-transparent bg-slate-800/30 hover:border-slate-700'}`}
            >
              <Moon size={24} className={theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'} />
              <span className="text-sm font-medium" style={{ color: theme === 'dark' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>Dark</span>
            </button>
            <button 
              onClick={() => setTheme('light')}
              disabled
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-transparent bg-slate-800/10 opacity-50 cursor-not-allowed"
            >
              <Sun size={24} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-500">Light (Coming Soon)</span>
            </button>
          </div>
        </SettingSection>

        {/* Password & Security */}
        <SettingSection title="Password & Security" description="Manage your password and secure your account." icon={Shield}>
          <div className="space-y-4 max-w-md">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Current Password</span>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>New Password</span>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors" />
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm">Update Password</Button>
            </div>
          </div>
        </SettingSection>
        
        {/* About */}
        <SettingSection title="About" description="System information and resources." icon={Info}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b max-w-md" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Version</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>1.2.4 (Stable)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b max-w-md" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Platform License</span>
              <span className="text-sm font-medium flex items-center gap-1.5 text-emerald-400">
                <Shield size={14} /> Enterprise Active
              </span>
            </div>
            <div className="pt-2">
              <a href="#" className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: 'var(--color-primary-light)' }}>
                View Documentation <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </SettingSection>

      </div>
    </div>
  );
}
