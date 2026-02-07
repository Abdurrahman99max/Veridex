import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PrepStep1Props {
  onNext: (data: any) => void;
  onBack?: () => void;
}

export const PrepStep1Context: React.FC<PrepStep1Props> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    gradYear: '',
    motivation: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid = Object.values(formData).every(val => val.trim().length > 0);

  return (
    <ApplicationLayout currentStep={1} totalSteps={3} title="Context & Intent" onBack={onBack}>
      <div className="space-y-8">
        
        {/* Supporting Copy */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <h4 className="font-urbanist font-bold text-slate-900 text-sm mb-1">
                Preparation Track Application
            </h4>
            <div className="space-y-1">
              <p className="font-inter text-xs text-slate-500 leading-relaxed">
                  This track is for students who want to become task-ready before applying to Veridex.
              </p>
              <p className="font-inter text-xs text-slate-500 leading-relaxed font-medium">
                  This is not the Veridex Core application.
              </p>
            </div>
        </div>

        <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Full Name
                </label>
                <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleTextChange}
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
                    onChange={handleTextChange}
                    placeholder="e.g. University of Waterloo"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
                />
            </div>

            {/* Expected Graduation Year */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Expected Graduation Year
                </label>
                <Select onValueChange={(val) => handleChange('gradYear', val)}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029+">2029+</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Why are you applying to the Preparation Track?
                </label>
                <Select onValueChange={(val) => handleChange('motivation', val)}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Motivation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no_samples">I don’t have strong work samples yet</SelectItem>
                        <SelectItem value="need_structure">I’m still learning and need structure</SelectItem>
                        <SelectItem value="employable">I want to become employable before graduation</SelectItem>
                        <SelectItem value="rejected">I’ve been rejected and want to improve</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 flex gap-4">
            <button 
                onClick={() => onNext(formData)}
                disabled={!isValid}
                className={`
                    flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-all duration-200
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
