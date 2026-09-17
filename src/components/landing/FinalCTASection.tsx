import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props { onApply?: () => void }

export const FinalCTASection: React.FC<Props> = ({ onApply }) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8F9FB] border-t border-[#E2E6ED] text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E6ED] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#0BE149]" />
          <span className="font-inter text-xs font-semibold tracking-widest uppercase text-[#6B7F94]">Don't Wait</span>
        </div>
        <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1825] tracking-tight">
          Your verified profile is waiting.
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#6B7F94] mt-4 leading-relaxed">
          Apply now and join the first cohort of students that employers can actually trust. Cohort 01 matching begins soon.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onApply} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#08307F] text-white font-inter font-semibold hover:bg-[#041D50] transition flex items-center justify-center gap-2 shadow-lg">
            Get Verified <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onApply} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-[#E2E6ED] text-[#08307F] font-inter font-semibold hover:bg-[#F8F9FB] transition">
            Learn how verification works →
          </button>
        </div>
        <p className="font-inter text-xs text-[#9AAABB] mt-4">12 spots remaining • Applications close soon</p>
      </div>
    </section>
  );
};
