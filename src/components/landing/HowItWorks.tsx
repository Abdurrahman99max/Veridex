import React from 'react';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Lock } from 'lucide-react';

export const HowItWorks = ({ onApply }: { onApply?: () => void }) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden">
        {/* Background Grid Pattern (Subtle) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-20 md:mb-24 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-6">
            <span className="font-inter text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wider uppercase">Process Declaration</span>
          </div>
          <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-5xl text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
            How Veridex Works
          </h2>
          <p className="font-inter text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed">
            A selective process built on <span className="text-slate-900 font-medium">proof</span>, <span className="text-slate-900 font-medium">performance</span>, and <span className="text-slate-900 font-medium">trust</span>.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16 sm:mb-24">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[24px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10"></div>
            
            {/* Step 1: Apply */}
            <div className="group relative flex flex-col h-full">
                {/* Badge Container */}
                <div className="flex justify-center md:justify-start md:ml-8 mb-6 sm:mb-8 relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center font-urbanist font-bold text-base sm:text-lg shadow-sm z-10 group-hover:border-slate-300 group-hover:text-slate-600 transition-colors duration-300">
                        1
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-full hover:border-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 sm:p-8 pb-5 sm:pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-md bg-slate-50 border border-slate-100 text-slate-500">
                                <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900">Apply</h3>
                        </div>
                        <p className="font-inter text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                            Submit verified student details and proof of task-ready skills.
                        </p>
                        <ul className="space-y-2.5 sm:space-y-3">
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                Student verification
                            </li>
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                Portfolio submission
                            </li>
                        </ul>
                    </div>
                    
                    {/* Technical Footer */}
                    <div className="bg-slate-50/50 border-t border-slate-100 p-3 sm:p-4 px-6 sm:px-8">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400 font-mono uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            Open Entry
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2: Verify (Highlighted) */}
            <div className="group relative flex flex-col h-full">
                 {/* Badge Container */}
                 <div className="flex justify-center md:justify-start md:ml-8 mb-6 sm:mb-8 relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2C2E3E] text-white flex items-center justify-center font-urbanist font-bold text-base sm:text-lg shadow-lg shadow-indigo-500/20 z-10 ring-4 ring-white">
                        2
                    </div>
                </div>

                 <div className="bg-white border border-indigo-100 rounded-2xl flex flex-col h-full shadow-xl shadow-indigo-500/5 overflow-hidden relative">
                    {/* Active Indicator Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500"></div>

                    <div className="p-6 sm:p-8 pb-5 sm:pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600">
                                <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900">Verify</h3>
                        </div>
                        <p className="font-inter text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                            We rigorously assess skill readiness and reliability before approval.
                        </p>
                        <ul className="space-y-2.5 sm:space-y-3">
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                Skill proof review
                            </li>
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                Availability check
                            </li>
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                Manual approval
                            </li>
                        </ul>
                    </div>
                    
                    {/* Technical Footer */}
                    <div className="bg-indigo-50/30 border-t border-indigo-50 p-3 sm:p-4 px-6 sm:px-8 flex justify-between items-center">
                         <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-indigo-600 font-mono uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Strict Filter
                        </div>
                        <Lock className="w-3 h-3 text-indigo-400" />
                    </div>
                </div>
            </div>

            {/* Step 3: Work */}
            <div className="group relative flex flex-col h-full">
                 {/* Badge Container */}
                 <div className="flex justify-center md:justify-start md:ml-8 mb-6 sm:mb-8 relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center font-urbanist font-bold text-base sm:text-lg shadow-sm z-10 group-hover:border-slate-300 group-hover:text-slate-600 transition-colors duration-300">
                        3
                    </div>
                </div>

                 <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-full hover:border-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 sm:p-8 pb-5 sm:pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-md bg-slate-50 border border-slate-100 text-slate-500">
                                <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900">Work & Trust</h3>
                        </div>
                        <p className="font-inter text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                            Complete paid tasks within 7 days to earn employer trust.
                        </p>
                        <ul className="space-y-2.5 sm:space-y-3">
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                Real company tasks
                            </li>
                             <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-inter">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                Reliability tiers
                            </li>
                        </ul>
                    </div>
                    
                    {/* Technical Footer */}
                    <div className="bg-slate-50/50 border-t border-slate-100 p-3 sm:p-4 px-6 sm:px-8">
                         <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400 font-mono uppercase tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            Earned Access
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Closing & CTA */}
        <div className="text-center max-w-2xl mx-auto px-4">
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="font-inter text-slate-500 font-medium mb-6 sm:mb-8 text-base sm:text-lg">
            Veridex is designed to convert real skills into trusted work experience — <span className="text-slate-900">before graduation.</span>
          </p>
          <button 
            onClick={onApply}
            className="group relative overflow-hidden rounded-lg bg-[#2C2E3E] px-8 py-3.5 transition-all hover:bg-[#1f202b] active:scale-[0.98] shadow-lg shadow-indigo-500/10 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="font-inter font-medium text-white">Apply for Access</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
