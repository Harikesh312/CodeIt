import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="relative">
          {/* Huge blurred glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#06B6D4] blur-[120px] opacity-40 rounded-full animate-glow-pulse" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[32px] overflow-hidden bg-[#0B1220]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-10 md:p-20 text-center"
          >
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -20, 0], 
                  opacity: [0.2, 0.6, 0.2] 
                }}
                transition={{ 
                  duration: 3 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5 
                }}
                className={`absolute rounded-full bg-white/20 blur-sm w-${2+i} h-${2+i}`}
                style={{ 
                  top: `${15 + i * 12}%`, 
                  left: `${10 + (i * 15)}%` 
                }}
              />
            ))}

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                Ready to Build Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">Next Great Team?</span>
              </h2>
              <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
                Screen candidates faster using AI-powered interviews and analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-1 duration-300 flex items-center justify-center gap-3 group text-lg"
                >
                  Start Free <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
                </Link>
                <button className="px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 duration-300 text-lg shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                  Schedule Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
