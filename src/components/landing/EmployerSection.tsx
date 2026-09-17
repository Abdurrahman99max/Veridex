import React from 'react';
import { Building2, ShieldCheck, Users, ArrowRight, Check } from 'lucide-react';

interface Props { onApply?: () => void }

export const EmployerSection: React.FC<Props> = ({ onApply }) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#08307F] text-white relative overflow-hidden">
      {/* accent glow */}
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-[#0BE149]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-4">
              <Building2 className="w-3.5 h-3.5 text-[#0BE149]" />
              <span className="font-inter text-xs font-semibold tracking-widest uppercase text-white/80">For Employers</span>
            </div>
            <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">Hire talent you can actually trust.</h2>
            <p className="font-inter text-white/70 mt-4 leading-relaxed">
              No more CV roulette. Every student is reviewed before you see them.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {title:'No more wasted interviews.', desc:'Verified means task-ready from day one.'},
                {title:'No more uncertainty.', desc:'We verify identity, review proof of work and confirm job-readiness.'},
                {title:'No more assumptions.', desc:'See real work, evaluation breakdowns and reliability signals.'},
              ].map((item, i)=>(
                <div key={item.title} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0BE149] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-urbanist font-bold text-xs text-[#08307F]">{i+1}</span>
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-white text-sm">{item.title}</p>
                    <p className="font-inter text-sm text-white/60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onApply} className="mt-8 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0BE149] text-[#08307F] font-inter font-bold hover:bg-[#0AD13F] transition flex items-center justify-center gap-2">
              Register your company <ArrowRight className="w-4 h-4" />
            </button>
            <p className="font-inter text-xs text-white/50 mt-3">Hiring Partners for Cohort 01 being selected now.</p>
          </div>

          {/* How you get verified — mini steps */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-[#0D1825]">
            <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">How You Get Verified</p>
            <h3 className="font-urbanist font-bold text-xl text-[#0D1825] mt-2">For Students — 3 Steps</h3>
            <div className="mt-6 space-y-5">
              {[
                {n:1, t:'Submit Your Work', d:'Provide real projects or tasks that reflect your ability.'},
                {n:2, t:'We Evaluate Your Work', d:'Assessed across defined criteria by the Veridex system.'},
                {n:3, t:'Get Your Verified Outcome', d:'Receive a verified profile that reflects capability.'},
              ].map(s=>(
                <div key={s.n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#08307F] text-white flex items-center justify-center font-urbanist font-bold text-sm shrink-0">{s.n}</div>
                  <div>
                    <p className="font-inter font-semibold text-sm text-[#0D1825]">{s.t}</p>
                    <p className="font-inter text-sm text-[#6B7F94] mt-1">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#E2E6ED]">
              <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">For Employers — 3 Steps</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {['Access Candidates','Review Evidence','Confident Hire'].map(l=>(
                  <div key={l} className="bg-[#F8F9FB] rounded-xl border border-[#E2E6ED] p-3">
                    <Check className="w-4 h-4 text-[#07A334] mx-auto" />
                    <p className="font-inter text-xs font-semibold text-[#0D1825] mt-1.5 leading-tight">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
