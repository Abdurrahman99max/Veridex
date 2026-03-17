import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X } from 'lucide-react';

interface GuidancePopoverProps {
  triggerText?: string;
  title: string;
  items: {
    label: string;
    description: string;
  }[];
  footer?: string;
}

export const GuidancePopover: React.FC<GuidancePopoverProps> = ({ 
  triggerText = "Not sure which to pick?", 
  title, 
  items, 
  footer 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-inter font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer group"
      >
        <HelpCircle className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
        <span className="border-b border-indigo-200 group-hover:border-indigo-600 pb-0.5">{triggerText}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile/easy closing */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 mt-4 w-[320px] sm:w-[400px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-urbanist font-bold text-slate-900 text-lg">{title}</h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  {items.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                      <p className="text-sm font-urbanist font-bold text-slate-900 leading-none">
                        {item.label}:
                      </p>
                      <p className="text-sm font-inter text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {footer && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <p className="text-sm font-inter text-slate-400 italic">
                      {footer}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
