import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#141414] to-[#10131C] overflow-hidden">
      {/* Soft radial glow behind branding */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#6366F1] rounded-full blur-[150px] opacity-[0.04] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20 xl:px-[120px] pt-20 pb-10 flex flex-col relative z-10">
        
        {/* ROW 1: Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-12 mb-16">
          
          {/* Left Section - Branding (Far Left) */}
          <div className="flex-1 lg:max-w-[400px] flex flex-col relative">
            <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-white">
                Code<span className="text-white">It</span>
              </span>
            </Link>
            
            <div className="mb-10">
              <p className="text-[#8B949E] text-[15px] leading-relaxed font-light">
                Helping organizations discover exceptional technical talent through intelligent hiring experiences.
              </p>
              <p className="text-[#8B949E] text-[15px] leading-relaxed font-light mt-4">
                We build AI-powered recruitment solutions that make hiring faster, smarter and more human.
              </p>
            </div>
            
            <div>
              <h4 className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Stay Connected</h4>
              <div className="flex gap-4">
                <a href="#" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#8B949E] hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-500 ease-out group">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-500 ease-out"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="#" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#8B949E] hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-500 ease-out group">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-500 ease-out"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#8B949E] hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-500 ease-out group">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="group-hover:scale-110 transition-transform duration-500 ease-out"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Architectural Vertical Divider (Visible on lg, positioned to the right of the left column) */}
            <div className="hidden lg:block absolute right-[-20px] xl:right-[-60px] top-0 bottom-[-40px] w-[1px] bg-white/[0.04]"></div>
          </div>

          {/* Middle Section - Navigation (Centered) */}
          <div className="flex-1 flex justify-start lg:justify-center">
            <div className="flex gap-16 xl:gap-28">
              <div>
                <h4 className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase mb-8">Explore</h4>
                <ul className="flex flex-col gap-4">
                  {['Platform', 'Why CodeIt', 'AI Recruitment', 'Success Stories', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#8B949E] text-[15px] hover:text-white transition-colors duration-500 ease-out block font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase mb-8">Programs</h4>
                <ul className="flex flex-col gap-4">
                  {['Resume Analyzer', 'AI Interview', 'Coding Assessment', 'Hiring Dashboard'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#8B949E] text-[15px] hover:text-white transition-colors duration-500 ease-out block font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Stay Updated (Far Right) */}
          <div className="flex-1 flex flex-col lg:items-end">
            <div className="w-full lg:w-[320px]">
              <h4 className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase mb-8">Stay Updated</h4>
              <p className="text-[#8B949E] text-[15px] leading-relaxed mb-6 font-light">
                Receive thoughtful updates about AI hiring, product improvements and new platform features.
              </p>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-full px-5 py-3 text-[15px] text-white placeholder-[#8B949E]/60 focus:outline-none focus:border-[#6366F1]/40 focus:bg-white/[0.04] transition-all duration-500"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-[#6366F1] text-white font-medium text-[15px] rounded-full px-5 py-3 hover:bg-[#4F46E5] hover:shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-all duration-500 ease-out"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
        </div>

        {/* ROW 2: Bottom Bar (Full Width) */}
        <div className="w-full pt-8 border-t border-white/[0.04]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[13px] text-[#8B949E] font-light">
              © 2026 CodeIt. All Rights Reserved.
            </div>
            <div className="flex items-center gap-10 text-[13px] text-[#8B949E] font-light">
              <a href="#" className="hover:text-white transition-colors duration-500 ease-out">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-500 ease-out">Terms & Conditions</a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
