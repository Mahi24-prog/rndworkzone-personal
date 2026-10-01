import React from 'react';
import { motion } from 'framer-motion';

const Capabilities = () => {
  const capabilities = [
    { icon: "bolt", title: "AI Speed", desc: "Research that takes weeks delivered in 24-72 hours" },
    { icon: "verified_user", title: "Human Accuracy", desc: "Every finding verified before it reaches your desk" },
    { icon: "public", title: "Domain Breadth", desc: "150+ industries with no sector excluded" },
    { icon: "presentation", title: "Presentation-Ready", desc: "No reformatting needed - ready to use from day one" },
    { icon: "lock", title: "Confidential", desc: "Your research requirement stays strictly private, always" },
    { icon: "timer", title: "Fast Turnaround", desc: "Built for organizations that decide in real time" },
    { icon: "assignment_turned_in", title: "Professional Deliverables", desc: "Structured outputs formatted to executive standards" },
    { icon: "layers", title: "Flexible Engagement", desc: "One report, one project, or ongoing strategic support" }
  ];

  return (
    <section className="py-section-gap-lg bg-background dark:bg-dark-navy transition-colors duration-300" id="capabilities">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md mb-2 dark:text-white">Our Capabilities</h2>
          <p className="text-slate-muted dark:text-on-surface-variant">We provide unparalleled speed and precision to deliver boardroom-ready intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, index) => {
            const isAlternate = index % 2 !== 0;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-6 rounded-2xl border border-pale-blue dark:border-white/10 hover:shadow-soft hover:bg-pale-blue/30 dark:hover:bg-white/10 transition-all group bg-white dark:bg-white/5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform ${isAlternate ? 'bg-accent-blue' : 'bg-primary dark:bg-white/20'}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="font-bold mb-2 text-primary dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-muted dark:text-on-surface-variant">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
