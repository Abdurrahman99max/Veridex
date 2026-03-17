import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ApplicationLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  children,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-[#EEF2F7] flex flex-col items-center pt-8 sm:pt-20 px-4 sm:px-6 pb-20 overflow-x-hidden relative">
      <div className="w-full max-w-xl mx-auto">
        {/* Navigation / Progress */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 min-h-[24px]">
            {onBack ? (
                <button 
                    onClick={onBack}
                    className="group flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors font-inter text-xs font-medium cursor-pointer py-2 -ml-2 px-2"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>
            ) : (
                <div />
            )}
            
            <span className="font-mono text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-widest">
                Step {currentStep} of {totalSteps}
            </span>
        </div>

        {/* Header */}
        <h2 className="font-urbanist font-bold text-xl sm:text-2xl md:text-3xl text-slate-900 mb-6 sm:mb-10 tracking-tight leading-tight">
          {title}
        </h2>

        {/* Content */}
        <div className="w-full">
            {children}
        </div>
      </div>
    </div>
  );
};