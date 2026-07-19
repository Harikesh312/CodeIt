import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileSearch, Code2, Video, BrainCircuit, LayoutDashboard } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    { title: 'Upload Resume', icon: UploadCloud, color: 'text-blue-400' },
    { title: 'AI Resume Analysis', icon: FileSearch, color: 'text-indigo-400' },
    { title: 'Coding Assessment', icon: Code2, color: 'text-cyan-400' },
    { title: 'Technical Interview', icon: Video, color: 'text-purple-400' },
    { title: 'AI Evaluation', icon: BrainCircuit, color: 'text-pink-400' },
    { title: 'Hiring Dashboard', icon: LayoutDashboard, color: 'text-emerald-400' }
  ];

  return (
    <section id="workflow" className="py-24 relative z-10 bg-[#111827]/30 border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            The modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#7C3AED]">hiring pipeline</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-lg"
          >
            A completely automated end-to-end workflow designed for scale and precision.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
             <motion.div 
               initial={{ x: '-100%' }}
               whileInView={{ x: '100%' }}
               viewport={{ once: true }}
               transition={{ duration: 2, ease: "linear" }}
               className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#6366F1] to-transparent"
             />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:-translate-y-2 group-hover:border-[#6366F1]/50 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(109,93,253,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <step.icon size={32} className={`relative z-10 ${step.color} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                
                <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                <div className="w-8 h-1 rounded-full bg-white/10 group-hover:bg-[#06B6D4] transition-colors duration-300"></div>
                
                {/* Mobile/Tablet vertical connectors */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden w-px h-8 bg-white/10 mt-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
