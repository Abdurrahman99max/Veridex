import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, ExternalLink, Info } from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Step2Props {
  onNext: (data: any) => void;
  onBack: () => void;
  skillCategory: string;
}

export const Step2SkillProof: React.FC<Step2Props> = ({ onNext, onBack, skillCategory }) => {
  // Normalize skill category for logic (handle custom inputs vs standard keys)
  const getSkillType = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('design')) return 'design';
    if (s.includes('dev') || s.includes('soft') || s.includes('engin')) return 'development';
    if (s.includes('content') || s.includes('writ') || s.includes('copy')) return 'content';
    return 'generic'; // Fallback for data, marketing, other, etc.
  };

  const skillType = getSkillType(skillCategory);

  const [formData, setFormData] = useState({
    link: '',
    projectType: '',
    explanation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, projectType: value }));
  };

  const isValid = formData.link.length > 5 && formData.projectType && formData.explanation.length > 20 && formData.explanation.split(' ').length <= 150;

  const handleSubmit = () => {
    if (isValid) {
      onNext(formData);
    }
  };

  // Content Configuration based on Skill Type
  const content = {
    design: {
      label: 'Figma Link',
      placeholder: 'https://www.figma.com/file/...',
      projectOptions: ['Landing page', 'Onboarding flow', 'Dashboard', 'Mobile App', 'Design System'],
      good: ['Link to a Figma file with 1–3 completed screens', 'Clear layout and user flow'],
      bad: ['“I’m currently learning UI/UX”', 'Empty or unfinished files', 'Inspiration-only mockups']
    },
    development: {
      label: 'GitHub Repo / Live Link',
      placeholder: 'https://github.com/username/repo',
      projectOptions: ['Full-stack App', 'Frontend Component', 'API / Backend Service', 'Mobile App', 'CLI Tool'],
      good: ['Clean, runnable code with a README', 'Live deployed demo'],
      bad: ['“Hello World” tutorials', 'Empty repositories', 'Broken links']
    },
    content: {
      label: 'Portfolio / Doc Link',
      placeholder: 'https://docs.google.com/...',
      projectOptions: ['Landing Page Copy', 'Blog Post / Article', 'Email Sequence', 'Social Media Campaign', 'Technical Documentation'],
      good: ['Published work with clear metrics', 'Professional tone and grammar'],
      bad: ['Unedited drafts', 'School essays', 'ChatGPT generated text without strategy']
    },
    generic: {
      label: 'Proof of Work Link',
      placeholder: 'https://...',
      projectOptions: ['Case Study', 'Live Project', 'Portfolio Item', 'Professional Certification', 'Other'],
      good: ['Tangible evidence of execution', 'Completed real-world examples'],
      bad: ['Theoretical knowledge only', 'Course completion certificates', 'Broken or inaccessible links']
    }
  }[skillType];

  return (
    <ApplicationLayout currentStep={2} totalSteps={3} title="Skill Proof" onBack={onBack}>
      <div className="space-y-10">
        
        {/* Dynamic Fields */}
        <div className="space-y-6">
            
            {/* Link Input */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    {content.label} <span className="text-slate-400 font-normal ml-1">(Public access required)</span>
                </label>
                <div className="relative">
                    <input 
                        type="url"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder={content.placeholder}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter"
                        autoFocus
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Project Type */}
            <div className="space-y-2">
                <label className="block font-inter text-sm font-medium text-slate-700">
                    Project Type
                </label>
                <div className="w-full">
                    <Select value={formData.projectType} onValueChange={handleProjectTypeChange}>
                      <SelectTrigger className="w-full px-4 py-6 bg-white border-slate-200 rounded-lg text-slate-900 focus:ring-slate-900/5 focus:border-slate-900 font-inter">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {content.projectOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <label className="block font-inter text-sm font-medium text-slate-700">
                        Explanation
                    </label>
                    <span className="text-xs text-slate-400 font-inter">Max 150 words</span>
                </div>
                <textarea 
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe one specific decision you made and why it demonstrates task readiness..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-inter resize-none"
                />
            </div>
        </div>

        {/* "What Good Looks Like" - Crucial Filter Section */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-slate-400" />
                <h4 className="font-urbanist font-bold text-sm text-slate-900 tracking-wide uppercase">
                    Evaluation Standards
                </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Acceptable */}
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wider border border-emerald-100 uppercase">
                        Acceptable
                    </span>
                    <ul className="space-y-2">
                        {content.good.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-inter leading-tight">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Unacceptable */}
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 text-rose-700 text-[11px] font-bold tracking-wider border border-rose-100 uppercase">
                        Unacceptable
                    </span>
                    <ul className="space-y-2">
                         {content.bad.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-inter leading-tight">
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="pt-2">
            <button 
                onClick={handleSubmit}
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
