import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedSection = ({ children, className, delay = 0, direction = 'up' }) => {
  const directions = {
    up: { y: 100, x: 0 },
    down: { y: -100, x: 0 },
    left: { x: 100, y: 0 },
    right: { x: -100, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.95,
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, className, delayChildren = 0.2, staggerChildren = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className, direction = 'up' }) => {
  const directions = {
    up: { y: 80, x: 0 },
    down: { y: -80, x: 0 },
    left: { x: 80, y: 0 },
    right: { x: -80, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          scale: 0.9,
          ...directions[direction]
        },
        visible: { 
          opacity: 1, 
          scale: 1,
          x: 0, 
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98]
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
