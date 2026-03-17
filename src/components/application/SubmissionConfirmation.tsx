import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SubmissionConfirmationProps {
  onReturnHome: () => void;
  track?: 'core' | 'prep';
}

export const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({ onReturnHome, track = 'core' }) => {
  const isPrep = track === 'prep';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-900 border border-slate-100 relative"
        >
          {isPrep ? (
             <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.2 }}
             >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
             </motion.div>
          ) : (
            <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
          )}
          
          {/* Subtle Pulse Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-slate-200"
            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-urbanist font-bold text-3xl text-slate-900 mb-6 tracking-tight"
        >
          {isPrep ? "You’re on the list" : "Application Submitted"}
        </motion.h2>

        {/* Body */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-inter text-slate-600 mb-12 leading-relaxed max-w-sm mx-auto space-y-4"
        >
          {isPrep ? (
            <>
                <p>We’ve received your submission.</p>
                <p>
                    You’ll hear from us when the Preparation Track opens or when we have guidance that fits your goals.
                </p>
                <div className="pt-4 border-t border-slate-100">
                    <p className="font-medium text-slate-800">
                        Until then, focus on learning — quality work is the only path forward.
                    </p>
                </div>
            </>
          ) : (
            <>
                <p className="mb-1">We review every application manually.</p>
                <p>You will receive a decision via email.</p>
            </>
          )}
        </motion.div>

        {/* CTA */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onReturnHome}
          className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors font-inter underline underline-offset-4"
        >
          Return to Home
        </motion.button>

      </div>
    </div>
  );
};
