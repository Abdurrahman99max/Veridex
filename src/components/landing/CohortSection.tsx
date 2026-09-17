import React from 'react';
import { ArrowRight, Clock, Sparkles, GraduationCap } from 'lucide-react';

interface Props { onApply?: () => void; onWaitlist?: () => void; }

export const CohortSection: React.FC<Props> = ({ onApply, onWaitlist }) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F9FB] border border-[#E2E6ED] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0BE149]" />
          <span className="font-inter text-xs font-semibold tracking-widest uppercase text-[#6B7F94]">Choose Your Track</span>
        </div>
        <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1825] tracking-tight">Which track are you on?</h2>
        <p className="font-inter text-[#6B7F94] mt-3 max-w-2xl mx-auto">Cohort 01 — <span className="font-semibold text-[#08307F]">38 of 50</span> spots filled. 12 spots remaining — applications close soon.</p>
        <div className="w-full max-w-md mx-auto h-2 rounded-full bg-[#E2E6ED] overflow-hidden mt-6">
          <div className="h-full bg-[#08307F]" style={{width:'76%'}} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left mt-12">
          {/* Core */}
          <div className="rounded-2xl border-2 border-[#08307F] bg-white p-6 sm:p-8 shadow-xl shadow-[#08307F]/5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#0BE149]" />
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#08307F] text-white">Cohort 01</span>
              <span className="font-inter text-xs text-[#9AAABB]">Spots remaining • 12 left</span>
            </div>
            <h3 className="font-urbanist font-bold text-xl text-[#0D1825]">Veridex Core</h3>
            <p className="font-inter text-sm text-[#4A5D70] mt-2 leading-relaxed">
              For Class of 2026 students with demonstrable, task-ready skills. Apply now and claim your spot in the first cohort of verified talent.
            </p>
            <ul className="mt-6 space-y-2.5">
              {['GitHub & live apps','Figma & shipped UI','Case studies & metrics','Published work'].map(i=>(
                <li key={i} className="flex items-center gap-2 font-inter text-sm text-[#0D1825]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0BE149]" /> {i}
                </li>
              ))}
            </ul>
            <button onClick={onApply} className="mt-8 w-full py-3.5 rounded-xl bg-[#08307F] text-white font-inter font-semibold hover:bg-[#041D50] transition flex items-center justify-center gap-2">
              Claim your spot <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Prep */}
          <div className="rounded-2xl border border-[#E2E6ED] bg-[#F8F9FB] p-6 sm:p-8">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E6ED] flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-[#08307F]" />
            </div>
            <h3 className="font-urbanist font-bold text-xl text-[#0D1825]">Build Your Way to Verification</h3>
            <p className="font-inter text-sm text-[#4A5D70] mt-2 leading-relaxed">
              Building toward verification? The Preparation Track gives you a structured roadmap, clear milestones and a direct path into Veridex Core the moment you qualify.
            </p>
            <div className="mt-6 bg-white rounded-xl border border-[#E2E6ED] p-4">
              <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">Roadmap includes</p>
              <ul className="mt-2 space-y-2">
                {['Portfolio review checklist','Mini-task simulations','Feedback on 1 real submission'].map(i=>(
                  <li key={i} className="flex items-center gap-2 font-inter text-sm text-[#4A5D70]">
                    <Clock className="w-3.5 h-3.5 text-[#9AAABB]" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onWaitlist} className="mt-6 w-full py-3.5 rounded-xl bg-white border border-[#08307F] text-[#08307F] font-inter font-semibold hover:bg-[#08307F] hover:text-white transition flex items-center justify-center gap-2">
              Start your roadmap <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
