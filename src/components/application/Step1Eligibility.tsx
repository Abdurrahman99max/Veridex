import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Upload, 
  FileText,
  ChevronLeft,
  Info,
  AlertCircle
} from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import { GuidancePopover } from './GuidancePopover';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EligibilityGateProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialPath?: 'core' | 'prep' | null;
}

type Path = 'core' | 'prep' | 'ineligible' | null;

export const Step1Eligibility: React.FC<EligibilityGateProps> = ({ onNext, onBack, initialPath }) => {
  const [selectedPath, setSelectedPath] = useState<Path>(null); // Start null to force selection/gate
  const [coreGateConfirmed, setCoreGateConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    email: '',
    file: null as File | null,
    gradYear: '',
    skillCategory: '',
    customSkill: '',
    motivation: ''
  });

  useEffect(() => {
    if (initialPath) {
      setSelectedPath(initialPath);
      // If we're coming back from a later step, we've already confirmed the gate
      if (initialPath === 'core') {
        setCoreGateConfirmed(true);
      }
    }
  }, [initialPath]);

  const handlePathSelect = (path: Path, year: string) => {
    // Reset specific fields when switching paths to prevent data pollution
    setFormData(prev => ({
      ...prev,
      email: '',
      file: null,
      gradYear: year,
      skillCategory: '',
      customSkill: '',
      motivation: ''
    }));
    
    setSelectedPath(path);
    if (path === 'core') {
      setCoreGateConfirmed(false);
    }
  };

  const handleInternalBack = () => {
    if (selectedPath === 'core' && coreGateConfirmed && !initialPath) {
      setCoreGateConfirmed(false);
    } else if (selectedPath) {
      setSelectedPath(null);
    } else {
      onBack();
    }
  };

  const isEmailProvided = formData.email.trim().includes('@') && formData.email.trim().length > 5;
  const isFileProvided = formData.file !== null;
  
  const isSkillValid = formData.skillCategory === 'other' 
    ? formData.customSkill.trim().length >= 2 
    : formData.skillCategory !== '';

  const isContactValid = (val: string) => {
    const isEmail = val.includes('@') && val.includes('.') && val.length > 5;
    const isPhone = val.startsWith('+') && val.replace(/\D/g, '').length >= 10 && val.replace(/\D/g, '').length <= 15;
    return isEmail || isPhone;
  };

  const isCoreValid = formData.fullName.trim() !== '' && 
                     formData.university.trim() !== '' && 
                     isSkillValid &&
                     (isEmailProvided || isFileProvided);

  const isPrepValid = formData.fullName.trim() !== '' && 
                     formData.university.trim() !== '' && 
                     isContactValid(formData.email) &&
                     formData.gradYear !== '' &&
                     formData.motivation !== '';

  const handleContinue = () => {
    const finalSkill = formData.skillCategory === 'other' ? formData.customSkill : formData.skillCategory;
    
    if (selectedPath === 'core') {
      onNext({ 
        ...formData, 
        skillCategory: finalSkill,
        gradYear: '2026',
        track: 'core',
        verificationMethod: isEmailProvided ? 'email' : 'document'
      });
    } else if (selectedPath === 'prep') {
      onNext({ 
        ...formData, 
        track: 'prep'
      });
    }
  };

  const skillOptions = [
    { value: 'design', label: 'Product Design' },
    { value: 'development', label: 'Software Engineering' },
    { value: 'data', label: 'Data Science & Analytics' },
    { value: 'marketing', label: 'Growth Marketing' },
    { value: 'product', label: 'Product Management' },
    { value: 'content', label: 'Content & Copywriting' },
    { value: 'sales', label: 'Sales & Business Development' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'operations', label: 'Operations & Logistics' },
    { value: 'legal', label: 'Legal & Compliance' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'other', label: 'Other (Generalist / Custom)' }
  ];

  const motivationOptions = [
    { value: 'no_samples', label: "I don't have strong work samples yet" },
    { value: 'learning_structure', label: "I'm still learning and need structure" },
    { value: 'employable', label: "I want to become employable before graduation" },
    { value: 'rejected', label: "I've been rejected and want to improve" }
  ];

  const gradYears = ["2026", "2027", "2028", "2029+"];

  return (
    <ApplicationLayout 
      currentStep={1} 
      totalSteps={3} 
      title={selectedPath === 'prep' ? "Context & Intent" : "Eligibility Protocol"} 
      onBack={handleInternalBack}
    >
      <div className="max-w-2xl mx-auto space-y-12 pb-12">
        
        {!selectedPath && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-urbanist font-bold text-slate-900">Identify Academic Standing</h2>
              <p className="text-slate-500 font-inter text-sm max-w-md mx-auto">
                Select your status to be routed to the appropriate protocol.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="wait">
            {!selectedPath ? (
              <motion.div 
                key="selection-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="grid grid-cols-1 gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handlePathSelect('core', '2026')}
                    className="group relative flex flex-col p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
                        CORE ENTRY
                      </span>
                    </div>
                    <h3 className="text-xl font-urbanist font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Class of 2026</h3>
                    <p className="text-sm text-slate-500 font-inter mt-1">Work-ready final-year student</p>
                    <div className="mt-6 flex items-center text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
                      Begin Audit <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  <button
                    onClick={() => handlePathSelect('prep', '')}
                    className="group relative flex flex-col p-6 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left cursor-pointer border-dashed"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded">
                        PREP TRACK
                      </span>
                    </div>
                    <h3 className="text-xl font-urbanist font-bold text-slate-900">Join Preparation Track</h3>
                    <p className="text-sm text-slate-500 font-inter mt-1">Penultimate year or building skills</p>
                    <div className="mt-6 flex items-center text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
                      Learn & Grow <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="focused-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {selectedPath === 'core' && (
                  <>
                    {!coreGateConfirmed ? (
                      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-slate-200 overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                            <ShieldCheck className="w-32 h-32" />
                          </div>
                          
                          <div className="relative space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">STRICT_PROTOCOL: CORE_ENTRY</span>
                            </div>

                            <div className="space-y-2">
                              <h2 className="text-3xl font-urbanist font-bold leading-tight">Final-Year Eligibility Gate</h2>
                              <p className="text-slate-400 font-inter leading-relaxed">
                                Veridex Core is exclusively reserved for students in their <span className="text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">final year of university (Class of 2026)</span>.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 py-4">
                              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs">1</div>
                                <p className="text-sm font-inter text-slate-300">You must graduate by Summer 2026.</p>
                              </div>
                              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs">2</div>
                                <p className="text-sm font-inter text-slate-300">Manual verification of enrollment is required.</p>
                              </div>
                              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs">3</div>
                                <p className="text-sm font-inter text-slate-300">Ineligible profiles will be permanently flagged.</p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <Button 
                                onClick={() => setCoreGateConfirmed(true)}
                                className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-urbanist font-bold transition-all shadow-xl shadow-black/20 group"
                              >
                                I am a Class of 2026 Student
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                              <button 
                                onClick={() => setSelectedPath(null)}
                                className="w-full mt-4 text-xs font-mono font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                              >
                                [ I am not eligible - Return ]
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-50 rounded-lg shrink-0 border border-indigo-100">
                              <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                                STATUS: PROTOCOL_ACTIVE
                              </span>
                              <h3 className="text-sm font-urbanist font-bold text-slate-900 mt-1">Verification Data Required</h3>
                              <p className="text-slate-500 text-xs font-inter mt-1 leading-relaxed">
                                Please provide accurate details. Your graduation year is locked to 2026 for this track.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-mono font-bold text-slate-500 uppercase">FULL NAME</Label>
                              <Input 
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                placeholder="Alex Chen"
                                className="h-12 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-mono font-bold text-slate-500 uppercase">UNIVERSITY</Label>
                              <Input 
                                value={formData.university}
                                onChange={(e) => setFormData({...formData, university: e.target.value})}
                                placeholder="University of Waterloo"
                                className="h-12 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-xs font-mono font-bold text-slate-500 uppercase">PRIMARY SKILL CATEGORY</Label>
                            <Select 
                              value={formData.skillCategory} 
                              onValueChange={(val) => setFormData({...formData, skillCategory: val})}
                            >
                              <SelectTrigger className="h-12 border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 font-inter bg-white">
                                <SelectValue placeholder="Select your domain" />
                              </SelectTrigger>
                              <SelectContent>
                                {skillOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-6 pt-4 border-t border-slate-100">
                            <div className="space-y-1">
                              <Label className="text-xs font-mono font-bold text-slate-500 uppercase">VERIFICATION METHOD</Label>
                              <p className="text-xs text-slate-400 font-inter">Identify using one of the two protocols below.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div className={`relative group p-1 rounded-xl transition-all border ${isEmailProvided ? 'border-indigo-500 bg-indigo-50/10' : 'border-transparent'}`}>
                                <div className="relative">
                                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isEmailProvided ? 'text-indigo-500' : 'text-slate-400'}`} />
                                  <Input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value, file: null})}
                                    placeholder="School-issued email (Recommended)"
                                    className={`pl-12 h-14 border-slate-200 transition-all font-inter bg-white focus:border-slate-900 ${isEmailProvided ? 'border-indigo-200' : ''}`}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2">OR</span>
                                <div className="flex-1 h-px bg-slate-100" />
                              </div>

                              <label className={`relative cursor-pointer group flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${isFileProvided ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'}`}>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null, email: ''})}
                                />
                                {isFileProvided ? (
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                    <div className="text-left">
                                      <p className="text-sm font-urbanist font-bold text-slate-900">{formData.file?.name}</p>
                                      <p className="text-xs text-slate-500">Document proof attached</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center space-y-2">
                                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                                    <p className="text-sm font-urbanist font-bold text-slate-900">Upload Status Proof</p>
                                    <p className="text-xs text-slate-400 font-inter">Portal Screenshot or Enrollment Letter</p>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>

                          <Button 
                            onClick={handleContinue}
                            disabled={!isCoreValid}
                            className={`w-full h-14 rounded-xl shadow-xl transition-all group cursor-pointer ${isCoreValid ? 'bg-slate-900 hover:bg-black text-white shadow-slate-200' : 'bg-slate-100 text-slate-300 shadow-none'}`}
                          >
                            Verify Status & Continue
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedPath === 'prep' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg border border-indigo-100">
                          <Info className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-urbanist font-bold text-slate-900">Preparation Track Application</h4>
                          <p className="text-slate-500 text-xs font-inter mt-1 leading-relaxed">
                            This track is for students who want to become task-ready before applying to Veridex. <br />
                            <span className="font-bold">This is not the Veridex Core application.</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-urbanist font-bold text-slate-900">Full Name</Label>
                        <Input 
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          placeholder="e.g. Alex Chen"
                          className="h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-urbanist font-bold text-slate-900">University</Label>
                        <Input 
                          value={formData.university}
                          onChange={(e) => setFormData({...formData, university: e.target.value})}
                          placeholder="e.g. University of Waterloo"
                          className="h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-urbanist font-bold text-slate-900">Contact Information</Label>
                        <Input 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Email or WhatsApp (e.g. +1...)"
                          className="h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                        />
                        <p className="text-[10px] text-slate-400 font-inter">Please include your country code for WhatsApp (e.g., +234, +44, +1).</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-urbanist font-bold text-slate-900">Expected Graduation Year</Label>
                        <Select 
                          value={formData.gradYear} 
                          onValueChange={(val) => setFormData({...formData, gradYear: val})}
                        >
                          <SelectTrigger className="h-14 border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 font-inter bg-white">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradYears.map(year => (
                              <SelectItem key={year} value={year}>
                                {year} {year === '2026' && "(Core track recommended)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.gradYear === '2026' && (
                          <p className="text-[10px] text-amber-600 font-mono font-bold uppercase mt-1">
                            Notice: Final year students are eligible for Core Entry.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-urbanist font-bold text-slate-900">Why are you applying to the Preparation Track?</Label>
                        <Select 
                          value={formData.motivation} 
                          onValueChange={(val) => setFormData({...formData, motivation: val})}
                        >
                          <SelectTrigger className="h-14 border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 font-inter bg-white">
                            <SelectValue placeholder="Select Motivation" />
                          </SelectTrigger>
                          <SelectContent>
                            {motivationOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={handleContinue}
                        disabled={!isPrepValid}
                        className={`w-full h-14 rounded-xl shadow-xl transition-all group cursor-pointer font-urbanist font-bold ${isPrepValid ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-300'}`}
                      >
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ApplicationLayout>
  );
};
