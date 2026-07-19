import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function HRLayout() {
  return (
    <div className="flex h-screen bg-grid-pattern relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)', transition: 'background-color 0.3s ease' }}>
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 pointer-events-none blur-[120px]" style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.15] pointer-events-none blur-[150px]" style={{ background: 'radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)' }}></div>

      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
