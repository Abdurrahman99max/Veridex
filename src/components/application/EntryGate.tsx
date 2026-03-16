import React from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

interface EntryGateProps {
  onStart: () => void;
  onWaitlist: () => void;
  onBack: () => void;
}

export const EntryGate: React.FC<EntryGateProps> = ({ onStart, onWaitlist, onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Navigation - Top Bar for Back Button */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-12 z-20">
        <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-inter text-sm font-medium cursor-pointer"
        >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
        </button>
      </nav>

      {/* Background Subtle Accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-100 via-indigo-500 to-slate-100 opacity-20 z-10"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        <h1 className="font-urbanist font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-6 sm:mb-8 tracking-tight px-2">
          This Is Not for Everyone
        </h1>
        
        <div className="space-y-4 sm:space-y-6 font-inter text-slate-600 text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 max-w-lg mx-auto px-4">
            <p>
                This application is only for final-year university students who already possess task-ready, demonstrable skills.
            </p>
            <p>
                If you are not in your final year or do not yet have real work samples, this platform is not a fit at this time.
            </p>
        </div>

        <div className="flex flex-col items-center gap-8 px-4 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button 
                    onClick={onStart}
                    className="group relative overflow-hidden rounded-lg bg-[#2C2E3E] px-8 py-3.5 sm:py-4 transition-all hover:bg-[#1f202b] active:scale-[0.98] shadow-xl shadow-indigo-500/10 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <span className="font-inter font-medium text-white text-base sm:text-lg">Apply for Access</span>
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </button>
                
                <button 
                    onClick={onBack}
                    className="px-8 py-3.5 sm:py-4 rounded-lg border border-slate-200 text-slate-500 font-inter font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto hover:text-slate-900 bg-white"
                >
                    Nevermind, go back
                </button>
            </div>

            <div className="flex flex-col items-center gap-2 max-w-sm">
                <p className="font-inter text-xs sm:text-sm text-slate-400">
                    We are building a preparation track for students who want to become task-ready.
                </p>
                <button 
                    onClick={onWaitlist}
                    className="font-inter text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border-b border-slate-200 hover:border-slate-800 pb-0.5"
                >
                    Join the preparation program waitlist
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};