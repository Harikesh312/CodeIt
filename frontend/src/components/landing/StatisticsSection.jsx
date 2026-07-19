import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedCounter = ({ from, to, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Ease out quad
        const easeOutProgress = progress * (2 - progress);
        
        setCount(Math.floor(easeOutProgress * (to - from) + from));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
};

export default function StatisticsSection() {
  const stats = [
    { label: 'Candidates Assessed', value: 10000, suffix: '+' },
    { label: 'AI Accuracy', value: 95, suffix: '%' },
    { label: 'Enterprise Clients', value: 250, suffix: '+' },
    { label: 'System Uptime', value: 99, suffix: '%' },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-transparent border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                <AnimatedCounter from={0} to={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-[#94A3B8] font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
