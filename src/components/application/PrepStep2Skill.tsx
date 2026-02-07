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

interface PrepStep2Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

export const PrepStep2Skill: React.FC<PrepStep2Props> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    primarySkill: '',
    otherSkill: '',
    currentLevel: '',
    learningMethods: [] as string[],
  });

  const handleSkillChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      primarySkill: value,
      otherSkill: value !== 'other' ? '' : prev.otherSkill 
    }));
  };

  const handleOtherSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, otherSkill: e.target.value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, currentLevel: value }));
  };

  const toggleLearningMethod = (method: string) => {
    setFormData(prev => {
      const current = prev.learningMethods;
      if (current.includes(method)) {
        return { ...prev, learningMethods: current.filter(m => m !== method) };
      } else {
        return { ...prev, learningMethods: [...current, method] };
      }
    });
  };

  const isSkillValid = formData.primarySkill && (formData.primarySkill !== 'other' || formData.otherSkill.trim().length > 0);
  const isLevelValid = formData.currentLevel.trim().length > 0;
  const isLearningValid = formData.learningMethods.length > 0;

  const isValid = isSkillValid && isLevelValid && isLearningValid;

  const learningOptions = [
    { id: 'online_courses', label: 'Online courses' },
    { id: 'youtube', label: 'YouTube / self-study' },
    { id: 'school', label: 'School curriculum' },
    { id: 'projects', label: 'Practice projects' },
    { id: 'not_active', label: 'Not actively learning yet' },
  ];

  return (
    <ApplicationLayout currentStep={2} totalSteps={3} title="Skill Direction" onBack={onBack}>
      <div className="space-y-8">
        
        {/* Supporting Copy */}
        <div className="space-y-1 mb-6">
            <h1 className="font-urbanist font-bold text-2xl md:text-3xl text-slate-900">
                What do you want to become task-ready in?
            </h1>
            <p className="font-inter text-slate-500 leading-relaxed">
                Choose the skill you are actively committing to improve.
                This helps us design the preparation program.
            </p>
        </div>

        <div className="space-y-8">
            {/* Primary Skill */}
            <div className="space-y-3">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Primary Skill You Want to Develop
                </label>
                <Select onValueChange={handleSkillChange} value={formData.primarySkill}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ui_ux">UI/UX Design</SelectItem>
                        <SelectItem value="software">Software Development</SelectItem>
                        <SelectItem value="copywriting">Copywriting</SelectItem>
                        <SelectItem value="marketing">Digital Marketing</SelectItem>
                        <SelectItem value="data">Data / Analytics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>

                {formData.primarySkill === 'other' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <input 
                            type="text"
                            value={formData.otherSkill}
                            onChange={handleOtherSkillChange}
                            placeholder="Please specify your skill..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Current Proficiency */}
            <div className="space-y-3">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Your current level in this skill
                </label>
                <Select onValueChange={handleLevelChange} value={formData.currentLevel}>
                    <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner (learning fundamentals)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (some projects, not client-ready)</SelectItem>
                        <SelectItem value="self_taught">Self-taught, no real projects yet</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Learning Methods */}
            <div className="space-y-3">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    How are you currently learning this skill?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {learningOptions.map((option) => (
                        <div 
                            key={option.id}
                            onClick={() => toggleLearningMethod(option.id)}
                            className={`
                                cursor-pointer flex items-center p-4 rounded-lg border transition-all duration-200
                                ${formData.learningMethods.includes(option.id)
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            <div className={`
                                w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors
                                ${formData.learningMethods.includes(option.id)
                                    ? 'bg-white border-white'
                                    : 'border-slate-300'
                                }
                            `}>
                                {formData.learningMethods.includes(option.id) && (
                                    <Check className="w-3.5 h-3.5 text-slate-900" />
                                )}
                            </div>
                            <span className="font-inter text-sm font-medium">
                                {option.label}
                            </span>
                        </div>
                    ))}
                </div>
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
