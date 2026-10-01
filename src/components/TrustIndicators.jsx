import React from 'react';
import { motion } from 'framer-motion';
import './TrustIndicators.css';

const TrustIndicators = () => {
  const stats = [
    { value: '150+', label: 'Industries' },
    { value: '24-72h', label: 'Delivery' },
    { value: '100%', label: 'Confidential' },
    { value: 'Human', label: 'Validated' },
    { value: 'AI', label: 'Powered' },
  ];

  return (
    <section className="trust-section py-8 bg-surface-container-lowest dark:bg-gradient-alt transition-colors duration-300">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="stat-item"
            >
              <h3 className="stat-value text-gradient">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
