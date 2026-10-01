import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCountrySelect = ({ value, onChange, options, iconComponent: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 50);
    } else if (!isOpen) {
      setTimeout(() => {
        setSearchQuery('');
      }, 200);
    }
  }, [isOpen]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(item => 
      !item.divider && 
      item.label && 
      item.label.toLowerCase().includes(q)
    );
  }, [options, searchQuery]);

  // Find current label to show title if needed
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      <div 
        className="cursor-pointer flex items-center gap-1.5 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        title={selectedOption ? selectedOption.label : 'Select country'}
      >
        <div className="w-6 flex items-center justify-center shrink-0">
          {Icon ? <Icon country={value} label={selectedOption?.label || ''} /> : (value || '🌐')}
        </div>
        <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-blue' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          expand_more
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 left-0 top-full mt-2 w-[280px] bg-surface-container-lowest dark:bg-dark-navy border border-border-slate/50 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden origin-top-left flex flex-col"
          >
            <div className="p-3 border-b border-border-slate/30 dark:border-white/10 shrink-0 bg-surface-container-lowest dark:bg-dark-navy">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant text-lg">search</span>
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-border-slate/50 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface dark:text-white focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="p-5 text-center text-on-surface-variant dark:text-on-surface-variant text-sm">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                filteredOptions.map((item, index) => {
                  if (item.divider) {
                    return <div key={`div-${index}`} className="my-1 border-t border-border-slate/30 dark:border-white/10" />;
                  }
                  
                  return (
                    <div
                      key={item.value || `un-${index}`}
                      className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${value === item.value ? 'bg-pale-blue dark:bg-white/10 text-primary dark:text-white font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-white/80'}`}
                      onClick={() => handleSelect(item.value)}
                    >
                      <div className="w-6 shrink-0 flex items-center justify-center">
                        {Icon && <Icon country={item.value} label={item.label} />}
                      </div>
                      <span className="text-sm truncate flex-1">{item.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCountrySelect;
