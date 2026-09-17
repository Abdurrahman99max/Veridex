import React from 'react';
import { Check, Clock, Award, TrendingUp, ShieldCheck } from 'lucide-react';

interface Props { onApply?: () => void }

export const ReliabilitySection: React.FC<Props> = ({ onApply }) => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8F9FB] border-y border-[#E2E6ED]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Profile card */}
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img src="https://i.pravatar.cc/120?img=12" alt="Alex Johnson" className="w-14 h-14 rounded-full object-cover" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0BE149] border-2 border-white flex items-center justify-center">
                  <Check size={10} strokeWidth={3} className="text-[#07A334]" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-urbanist font-bold text-[#0D1825]">Alex Johnson</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D4FCE3] text-[#07A334] border border-[#0BE149]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0BE149]" /> VERIFIED
                  </span>
                </div>
                <p className="font-inter text-sm text-[#6B7F94] mt-1">Frontend Developer • Class of 2026</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['React','TypeScript','Tailwind'].map(t=> <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F2F6] text-[#08307F] border border-[#E2E6ED]">{t}</span>)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E2E6ED]">
              {[{k:'Applications',v:'8'},{k:'Interviews',v:'3'},{k:'Offers',v:'2'}].map(s=>(
                <div key={s.k} className="text-center">
                  <p className="font-urbanist font-bold text-lg text-[#08307F]">{s.v}</p>
                  <p className="font-inter text-xs text-[#9AAABB]">{s.k}</p>
                </div>
              ))}
            </div>
            {/* Company notice */}
            <div className="mt-6 bg-[#F8F9FB] rounded-xl border border-[#E2E6ED] p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E6ED] flex items-center justify-center shrink-0">
                <span className="font-urbanist font-bold text-xs text-[#08307F]">TC</span>
              </div>
              <div>
                <p className="font-inter text-xs font-semibold text-[#0D1825]">TechCorp • 2 hours ago</p>
                <p className="font-inter text-xs text-[#6B7F94] mt-0.5">Viewed your verified Veridex profile and wants to discuss a Frontend Developer role</p>
                <button onClick={onApply} className="font-inter text-xs font-semibold text-[#08307F] mt-2 hover:underline">View opportunity →</button>
              </div>
            </div>
          </div>

          {/* Right: Reliability */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E6ED] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0BE149] animate-pulse" />
              <span className="font-inter text-xs font-semibold text-[#6B7F94] uppercase tracking-wider">Verified Reliability</span>
            </div>
            <h2 className="font-urbanist font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1825] tracking-tight">Every task builds your record.</h2>
            <p className="font-inter text-[#4A5D70] mt-4 leading-relaxed">
              Every task you complete builds your reliability rating. A live record of delivery, quality and time management that grows with every company you work with.
            </p>

            <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">Reliability Score</p>
                  <p className="font-urbanist font-bold text-3xl text-[#0D1825] mt-1">94% <span className="text-sm font-medium text-[#07A334]">High Reliability</span></p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#D4FCE3] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#07A334]" />
                </div>
              </div>
              {[
                {label:'Delivery Reliability', value:96},
                {label:'Output Quality', value:92},
                {label:'Consistency of Execution', value:94},
              ].map(r=>(
                <div key={r.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-inter text-xs font-semibold text-[#4A5D70]">{r.label}</span>
                    <span className="font-inter text-xs font-semibold text-[#08307F]">{r.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E2E6ED] overflow-hidden">
                    <div className="h-full rounded-full bg-[#0BE149]" style={{width:`${r.value}%`}} />
                  </div>
                </div>
              ))}
              <p className="font-inter text-xs text-[#9AAABB] mt-4">Based on verified performance across real work submissions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
