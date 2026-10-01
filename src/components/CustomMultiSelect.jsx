import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomMultiSelect = ({ id, value = [], onChange, options, placeholder, error, className, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
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
      }, 50);
    } else if (!isOpen) {
      setTimeout(() => {
        setSearchQuery('');
      }, 200);
    }
  }, [isOpen, searchable]);

  const handleSelect = (itemValue) => {
    let newValue;
    if (value.includes(itemValue)) {
      newValue = value.filter(v => v !== itemValue);
    } else {
      newValue = [...value, itemValue];
    }
    onChange({ target: { id, value: newValue, type: 'select-multiple' } });
  };

  const removeValue = (e, itemValue) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== itemValue);
    onChange({ target: { id, value: newValue, type: 'select-multiple' } });
  };

  const handleSelectGroup = (groupItems) => {
    const itemValues = groupItems.map(item => item.value);
    const allSelected = itemValues.every(val => value.includes(val));
    
    let newValue;
    if (allSelected) {
      // deselect all in group
      newValue = value.filter(val => !itemValues.includes(val));
    } else {
      // select all in group
      newValue = [...new Set([...value, ...itemValues])];
    }
    onChange({ target: { id, value: newValue, type: 'select-multiple' } });
  };

  // Find current labels
  const getSelectedLabels = () => {
    if (!value || value.length === 0) return null;
    
    const labels = [];
    value.forEach(val => {
      for (const group of options) {
        if (group.groupLabel) {
          const found = group.items.find(item => item.value === val);
          if (found) {
            labels.push({ value: val, label: found.label });
            break;
          }
        } else {
          const found = options.find(item => item.value === val);
          if (found) {
            labels.push({ value: val, label: found.label });
            break;
          }
        }
      }
    });
    return labels;
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

  const selectedLabels = getSelectedLabels();

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={`${className} cursor-pointer min-h-[56px] flex justify-between items-center ${(!value || value.length === 0) ? 'text-on-surface-variant dark:text-on-surface-variant' : ''}`}
        onClick={() => {
          if (!isOpen && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 380; // approx max height of dropdown
            if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
              setDropdownPosition('top');
            } else {
              setDropdownPosition('bottom');
            }
          }
          setIsOpen(!isOpen);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-wrap gap-2 pr-4 overflow-hidden">
          {selectedLabels ? (
            selectedLabels.map(item => (
              <span 
                key={item.value} 
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-blue-300 text-xs font-medium"
              >
                <span className="truncate max-w-[150px]">{item.label}</span>
                <span 
                  className="material-symbols-outlined text-[14px] hover:text-red-500 cursor-pointer"
                  onClick={(e) => removeValue(e, item.value)}
                >
                  close
                </span>
              </span>
            ))
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-accent-blue' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          expand_more
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute z-50 w-full bg-surface-container-lowest dark:bg-dark-navy border border-border-slate/50 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ${
              dropdownPosition === 'top' ? 'bottom-full mb-2 origin-bottom' : 'mt-2 origin-top'
            }`}
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
                      <div 
                        className="px-5 py-3 font-label-caps font-bold text-xs tracking-wider text-accent-blue dark:text-[#55c8ff] uppercase border-y border-border-slate/30 dark:border-white/10 sticky top-0 bg-slate-100 dark:bg-[#081125] z-10 first:border-t-0 shadow-sm flex justify-between items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-[#0a1630] transition-colors"
                        onClick={() => handleSelectGroup(group.items)}
                      >
                        <span>{group.groupLabel}</span>
                        <span className="text-[10px] font-normal lowercase bg-blue-100 dark:bg-blue-900/40 text-accent-blue px-2 py-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors">
                          {group.items.every(item => value.includes(item.value)) ? 'Deselect All' : 'Select All'}
                        </span>
                      </div>
                    )}
                    {group.items.map((item) => {
                      const isSelected = value.includes(item.value);
                      return (
                        <div
                          key={item.value}
                          className={`px-5 py-3 cursor-pointer transition-colors flex items-center gap-3 ${isSelected ? 'bg-pale-blue dark:bg-white/10 text-primary dark:text-white font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-white/80'}`}
                          onClick={() => handleSelect(item.value)}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-accent-blue border-accent-blue text-white' : 'border-border-slate dark:border-white/30'}`}>
                            {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                          </div>
                          {item.label}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))
              ) : (
                filteredOptions.map((item) => {
                  const isSelected = value.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      className={`px-5 py-3 cursor-pointer transition-colors flex items-center gap-3 ${isSelected ? 'bg-pale-blue dark:bg-white/10 text-primary dark:text-white font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-white/80'}`}
                      onClick={() => handleSelect(item.value)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-accent-blue border-accent-blue text-white' : 'border-border-slate dark:border-white/30'}`}>
                        {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                      </div>
                      {item.label}
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

export default CustomMultiSelect;
