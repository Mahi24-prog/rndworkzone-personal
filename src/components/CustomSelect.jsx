import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ id, value, onChange, options, placeholder, error, className, searchable = false }) => {
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
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 50); // slight delay to ensure transition started
    } else if (!isOpen) {
      setTimeout(() => {
        setSearchQuery('');
      }, 200); // clear after close animation
    }
  }, [isOpen, searchable]);

  const handleSelect = (selectedValue) => {
    onChange({ target: { id, value: selectedValue, type: 'select' } });
    setIsOpen(false);
  };

  // Find current label
  const getCurrentLabel = () => {
    if (!value) return placeholder;
    for (const group of options) {
      if (group.groupLabel) {
        const found = group.items.find(item => item.value === value);
        if (found) return found.label;
      } else {
        const found = options.find(item => item.value === value);
        if (found) return found.label;
      }
    }
    return value;
  };

  const isGrouped = options.length > 0 && options[0].groupLabel !== undefined;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();

    if (isGrouped) {
      return options.map(group => {
        const filteredItems = group.items.filter(item => 
          item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
        );
        return { ...group, items: filteredItems };
      }).filter(group => group.items.length > 0);
    } else {
      return options.filter(item => 
        item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
      );
    }
  }, [options, searchQuery, searchable, isGrouped]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={`${className} cursor-pointer flex justify-between items-center ${!value ? 'text-on-surface-variant dark:text-on-surface-variant' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        <span className="truncate">{getCurrentLabel()}</span>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-blue' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
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
            className="absolute z-50 w-full mt-2 bg-surface-container-lowest dark:bg-dark-navy border border-border-slate/50 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden origin-top flex flex-col"
          >
            {searchable && (
              <div className="p-3 border-b border-border-slate/30 dark:border-white/10 shrink-0 bg-surface-container-lowest dark:bg-dark-navy">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant text-lg">search</span>
                  <input
                    type="text"
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-slate/50 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-on-surface dark:text-white focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="p-5 text-center text-on-surface-variant dark:text-on-surface-variant text-sm">
                  No results found for "{searchQuery}"
                </div>
              ) : isGrouped ? (
                filteredOptions.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    {group.groupLabel && (
                      <div className="px-5 py-3 font-label-caps font-bold text-xs tracking-wider text-accent-blue dark:text-[#55c8ff] uppercase border-y border-border-slate/30 dark:border-white/10 sticky top-0 bg-slate-100 dark:bg-[#081125] z-10 first:border-t-0 shadow-sm">
                        {group.groupLabel}
                      </div>
                    )}
                    {group.items.map((item) => (
                      <div
                        key={item.value}
                        className={`px-5 py-3 cursor-pointer transition-colors ${value === item.value ? 'bg-pale-blue dark:bg-white/10 text-primary dark:text-white font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-white/80'}`}
                        onClick={() => handleSelect(item.value)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                filteredOptions.map((item) => (
                  <div
                    key={item.value}
                    className={`px-5 py-3 cursor-pointer transition-colors ${value === item.value ? 'bg-pale-blue dark:bg-white/10 text-primary dark:text-white font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-white/80'}`}
                    onClick={() => handleSelect(item.value)}
                  >
                    {item.label}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
