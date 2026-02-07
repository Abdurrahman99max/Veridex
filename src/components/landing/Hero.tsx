import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StarBorder } from './StarBorder';

const FourPointStar = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M10 0C11.6 6.4 13.6 8.4 20 10C13.6 11.6 11.6 13.6 10 20C8.4 13.6 6.4 11.6 0 10C6.4 8.4 8.4 6.4 10 0Z" />
  </svg>
);

interface HeroProps {
  onApply?: () => void;
  onWaitlist?: () => void;
}

export const Hero = ({ onApply, onWaitlist }: HeroProps) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col text-slate-900 font-sans selection:bg-slate-200 relative overflow-hidden">
      {/* Font Imports via Style Tag for V1 Speed */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Urbanist:wght@500;600;700&display=swap');
          .font-urbanist { font-family: 'Urbanist', sans-serif; }
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>

      {/* Decorative Background Elements - Restored */}
      <div className="absolute inset-0 pointer-events-none select-none">
        
        {/* Left Vertical Line Group */}
        <div className="absolute left-[5%] sm:left-[10%] lg:left-[15%] top-0 h-full w-px">
          {/* Fading Line */}
          <div className="absolute top-[150px] w-px h-[400px] bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-30 md:opacity-40"></div>
          
          {/* Floating Stars */}
          <div className="absolute top-[220px] -left-2 text-indigo-400 opacity-40 md:opacity-60">
            <FourPointStar className="w-3 h-3 md:w-4 h-4" />
          </div>
          <div className="absolute top-[380px] -left-1 text-slate-300">
            <FourPointStar className="w-1.5 h-1.5 md:w-2 h-2" />
          </div>
        </div>

        {/* Right Vertical Line Group */}
        <div className="absolute right-[5%] sm:right-[10%] lg:right-[15%] top-0 h-full w-px">
          {/* Fading Line */}
          <div className="absolute top-[200px] w-px h-[500px] bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-30 md:opacity-40"></div>
          
          {/* Floating Stars */}
          <div className="absolute top-[280px] -left-1.5 text-indigo-400 opacity-40 md:opacity-60">
            <FourPointStar className="w-2.5 h-2.5 md:w-3 h-3" />
          </div>
          <div className="absolute top-[450px] -left-1 text-slate-300">
            <FourPointStar className="w-1.5 h-1.5 md:w-2 h-2" />
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent opacity-80"></div>
      </div>

      {/* Navigation - Logo Only */}
      <nav className="relative z-10 w-full px-6 py-6 md:px-12 flex justify-center md:justify-start">
        <div className="font-urbanist font-bold text-lg md:text-xl tracking-tight text-slate-900">
          Veridex
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-8 sm:pt-16 md:pt-24 text-center max-w-5xl mx-auto">
        
        {/* Qualifier Tag with Star Border Animation */}
        <div className="mb-6 sm:mb-8">
            <StarBorder 
                as="div"
                className="relative z-10 inline-flex items-center justify-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white shadow-sm"
                color="#6366F1"
                speed="12s"
                withTrail={false}
            >
                <span className="font-inter text-[10px] sm:text-[11px] md:text-[13px] font-medium text-slate-500 tracking-wide uppercase">
                Not for beginners
                </span>
                <div className="mx-2 sm:mx-3 text-indigo-500">
                    <FourPointStar className="w-2.5 h-2.5 sm:w-3 h-3" />
                </div>
                <span className="font-inter text-[10px] sm:text-[11px] md:text-[13px] font-medium text-slate-500 tracking-wide">
                Manual Review
                </span>
            </StarBorder>
        </div>

        {/* Headline */}
        <h1 className="font-urbanist font-bold text-3xl sm:text-4xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-tight text-slate-900 mb-6 max-w-4xl drop-shadow-sm">
          Trusted work experience — <br className="hidden sm:block" />
          before you graduate.
        </h1>

        {/* Subheadline */}
        <p className="font-inter text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-8 sm:mb-10 px-4 sm:px-0">
          Veridex is a vetted platform for final-year university students with task-ready skills to complete paid tasks and earn employer trust before graduation.
        </p>

        {/* Primary CTA */}
        <button 
            onClick={onApply}
            className="group relative overflow-hidden rounded-lg bg-[#2C2E3E] px-6 sm:px-8 py-3 sm:py-3.5 transition-all hover:bg-[#1f202b] active:scale-[0.98] shadow-lg shadow-indigo-500/10 w-full sm:w-auto">
          <span className="relative z-10 font-inter font-medium text-white flex items-center justify-center gap-2">
            Apply for Access
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </button>

        {/* Secondary Muted Text */}
        <div className="mt-8 flex flex-col items-center gap-1.5">
            <p className="font-inter text-xs sm:text-sm text-slate-400">
                Don’t have work samples yet?
            </p>
            <button 
                onClick={onWaitlist}
                className="font-inter text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border-b border-slate-200 hover:border-slate-800 pb-0.5"
            >
                Join the preparation program waitlist
            </button>
        </div>
      </main>
    </div>
  );
};
