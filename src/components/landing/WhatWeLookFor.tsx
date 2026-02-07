import React from 'react';
import { ArrowRight } from 'lucide-react';

export const WhatWeLookFor = ({ onApply, onWaitlist }: { onApply?: () => void, onWaitlist?: () => void }) => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 text-center">
        
        <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-6 tracking-tight px-4">
            We are looking for evidence, not potential.
        </h2>
        
        <p className="font-inter text-base sm:text-lg text-slate-500 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Veridex is an exclusionary network. We only accept students who can demonstrate commercial-grade skills today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-left mb-12 sm:mb-16">
            <div className="bg-[#F8F8F8] p-6 sm:p-8 rounded-xl border border-slate-100 flex flex-col h-full">
                <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900 mb-4">
                    Who qualifies?
                </h3>
                <ul className="space-y-3 flex-1">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-600">Final-year students (Class of 2026)</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-600">Students with a live portfolio or Github</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-600">Students ready to ship production code/design</span>
                    </li>
                </ul>
            </div>

            <div className="bg-[#F8F8F8] p-6 sm:p-8 rounded-xl border border-slate-100 flex flex-col h-full">
                <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900 mb-4">
                    Who doesn't?
                </h3>
                <ul className="space-y-3 flex-1">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-500">First or second year students</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-500">Students "willing to learn" but without skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                        <span className="font-inter text-sm sm:text-base text-slate-500">Students looking for a summer internship</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <button 
                onClick={onApply}
                className="group relative overflow-hidden rounded-lg bg-[#2C2E3E] px-8 py-4 transition-all hover:bg-[#1f202b] active:scale-[0.98] shadow-xl shadow-indigo-500/10 w-full sm:w-auto"
            >
                <span className="relative z-10 font-inter font-medium text-white flex items-center justify-center gap-2">
                    Start Application
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </span>
            </button>
            <button 
                onClick={onWaitlist}
                className="px-8 py-4 rounded-lg border border-slate-200 text-slate-600 font-inter font-medium hover:bg-slate-50 transition-colors w-full sm:w-auto hover:text-slate-900 bg-white"
            >
                Join the preparation program waitlist
            </button>
        </div>

      </div>
    </section>
  );
};
