import React from 'react';
import { ArrowRight, Check, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { StarBorder } from './StarBorder';

export const WhoIsThisFor = ({ onApply }: { onApply?: () => void }) => {
  return (
    <section className="bg-[#F8F8F8] py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-slate-200/60 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-slate-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-50/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span className="font-inter text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Selection Criteria</span>
          </div>
          <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight mb-4 px-4">
            Veridex is not for everyone.
          </h2>
          <p className="font-inter text-slate-500 text-base sm:text-lg px-4">
            We prioritize quality over quantity. Review the criteria below before applying.
          </p>
        </div>

        {/* Two Card Layout - Equal Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* Left Card - For You (Positive) */}
            <StarBorder color="#6366F1" speed="12s" className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
                <div className="h-full p-6 sm:p-8 flex flex-col relative z-10">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-900">This is for you if...</h3>
                            <p className="font-inter text-xs sm:text-sm text-slate-400">You are ready to work.</p>
                        </div>
                    </div>

                    <ul className="space-y-3 sm:space-y-4 flex-1">
                        <ListItem positive icon={<Check className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />}>
                            You’re a final-year university student
                        </ListItem>
                        <ListItem positive icon={<Check className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />}>
                            You already have task-ready skills
                        </ListItem>
                        <ListItem positive icon={<Check className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />}>
                            You can show real proof of work (projects, portfolios)
                        </ListItem>
                        <ListItem positive icon={<Check className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />}>
                            You want paid tasks that translate into experience
                        </ListItem>
                        <ListItem positive icon={<Check className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />}>
                            You care about reputation and employer trust
                        </ListItem>
                    </ul>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                        </div>
                        <p className="font-inter text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">
                            Manual Review Required
                        </p>
                    </div>
                </div>
            </StarBorder>

            {/* Right Card - Not For You (Negative) */}
            <div className="h-full rounded-2xl bg-slate-50 border border-slate-200/60 transition-colors hover:border-slate-300">
                <div className="h-full p-6 sm:p-8 flex flex-col relative z-10">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h3 className="font-urbanist font-bold text-lg sm:text-xl text-slate-500">This is not for you if...</h3>
                            <p className="font-inter text-xs sm:text-sm text-slate-400">You are still learning.</p>
                        </div>
                    </div>

                    <ul className="space-y-3 sm:space-y-4 flex-1">
                        <ListItem icon={<X className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-500" />}>
                            You’re still learning and don’t have work samples
                        </ListItem>
                        <ListItem icon={<X className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-500" />}>
                            You’re looking for internships or coursework
                        </ListItem>
                        <ListItem icon={<X className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-500" />}>
                            You’re not in your final year
                        </ListItem>
                        <ListItem icon={<X className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-500" />}>
                            You’re not ready to commit 2–5 focused hours per task
                        </ListItem>
                        <ListItem icon={<X className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-500" />}>
                            You’re expecting guaranteed tasks without proof
                        </ListItem>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-slate-200/50">
                         <p className="font-inter text-xs sm:text-sm text-slate-400 leading-relaxed">
                            <span className="font-medium text-slate-500">Note:</span> We’re building a preparation program for students who aren't ready yet.
                         </p>
                    </div>
                </div>
            </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center text-center px-4">
            <button 
                onClick={onApply}
                className="group relative overflow-hidden rounded-lg bg-[#2C2E3E] px-8 py-3.5 transition-all hover:bg-[#1f202b] active:scale-[0.98] shadow-lg shadow-indigo-500/10 mb-4 w-full sm:w-auto"
            >
                <span className="relative z-10 font-inter font-medium text-white flex items-center justify-center gap-2">
                    Apply for Access
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </span>
            </button>
            <p className="font-inter text-[11px] sm:text-sm text-slate-400">
                Applications without proof of skill will be declined.
            </p>
        </div>
      </div>
    </section>
  );
};

// Helper Component for List Items
const ListItem = ({ children, positive = false, icon }: { children: React.ReactNode, positive?: boolean, icon: React.ReactNode }) => (
  <li className="flex items-start gap-2.5 sm:gap-3 p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 rounded-lg transition-colors hover:bg-slate-50/50">
    <div className={`mt-0.5 w-4.5 h-4.5 sm:w-5 sm:h-5 flex-shrink-0 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] ${positive ? 'bg-slate-900 shadow-sm' : 'bg-slate-200'}`}>
        {icon}
    </div>
    <span className={`font-inter text-sm sm:text-[15px] leading-relaxed ${positive ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
      {children}
    </span>
  </li>
);
