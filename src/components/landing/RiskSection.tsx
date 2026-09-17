import React from 'react';
import { AlertTriangle, FileX, UserX, HelpCircle } from 'lucide-react';

export const RiskSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-white border-y border-[#E2E6ED]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D4183D]" />
            <span className="font-inter text-xs font-semibold tracking-widest uppercase text-[#D4183D]">The Problem</span>
          </div>
          <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1825] tracking-tight">
            CVs don't prove ability. They create risk.
          </h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: FileX, title: 'Skills are self-reported', desc: 'No way to verify what you claim on paper.' },
              { icon: UserX, title: 'Experience is hard to verify', desc: 'Employers can’t tell real work from coursework.' },
              { icon: HelpCircle, title: 'Hiring relies on assumptions', desc: 'Interviews waste time, bad hires cost trust.' },
            ].map(item=>(
              <div key={item.title} className="bg-[#F8F9FB] rounded-xl border border-[#E2E6ED] p-5">
                <item.icon className="w-5 h-5 text-[#6B7F94]" />
                <p className="font-inter font-semibold text-sm text-[#0D1825] mt-3">{item.title}</p>
                <p className="font-inter text-sm text-[#6B7F94] mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#08307F] rounded-xl p-5 sm:p-6 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#0BE149] flex items-center justify-center shrink-0">
              <span className="font-urbanist font-bold text-xs text-[#08307F]">✓</span>
            </div>
            <p className="font-inter text-sm text-white leading-relaxed">
              <span className="font-semibold">Veridex removes that uncertainty</span> through verified evaluation — we review identity, proof of work and job-readiness so employers see real skills, not claims.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
