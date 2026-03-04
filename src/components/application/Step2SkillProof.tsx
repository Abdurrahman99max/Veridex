import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ExternalLink, 
  Code2, 
  Palette, 
  FileText, 
  BarChart3, 
  Zap,
  Lock,
  Terminal,
  Database,
  Briefcase,
  Coins,
  Settings,
  Scale,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import { GuidancePopover } from './GuidancePopover';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
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
  track: 'core' | 'prep';
}

type Domain = string | null;

export const Step2SkillProof: React.FC<Step2Props> = ({ onNext, onBack, skillCategory, track }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain>(null);
  const [hasInitialSet, setHasInitialSet] = useState(false);
  const [formData, setFormData] = useState({
    proofUrl: '',
    projectContext: '',
    rationale: '',
    confirmedOriginal: false,
    confirmedManualReview: true, 
    skillLevel: '',
    learningMethods: [] as string[],
    customSkill: ''
  });

  useEffect(() => {
    if (skillCategory && !hasInitialSet) {
      const knownIds = ['design', 'development', 'data', 'product', 'marketing', 'content', 'sales', 'finance', 'operations', 'legal', 'cybersecurity'];
      if (knownIds.includes(skillCategory)) {
        setSelectedDomain(skillCategory);
      } else if (skillCategory) {
        setSelectedDomain('other');
        setFormData(prev => ({ ...prev, customSkill: skillCategory }));
      }
      setHasInitialSet(true);
    }
  }, [skillCategory, hasInitialSet]);

  const domains = [
    { id: 'design', label: 'Product Design', icon: Palette, tag: 'UI/UX' },
    { id: 'development', label: 'Software Engineering', icon: Code2, tag: 'DEV' },
    { id: 'data', label: 'Data Science & Analytics', icon: Database, tag: 'DATA' },
    { id: 'product', label: 'Product Management', icon: Zap, tag: 'PRODUCT' },
    { id: 'marketing', label: 'Growth Marketing', icon: BarChart3, tag: 'GROWTH' },
    { id: 'content', label: 'Content & Copywriting', icon: FileText, tag: 'CONTENT' },
    { id: 'sales', label: 'Sales & Business Development', icon: Briefcase, tag: 'SALES' },
    { id: 'finance', label: 'Finance & Accounting', icon: Coins, tag: 'FINANCE' },
    { id: 'operations', label: 'Operations & Logistics', icon: Settings, tag: 'OPS' },
    { id: 'legal', label: 'Legal & Compliance', icon: Scale, tag: 'LEGAL' },
    { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck, tag: 'CYBER' },
    { id: 'other', label: 'Other', icon: UserPlus, tag: 'OTHER' },
  ];

  const getAuditContent = (domain: string) => {
    const contents: Record<string, any> = {
      design: {
        label: 'Portfolio / Figma Link',
        placeholder: 'https://figma.com/file/...',
        rationalePrompt: 'Explain one specific UX decision and the technical trade-off it required.',
        acceptable: ['1:1 Figma-to-code parity examples', 'Documented component systems'],
        rejection: ['Static mockups without flow', 'Template-based portfolios']
      },
      development: {
        label: 'Repository / Live Link',
        placeholder: 'https://github.com/username/repo',
        rationalePrompt: 'Describe a specific performance or architectural trade-off you made.',
        acceptable: ['Production-ready code with README', 'Full-stack application logic'],
        rejection: ['Tutorial-based repos', 'Incomplete "Hello World" apps']
      },
      product: {
        label: 'PRD / Strategy Doc Link',
        placeholder: 'https://notion.so/...',
        rationalePrompt: 'Describe how you prioritized a high-impact feature using technical constraints.',
        acceptable: ['Comprehensive product requirements', 'Measurable impact data'],
        rejection: ['Generic feature lists', 'Non-technical strategy docs']
      },
      data: {
        label: 'Notebook / Dashboard Link',
        placeholder: 'https://colab.google.com/...',
        rationalePrompt: 'Describe your data cleaning process and the specific model trade-offs.',
        acceptable: ['Reproducible analysis scripts', 'Clean data visualizations'],
        rejection: ['CSV files without context', 'Basic Excel charts']
      },
      marketing: {
        label: 'Campaign / Growth Audit Link',
        placeholder: 'https://drive.google.com/...',
        rationalePrompt: 'Describe a specific CAC/LTV optimization strategy you executed.',
        acceptable: ['Performance marketing audits', 'SEO/Growth experiment logs'],
        rejection: ['Social media screenshots', 'Non-data-backed plans']
      },
      content: {
        label: 'Writing / Strategy Portfolio',
        placeholder: 'https://medium.com/...',
        rationalePrompt: 'Explain how you adapted tone for a technical audience and its impact.',
        acceptable: ['Technical documentation', 'Long-form strategic content'],
        rejection: ['Personal blog posts', 'Short-form social copy']
      },
      sales: {
        label: 'Case Study / Deck Link',
        placeholder: 'https://docsend.com/...',
        rationalePrompt: 'Describe your outreach strategy and conversion funnel optimization.',
        acceptable: ['Sales process documentation', 'CRM workflow examples'],
        rejection: ['Cold email templates', 'Generic sales pitches']
      },
      other: {
        label: 'Professional Proof Link',
        placeholder: 'https://...',
        rationalePrompt: 'Describe a specific technical or professional execution and its measurable impact.',
        acceptable: ['Tangible proof of execution', 'Metric-backed professional artifacts'],
        rejection: ['Educational history only', 'Non-verifiable claims']
      }
    };
    return contents[domain] || contents.other;
  };

  const auditContent = getAuditContent(selectedDomain || 'other');

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner (learning fundamentals)' },
    { value: 'intermediate', label: 'Intermediate (some projects, not client-ready)' },
    { value: 'self_taught', label: 'Self-taught, no real projects yet' }
  ];

  const learningMethods = [
    { id: 'courses', label: 'Online courses' },
    { id: 'youtube', label: 'YouTube / self-study' },
    { id: 'school', label: 'School curriculum' },
    { id: 'projects', label: 'Practice projects' },
    { id: 'not_yet', label: 'Not actively learning yet' }
  ];

  const toggleLearningMethod = (id: string) => {
    setFormData(prev => ({
      ...prev,
      learningMethods: prev.learningMethods.includes(id)
        ? prev.learningMethods.filter(m => m !== id)
        : [...prev.learningMethods, id]
    }));
  };

  const isCoreValid = 
    formData.proofUrl.includes('.') && 
    formData.rationale.trim().split(/\s+/).length >= 20 &&
    formData.confirmedOriginal;

  const isPrepValid = 
    selectedDomain !== null &&
    (selectedDomain !== 'other' || formData.customSkill.trim().length > 0) &&
    formData.skillLevel !== '' &&
    formData.learningMethods.length > 0;

  const handleSubmit = () => {
    const finalSkill = selectedDomain === 'other' ? formData.customSkill : selectedDomain;
    if (track === 'core' && isCoreValid) {
      onNext({ ...formData, skillCategory: finalSkill });
    } else if (track === 'prep' && isPrepValid) {
      onNext({ ...formData, skillCategory: finalSkill });
    }
  };

  const rationaleWordCount = formData.rationale.trim() ? formData.rationale.trim().split(/\s+/).length : 0;

  if (track === 'prep') {
    return (
      <ApplicationLayout currentStep={2} totalSteps={3} title="Skill Direction" onBack={onBack}>
        <div className="w-full space-y-8 sm:space-y-10 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Step badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-700 uppercase">STEP: SKILL AUDIT</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-urbanist font-bold text-slate-900 leading-tight">What do you want to become task-ready in?</h3>
              <p className="text-slate-500 text-sm font-inter leading-relaxed">
                Choose the skill you are actively committing to improve. This helps us design the preparation program for you.
              </p>
              
              <div className="pt-2">
                <GuidancePopover 
                  title="Goal Guidance"
                  items={[
                    { label: "Interest-Led", description: "Select the field you are most curious about and willing to learn from scratch." },
                    { label: "Market-Driven", description: "Select a field like Development or Data if you want to focus on high-demand technical roles." },
                    { label: "Execution-Based", description: "Select Design or Content if you enjoy tangible, creative output." }
                  ]}
                  footer="You can always pivot your focus as you progress through the track."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">PRIMARY SKILL TO DEVELOP</Label>
                <Select 
                  value={selectedDomain || ''} 
                  onValueChange={(val) => setSelectedDomain(val)}
                >
                  <SelectTrigger className="h-14 border-slate-200 focus:ring-teal-600/10 focus:border-teal-600 font-inter bg-white">
                    <SelectValue placeholder="Select Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(opt => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <AnimatePresence>
                  {selectedDomain === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <Input 
                        value={formData.customSkill}
                        onChange={(e) => setFormData({...formData, customSkill: e.target.value})}
                        placeholder="Please specify your skill..."
                        className="h-12 border-slate-200 focus:border-teal-600 focus:ring-teal-600/10 transition-all font-inter bg-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">YOUR CURRENT LEVEL</Label>
                <Select 
                  value={formData.skillLevel} 
                  onValueChange={(val) => setFormData({...formData, skillLevel: val})}
                >
                  <SelectTrigger className="h-14 border-slate-200 focus:ring-teal-600/10 focus:border-teal-600 font-inter bg-white">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevelOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">HOW YOU'RE CURRENTLY LEARNING</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {learningMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => toggleLearningMethod(method.id)}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.98]
                        ${formData.learningMethods.includes(method.id) 
                          ? 'border-slate-900 bg-white shadow-sm' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}
                      `}
                    >
                      <div className={`
                        shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${formData.learningMethods.includes(method.id) ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}
                      `}>
                        {formData.learningMethods.includes(method.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm font-inter text-slate-700">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!isPrepValid}
              className={`w-full h-14 rounded-xl shadow-xl transition-all group cursor-pointer font-urbanist font-bold mt-4 sm:mt-8 text-sm sm:text-base ${isPrepValid ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-300'}`}
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </ApplicationLayout>
    );
  }

  // CORE TRACK VIEW 
  return (
    <ApplicationLayout currentStep={2} totalSteps={4} title="Skill Verification" onBack={onBack}>
      <div className="w-full space-y-12 pb-20">
        <AnimatePresence mode="wait">
          {!selectedDomain ? (
            <motion.div 
              key="domain-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 px-2">
                <h3 className="text-xl font-urbanist font-bold text-slate-900">Select your specialty</h3>
                <p className="text-sm text-slate-500 font-inter">Select the primary skill you want us to review.</p>
                
                <div className="pt-2">
                  <GuidancePopover 
                    title="Specialty Guidance"
                    items={[
                      { label: "Design", description: "UI/UX, Product, or Graphic systems." },
                      { label: "Development", description: "Frontend, Backend, Fullstack, or Web3." },
                      { label: "Product", description: "Strategy, PRDs, and Constraint management." },
                      { label: "Growth", description: "Data-backed marketing and funnel optimization." }
                    ]}
                    footer="Select the area where you have the strongest tangible proof of work."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-900 hover:shadow-lg transition-all text-left group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="shrink-0 p-3 rounded-lg bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <domain.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase truncate">{domain.tag}</span>
                      <h4 className="font-urbanist font-bold text-slate-900 text-sm sm:text-base truncate">{domain.label}</h4>
                    </div>
                    <ArrowRight className="ml-auto shrink-0 w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="audit-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="p-6 sm:p-8 bg-slate-900 rounded-2xl text-white shadow-2xl shadow-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-indigo-400 uppercase truncate max-w-[150px] sm:max-w-none">
                      DOMAIN: {(selectedDomain === 'other' ? (formData.customSkill || 'CUSTOM') : selectedDomain).toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedDomain(null)}
                    className="shrink-0 text-[10px] font-mono font-bold text-slate-500 hover:text-white transition-colors cursor-pointer py-1 px-2 -mr-2"
                  >
                    [ CHANGE ]
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-urbanist font-bold mb-2">Technical Proof</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-inter leading-relaxed">
                  Provide a single, definitive proof of your work capability.
                </p>
              </div>

              <div className="space-y-8">
                {selectedDomain === 'other' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SPECIFY SKILL</Label>
                    <Input 
                      value={formData.customSkill}
                      onChange={(e) => setFormData({...formData, customSkill: e.target.value})}
                      placeholder="e.g. Content Strategy / Web3 Audit"
                      className="h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 p-4 rounded-xl border border-emerald-50 bg-emerald-50/10">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">ACCEPTABLE</span>
                      </div>
                      <ul className="space-y-1.5">
                        {auditContent.acceptable.map((item: string, i: number) => (
                          <li key={i} className="text-[11px] sm:text-xs text-slate-600 font-inter leading-relaxed flex gap-2">
                            <span className="text-emerald-500 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3 p-4 rounded-xl border border-rose-50 bg-rose-50/10">
                      <div className="flex items-center gap-2 text-rose-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">NOT ACCEPTABLE</span>
                      </div>
                      <ul className="space-y-1.5">
                        {auditContent.rejection.map((item: string, i: number) => (
                          <li key={i} className="text-[11px] sm:text-xs text-slate-600 font-inter leading-relaxed flex gap-2">
                            <span className="text-rose-500 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{auditContent.label.toUpperCase()}</Label>
                    <div className="relative group">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        value={formData.proofUrl}
                        onChange={(e) => setFormData({...formData, proofUrl: e.target.value})}
                        placeholder={auditContent.placeholder}
                        className="pl-12 h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
                      <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">PROJECT DETAILS</Label>
                      <span className={`text-[10px] font-mono font-bold ${rationaleWordCount < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {rationaleWordCount} WORDS (MIN 20)
                      </span>
                    </div>
                    <Textarea 
                      value={formData.rationale}
                      onChange={(e) => setFormData({...formData, rationale: e.target.value})}
                      placeholder={auditContent.rationalePrompt}
                      className="min-h-[160px] border-slate-200 focus:border-slate-900 transition-all font-inter resize-none leading-relaxed text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.confirmedOriginal}
                    onChange={(e) => setFormData({...formData, confirmedOriginal: e.target.checked})}
                    className="shrink-0 mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-urbanist font-bold text-slate-900">Original Work</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">I certify that this submission represents my original work.</p>
                  </div>
                </label>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!isCoreValid || (selectedDomain === 'other' && !formData.customSkill)}
                className={`w-full h-14 rounded-xl shadow-xl transition-all font-urbanist font-bold text-sm sm:text-base ${isCoreValid && (selectedDomain !== 'other' || formData.customSkill) ? 'bg-slate-900 hover:bg-black text-white shadow-slate-200' : 'bg-slate-100 text-slate-300 shadow-none'}`}
              >
                Submit Proof of Work
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ApplicationLayout>
  );
};