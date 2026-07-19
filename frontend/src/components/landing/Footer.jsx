import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function Footer() {
  const footerLinks = {
    Product: ['Resume Analyzer', 'AI Interview', 'Coding Test', 'Analytics', 'Dashboard'],
    Resources: ['Documentation', 'API', 'Blog', 'Support'],
    Company: ['About', 'Careers', 'Contact', 'Partners'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'Security']
  };

  return (
    <footer className="relative z-10 pt-24 pb-8 border-t border-white/5 bg-[#050816] overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-[#7C3AED] blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                <div className="relative w-full h-full bg-[#111827] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 to-transparent"></div>
                  <Logo size={20} className="text-white z-10" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Code<span className="text-[#6366F1]">It</span>
              </span>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs mb-8">
              Enterprise-grade technical interview platform. Evaluate candidates fairly, quickly, and accurately with AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/10 hover:border-white/10 transition-all hover:-translate-y-1">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#0A66C2]/80 hover:border-[#0A66C2] transition-all hover:-translate-y-1">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1DA1F2]/80 hover:border-[#1DA1F2] transition-all hover:-translate-y-1">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#5865F2]/80 hover:border-[#5865F2] transition-all hover:-translate-y-1">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-white font-semibold text-sm mb-6 tracking-wide">{category}</h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#94A3B8] text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#94A3B8] text-sm">
            Copyright © {new Date().getFullYear()} CodeIt
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-[#94A3B8]">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
               <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span>Status</span>
             </div>
             <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
               <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
