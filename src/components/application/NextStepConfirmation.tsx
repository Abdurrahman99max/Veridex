import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Button } from "../ui/button";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export const NextStepConfirmation: React.FC<Props> = ({ isOpen, onConfirm, onCancel, title, description }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300">
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-urbanist font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 font-inter leading-relaxed">{description}</p>
              </div>
              <div className="w-full pt-4 space-y-3">
                <Button onClick={onConfirm} className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all group">
                  Confirm & Continue
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button onClick={onCancel} className="text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
