import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PrepStep3Props {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export const PrepStep3Commitment: React.FC<PrepStep3Props> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    studyHours: '',
    primaryGoal: '',
  });
  
  const [agreements, setAgreements] = useState({
    noGuarantee: false,
    consistentEffort: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allAgreed = Object.values(agreements).every(Boolean);
  const isFormValid = formData.studyHours && formData.primaryGoal && allAgreed;

  const handleSubmit = () => {
    if (isFormValid) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSubmit({ ...formData, agreements });
      }, 1000);
    }
  };

  return (
    <ApplicationLayout currentStep={3} totalSteps={3} title="Commitment Signal" onBack={onBack}>
      <div className="space-y-10">
        
        {/* Supporting Copy */}
        <div className="space-y-1 mb-6">
            <h1 className="font-urbanist font-bold text-2xl md:text-3xl text-slate-900">
                Read carefully before submitting
            </h1>
            <div className="space-y-2 mt-2">
                <p className="font-inter text-slate-500 leading-relaxed">
                    Veridex’s Preparation Track is designed for students who are willing to commit time and effort to becoming task-ready.
                </p>
                <p className="font-inter font-medium text-slate-700 leading-relaxed">
                    This is not a guaranteed path into Veridex Core. Students who complete the program and demonstrate task-ready capability will be prioritized for Core access.
                </p>
            </div>
        </div>

        <div className="space-y-6">
             {/* Study Capacity */}
            <div className="space-y-3">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Weekly time you can realistically commit
                </label>
                <Select onValueChange={(val) => handleSelectChange('studyHours', val)} value={formData.studyHours}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Hours" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="less_3">Less than 3 hours</SelectItem>
                        <SelectItem value="3_5">3–5 hours</SelectItem>
                        <SelectItem value="5_10">5–10 hours</SelectItem>
                        <SelectItem value="10_plus">10+ hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Primary Goal */}
             <div className="space-y-3">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    What is your primary goal after completing the preparation track?
                </label>
                <Select onValueChange={(val) => handleSelectChange('primaryGoal', val)} value={formData.primaryGoal}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Goal" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apply_core">Apply to Veridex Core</SelectItem>
                        <SelectItem value="employable">Become employable for internships or freelance work</SelectItem>
                        <SelectItem value="portfolio">Build a real portfolio</SelectItem>
                        <SelectItem value="not_sure">I’m not sure yet</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Commitment Checkboxes */}
        <div className="space-y-4 pt-2">
            <h3 className="font-urbanist font-bold text-lg text-slate-900">
                Commitment confirmation
            </h3>
            
            <div className="space-y-3">
                {[
                    { key: 'noGuarantee', text: "I understand this does not guarantee acceptance into Veridex Core" },
                    { key: 'consistentEffort', text: "I am willing to put in consistent effort to improve my skills" }
                ].map((item) => (
                    <label key={item.key} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors group bg-white">
                        <div className="relative flex items-center mt-1">
                            <input 
                                type="checkbox" 
                                checked={agreements[item.key as keyof typeof agreements]}
                                onChange={() => toggleAgreement(item.key as keyof typeof agreements)}
                                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-[#2C2E3E] checked:border-[#2C2E3E] transition-all"
                            />
                            <Check className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <p className="font-inter text-sm text-slate-700 leading-relaxed pt-0.5">
                            {item.text}
                        </p>
                    </label>
                ))}
            </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4">
            <button 
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`
                    w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-all duration-200
                    ${isFormValid && !isSubmitting
                        ? 'bg-[#2C2E3E] text-white hover:bg-[#1f202b] shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }
                `}
            >
                {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                ) : (
                    <>
                        Join the Preparation Track Waitlist
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>

      </div>
    </ApplicationLayout>
  );
};