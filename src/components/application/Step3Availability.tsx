import React, { useState } from 'react';
import { ArrowRight, Check, Clock, Minus, Plus } from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';

interface Step3Props {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export const Step3Availability: React.FC<Step3Props> = ({ onBack, onSubmit }) => {
  const [hours, setHours] = useState(2);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (agreed && hours >= 2 && hours <= 5) {
      setIsSubmitting(true);
      // Simulate network request
      setTimeout(() => {
        onSubmit({ hours, agreed });
      }, 1000);
    }
  };

  return (
    <ApplicationLayout currentStep={3} totalSteps={3} title="Availability & Commitment" onBack={onBack}>
      <div className="space-y-10">
        
        {/* Availability Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="font-urbanist font-bold text-lg text-slate-900">
                    Weekly Availability
                </h3>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all hover:border-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <label className="block font-urbanist font-bold text-base text-slate-900">
                            Commitment Level
                        </label>
                        <p className="text-sm text-slate-500 font-inter leading-relaxed max-w-sm">
                            Select your weekly capacity. Tasks are strictly time-bound.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm ring-1 ring-slate-900/5">
                            <button 
                                onClick={() => setHours(Math.max(2, hours - 1))}
                                className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 ${
                                    hours <= 2 
                                        ? 'text-slate-200 cursor-not-allowed' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95'
                                }`}
                                disabled={hours <= 2}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            
                            <div className="w-24 text-center">
                                <span className="block font-urbanist font-bold text-2xl text-slate-900 tracking-tight">
                                    {hours}
                                </span>
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Hours
                                </span>
                            </div>

                            <button 
                                onClick={() => setHours(Math.min(5, hours + 1))}
                                className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 ${
                                    hours >= 5 
                                        ? 'text-slate-200 cursor-not-allowed' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95'
                                }`}
                                disabled={hours >= 5}
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Commitment Section */}
        <div className="space-y-4">
            <h3 className="font-urbanist font-bold text-lg text-slate-900">
                Commitment
            </h3>
            
            <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors group bg-white">
                <div className="relative flex items-center mt-1">
                    <input 
                        type="checkbox" 
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-[#2C2E3E] checked:border-[#2C2E3E] transition-all"
                    />
                    <Check className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="space-y-3 pt-0.5">
                    <p className="font-inter text-sm font-medium text-slate-900">
                        I confirm my understanding of the following:
                    </p>
                    <ul className="space-y-2">
                        <li className="text-sm text-slate-600 font-inter leading-relaxed flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            I understand that tasks assigned to me are based on my submitted proof.
                        </li>
                        <li className="text-sm text-slate-600 font-inter leading-relaxed flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            I accept full responsibility for completing tasks on time.
                        </li>
                        <li className="text-sm text-slate-600 font-inter leading-relaxed flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            I understand that repeated failure will reduce my visibility and may result in removal from the platform.
                        </li>
                    </ul>
                </div>
            </label>
        </div>

        {/* Legal Disclosure */}
        <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500 font-inter leading-relaxed border border-slate-100">
            <p className="font-medium text-slate-700 mb-1">Legal Disclosure</p>
            Veridex assigns tasks based on verified skills. Failure to complete tasks within deadlines constitutes a breach of commitment. Decisions are final and performance-based.
        </div>

        {/* Action Bar */}
        <div className="pt-2">
            <button 
                onClick={handleSubmit}
                disabled={!agreed || isSubmitting}
                className={`
                    w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-all duration-200
                    ${agreed && !isSubmitting
                        ? 'bg-[#2C2E3E] text-white hover:bg-[#1f202b] shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }
                `}
            >
                {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                ) : (
                    <>
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>

      </div>
    </ApplicationLayout>
  );
};
