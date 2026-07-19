import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Code2, Users, LayoutDashboard, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stats = [
    { title: '10K+', subtitle: 'Candidates Assessed', icon: Users, color: 'text-[#06B6D4]' },
    { title: '95%', subtitle: 'AI Accuracy', icon: Brain, color: 'text-[#6366F1]' },
    { title: '500+', subtitle: 'Technical Interviews', icon: Activity, color: 'text-[#7C3AED]' },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-center">
      <div className="container mx-auto px-8 max-w-[1500px] relative z-10 w-full flex flex-col gap-20">
        
        {/* Top Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 w-full lg:max-w-2xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm shadow-xl shadow-[#6366F1]/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse"></span>
              <span className="text-sm font-semibold text-[#94A3B8] tracking-wide">CodeIt Enterprise v2.0 is live</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight text-white leading-[1.1]">
              AI Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#06B6D4]">
                Technical Interview
              </span> <br />
              Platform
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#94A3B8] leading-relaxed font-medium">
              Evaluate resumes, conduct AI interviews, coding assessments and hire top talent with enterprise analytics. The complete suite for modern hiring teams.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 mt-4">
              <Link to="/login" className="px-8 py-4 rounded-2xl font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-1 duration-300 flex items-center justify-center gap-3 group text-lg border border-[#818CF8]/30">
                Start Free <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 duration-300 flex items-center justify-center gap-3 text-lg">
                <LayoutDashboard size={20} className="text-[#06B6D4]" /> Open Dashboard
              </button>
              <button className="w-14 h-14 rounded-2xl font-bold text-[#94A3B8] bg-transparent border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all hover:-translate-y-1 duration-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Mockup (Larger, 50% width) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[750px] w-full flex items-center justify-center lg:justify-end perspective-[1200px]"
          >
            <div className="relative w-full max-w-[800px] aspect-[4/3]">
              {/* Central glowing core */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#06B6D4]/30 blur-[100px] rounded-full animate-pulse" />
              
              {/* Main Mockup Dashboard Abstract */}
              <div className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transform rotate-2 hover:rotate-0 transition-transform duration-700 z-10 flex flex-col">
                {/* Mockup Header */}
                <div className="h-14 border-b border-white/5 flex items-center px-6 gap-3 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#10B981]"></div>
                  </div>
                  <div className="ml-6 w-64 h-6 bg-white/5 rounded-full"></div>
                </div>
                {/* Mockup Content */}
                <div className="flex-1 p-8 flex flex-col gap-6 relative overflow-hidden">
                  <div className="flex gap-6">
                    <div className="flex-1 h-32 bg-white/5 rounded-2xl border border-white/5 flex flex-col p-5">
                      <div className="w-10 h-10 rounded-full bg-[#6366F1]/20 mb-auto"></div>
                      <div className="w-3/4 h-4 bg-white/10 rounded-full mb-3"></div>
                      <div className="w-1/2 h-6 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="flex-1 h-32 bg-white/5 rounded-2xl border border-white/5 flex flex-col p-5">
                      <div className="w-10 h-10 rounded-full bg-[#06B6D4]/20 mb-auto"></div>
                      <div className="w-3/4 h-4 bg-white/10 rounded-full mb-3"></div>
                      <div className="w-1/2 h-6 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full bg-white/5 rounded-2xl border border-white/5 mt-2 relative overflow-hidden p-6">
                    <div className="w-1/3 h-6 bg-white/10 rounded-full mb-8"></div>
                    <div className="flex items-end gap-4 h-32 w-full absolute bottom-6 left-6 right-6">
                       <div className="flex-1 bg-[#6366F1]/40 rounded-t-md h-[40%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                       <div className="flex-1 bg-[#06B6D4]/40 rounded-t-md h-[60%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                       <div className="flex-1 bg-[#7C3AED]/40 rounded-t-md h-[30%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                       <div className="flex-1 bg-[#6366F1]/40 rounded-t-md h-[80%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                       <div className="flex-1 bg-[#06B6D4]/40 rounded-t-md h-[50%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                       <div className="flex-1 bg-[#7C3AED]/40 rounded-t-md h-[90%] transform origin-bottom hover:scale-y-110 transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards (positioned relative to the larger dashboard) */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 -left-12 bg-[#111827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-5 z-20 hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#94A3B8]">Resume Score</p>
                  <p className="text-2xl font-bold text-white">98 / 100</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-16 bg-[#111827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-5 z-20 hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-blue-600 flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
                  <Code2 className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#94A3B8]">Coding Assessment</p>
                  <p className="text-2xl font-bold text-white">Passed - Top 5%</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-10 left-16 bg-[#111827]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-5 z-20 hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Users className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#94A3B8]">AI Interview</p>
                  <p className="text-2xl font-bold text-white">Scheduled</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Premium Statistic Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 w-full z-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 rounded-[24px] bg-[#0B1220]/60 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 flex items-center gap-6 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 from-[#6366F1] to-[#06B6D4]" />
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={28} />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.title}</span>
                <span className="text-sm font-medium text-[#94A3B8]">{stat.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
