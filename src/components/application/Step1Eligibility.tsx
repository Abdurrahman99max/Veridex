import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Step1Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

export const Step1Eligibility: React.FC<Step1Props> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    gradYear: '',
    skillCategory: '',
    customSkill: ''
  });

  const [isRejected, setIsRejected] = useState(false);

  const handleGradYearChange = (value: string) => {
    setFormData(prev => ({ ...prev, gradYear: value }));
    
    // Updated Logic:
    // 2026 -> Eligible (Final Year)
    // 2027, 2028, 2029+ -> Prep Track
    // 2024, 2025 -> Rejected (Already Graduated)
    if (value === '2024' || value === '2025') {
        setIsRejected(true);
    } else {
        setIsRejected(false);
    }
  };

  const handleSkillChange = (value: string) => {
    setFormData(prev => ({ ...prev, skillCategory: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (isRejected) return;

    const finalSkill = formData.skillCategory === 'other' ? formData.customSkill : formData.skillCategory;
    
    if (formData.fullName && formData.university && formData.gradYear && finalSkill) {
      onNext({ ...formData, skillCategory: finalSkill });
    }
  };

  const isSkillValid = formData.skillCategory === 'other' ? formData.customSkill.trim().length > 0 : formData.skillCategory !== '';
  const isValid = formData.fullName && formData.university && formData.gradYear !== '' && isSkillValid;

  if (isRejected) {
    return (
      <ApplicationLayout currentStep={1} totalSteps={3} title="Eligibility" onBack={onBack}>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-urbanist font-bold text-xl text-slate-900 mb-2">
            Eligibility Requirement
          </h3>
          <p className="font-inter text-slate-600 mb-6 leading-relaxed">
            Veridex is currently only accepting applications from current students.
            <br />
            Graduates (Class of 2024/2025) are not eligible for this cohort.
          </p>
          <button 
            onClick={() => {
                setFormData({ ...formData, gradYear: '' });
                setIsRejected(false);
            }}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 underline underline-offset-4"
          >
            Change Selection (Mistake)
          </button>
        </div>
      </ApplicationLayout>
    );
  }

  return (
    <ApplicationLayout currentStep={1} totalSteps={3} title="Eligibility & Identity" onBack={onBack}>
      <div className="space-y-8">
        
        {/* Full Name */}
        <div className="space-y-2">
            <label className="block font-inter text-sm font-medium text-slate-700">
                Full Name
            </label>
            <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alex Chen"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
                autoFocus
            />
        </div>

        {/* University */}
        <div className="space-y-2">
            <label className="block font-inter text-sm font-medium text-slate-700">
                University
            </label>
            <input 
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g. University of Waterloo"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graduation Year */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Graduation Year
                </label>
                <Select value={formData.gradYear} onValueChange={handleGradYearChange}>
                  <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024 (Graduated)</SelectItem>
                    <SelectItem value="2025">2025 (Graduated)</SelectItem>
                    <SelectItem value="2026">2026 (Final Year)</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="2029+">2029+</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Primary Skill Category */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Primary Skill Category
                </label>
                <Select value={formData.skillCategory} onValueChange={handleSkillChange}>
                  <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                    <SelectValue placeholder="Select Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Product Design</SelectItem>
                    <SelectItem value="development">Software Engineering</SelectItem>
                    <SelectItem value="content">Content Strategy</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="marketing">Growth Marketing</SelectItem>
                    <SelectItem value="product">Product Management</SelectItem>
                    <SelectItem value="sales">Sales / BD</SelectItem>
                    <SelectItem value="legal">Legal / Compliance</SelectItem>
                    <SelectItem value="finance">Finance / Accounting</SelectItem>
                    <SelectItem value="other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </div>

        {/* Custom Skill Input (Conditional) */}
        {formData.skillCategory === 'other' && (
             <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Specify Your Primary Skill
                </label>
                <input 
                    type="text"
                    name="customSkill"
                    value={formData.customSkill}
                    onChange={handleChange}
                    placeholder="e.g. 3D Motion Graphics"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
                    autoFocus
                />
            </div>
        )}

        {/* Action Bar */}
        <div className="pt-8">
            <button 
                onClick={handleContinue}
                disabled={!isValid}
                className={`
                    w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-all duration-200
                    ${isValid 
                        ? 'bg-[#2C2E3E] text-white hover:bg-[#1f202b] shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }
                `}
            >
                Continue
                {isValid && <ArrowRight className="w-4 h-4" />}
            </button>
        </div>

      </div>
    </ApplicationLayout>
  );
};
