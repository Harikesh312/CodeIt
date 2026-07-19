import React from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart, TrendingUp, Search, Video } from 'lucide-react';

export default function DashboardPreviewSection() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#6366F1]">Enterprise Dashboard</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-lg"
          >
            Get unparalleled visibility into your hiring process with real-time analytics, automated scoring, and comprehensive candidate profiles.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/20 to-[#06B6D4]/20 blur-[100px] -z-10 rounded-full" />
          
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Fake Mac Header */}
            <div className="h-10 bg-[#111827] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-[#94A3B8] max-w-[200px] w-full justify-center">
                  <Search size={12} /> app.codeit.com
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 bg-gradient-to-br from-[#111827]/50 to-transparent">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-4 w-48 shrink-0">
                <div className="h-8 w-24 bg-white/10 rounded mb-4" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-8 rounded-lg flex items-center px-3 gap-3 ${i === 1 ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'text-[#94A3B8]'}`}>
                    <div className="w-4 h-4 rounded bg-current opacity-50" />
                    <div className="h-2 w-16 bg-current rounded opacity-50" />
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Top Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Active Interviews', value: '24', icon: Video, color: 'text-[#6366F1]' },
                    { label: 'Candidates Passing', value: '68%', icon: TrendingUp, color: 'text-green-400' },
                    { label: 'Total Assessed', value: '1,240', icon: Users, color: 'text-[#06B6D4]' }
                  ].map((metric, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="bg-[#111827] border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8] font-medium">{metric.label}</span>
                        <metric.icon size={16} className={metric.color} />
                      </div>
                      <span className="text-2xl font-bold text-white">{metric.value}</span>
                      {/* Decorative chart line */}
                      <svg className="absolute bottom-0 left-0 right-0 w-full h-8 opacity-20" viewBox="0 0 100 30" preserveAspectRatio="none">
                         <path d={`M0,30 Q${20 + i*10},${10 + i*5} ${50 - i*5},${20 - i*5} T100,10`} fill="none" stroke="currentColor" strokeWidth="2" className={metric.color} />
                      </svg>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Area */}
                <div className="flex flex-col lg:flex-row gap-4 h-64">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex-[2] bg-[#111827] border border-white/5 rounded-xl p-4 flex flex-col"
                  >
                    <div className="text-sm font-medium text-white mb-4">Hiring Pipeline Analytics</div>
                    <div className="flex-1 flex items-end gap-2 px-2 pb-2">
                      {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((height, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + (i * 0.05), duration: 0.8, ease: "easeOut" }}
                          className="flex-1 bg-gradient-to-t from-[#6366F1] to-[#06B6D4] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="flex-[1] bg-[#111827] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative"
                  >
                    <div className="text-sm font-medium text-white absolute top-4 left-4">Candidate Sources</div>
                    <div className="w-32 h-32 rounded-full border-8 border-[#111827] relative mt-4 shadow-[0_0_0_2px_rgba(255,255,255,0.05)] bg-[#111827]">
                      {/* Fake pie chart slices using conic gradient */}
                      <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#6366F1 0% 45%, #06B6D4 45% 75%, #7C3AED 75% 100%)' }}></div>
                      <div className="absolute inset-2 bg-[#111827] rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">1.2k</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
