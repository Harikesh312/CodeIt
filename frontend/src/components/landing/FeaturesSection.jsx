import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, Code, LayoutDashboard, BarChart3, FileLineChart } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Resume Analyzer',
      description: 'AI-driven insights to match candidate resumes against job descriptions with enterprise accuracy.',
      icon: FileText,
      gradient: 'from-[#6366F1] to-[#7C3AED]'
    },
    {
      title: 'AI Interview',
      description: 'Conduct seamless autonomous behavioral and technical interviews with an AI persona.',
      icon: Video,
      gradient: 'from-[#06B6D4] to-[#6366F1]'
    },
    {
      title: 'Coding Assessment',
      description: 'Built-in real-time IDE with multi-language support, automated test cases, and plagiarism detection.',
      icon: Code,
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      title: 'Candidate Dashboard',
      description: 'A dedicated, branded portal for candidates to track progress and complete assignments.',
      icon: LayoutDashboard,
      gradient: 'from-orange-400 to-pink-500'
    },
    {
      title: 'Analytics',
      description: 'Deep dive into hiring metrics, time-to-hire, and diversity statistics with real-time dashboards.',
      icon: BarChart3,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Enterprise Reports',
      description: 'Generate compliance-ready PDF reports for every candidate and interview session automatically.',
      icon: FileLineChart,
      gradient: 'from-cyan-400 to-blue-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#06B6D4]">hire better</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-lg"
          >
            CodeIt replaces fragmented tools with a single unified platform. Seamlessly manage the entire technical interview lifecycle in one place.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl -z-10"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              <div className="h-full bg-[#111827]/90 backdrop-blur-xl rounded-xl p-8 border border-white/5 flex flex-col items-start hover:shadow-2xl hover:shadow-[#6366F1]/10 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className={cn('p-3 rounded-xl mb-6 shadow-lg inline-flex bg-gradient-to-br', feature.gradient)}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 flex-1">
                  {feature.description}
                </p>
                
                <div className="mt-auto flex items-center text-sm font-semibold text-white/50 group-hover:text-[#06B6D4] transition-colors cursor-pointer w-fit">
                  <span className="mr-2">Explore feature</span>
                  <span className="inline-block transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
