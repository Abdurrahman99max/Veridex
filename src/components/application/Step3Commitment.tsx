import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Zap,
  Shield,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Step3Props {
  onComplete: (data: any) => void;
  onBack: () => void;
  prevData: any;
  track: 'core' | 'prep';
}

type CommitmentType = 'core' | 'adaptive' | 'none' | null;

export const Step3Commitment: React.FC<Step3Props> = ({ onComplete, onBack, prevData, track }) => {
  const [selectedCommitment, setSelectedCommitment] = useState<CommitmentType>(null);
  const [confirmedStatus, setConfirmedStatus] = useState({
    noGuarantee: false,
    effort: false,
    coreConfirmed: false
  });
  
  // Prep specific states
  const [prepData, setPrepData] = useState({
    weeklyHours: '',
    primaryGoal: ''
  });

  const handleSelection = (type: CommitmentType) => {
    setSelectedCommitment(type);
    if (type !== 'core') setConfirmedStatus(prev => ({ ...prev, coreConfirmed: false }));
  };

  const handleFinalize = () => {
    if (track === 'prep') {
      onComplete({ 
        ...prevData, 
        ...prepData, 
        confirmedStatus: 'prep_waitlist' 
      });
    } else {
      onComplete({ 
        ...prevData, 
        commitment: selectedCommitment, 
        confirmedStatus: 'verified' 
      });
    }
  };

  const isPrep = track === 'prep';

  const commitmentCards = [
    {
      id: 'core' as CommitmentType,
      label: 'CORE TRACK',
      title: 'High Availability',
      desc: '8–12 hours/week. Designed for students who can commit to 48-hour project turnaround cycles.',
      status: 'ACTIVE STATUS',
      statusColor: 'text-indigo-600 bg-indigo-50',
      icon: Zap
    },
    {
      id: 'adaptive' as CommitmentType,
      label: 'FLEXIBLE TRACK',
      title: 'Sustainable Pacing',
      desc: '4–7 hours/week. Flexible delivery windows that account for exam seasons.',
      status: 'FLEXIBLE STATUS',
      statusColor: 'text-amber-600 bg-amber-50',
      icon: Calendar
    }
  ];

  const prepHoursOptions = ["4-6 hours", "8-10 hours", "12-15 hours", "15+ hours"];
  const prepGoalOptions = [
    { value: 'apply_core', label: 'Apply to Veridex Core' },
    { value: 'employable', label: 'Become employable for internships or freelance work' },
    { value: 'portfolio', label: 'Build a real portfolio' },
    { value: 'not_sure', label: "I'm not sure yet" }
  ];

  const isPrepValid = 
    prepData.weeklyHours !== '' && 
    prepData.primaryGoal !== '' && 
    confirmedStatus.noGuarantee && 
    confirmedStatus.effort;

  if (isPrep) {
    return (
      <ApplicationLayout currentStep={3} totalSteps={3} title="Commitment Level" onBack={onBack}>
        <div className="w-full space-y-8 sm:space-y-12 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Step badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-700 uppercase">STEP: COMMITMENT</span>
            </div>

            <div className="space-y-3 px-2">
              <h3 className="text-xl sm:text-2xl font-urbanist font-bold text-slate-900 leading-tight">Read carefully before submitting</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-inter leading-relaxed">
                Veridex's Preparation Program is designed for students who are willing to commit time and effort to becoming task-ready.<br className="hidden sm:block" />
                <span className="font-bold text-slate-700">This is not a guaranteed path into Veridex Core. Students who complete the program and demonstrate task-ready capability will be prioritized for Core access.</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">WEEKLY TIME YOU CAN COMMIT</Label>
                <Select 
                  value={prepData.weeklyHours} 
                  onValueChange={(val) => setPrepData({...prepData, weeklyHours: val})}
                >
                  <SelectTrigger className="h-14 border-slate-200 focus:ring-teal-600/10 focus:border-teal-600 font-inter bg-white">
                    <SelectValue placeholder="Select Hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {prepHoursOptions.map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">YOUR PRIMARY GOAL AFTER THE TRACK</Label>
                <Select 
                  value={prepData.primaryGoal} 
                  onValueChange={(val) => setPrepData({...prepData, primaryGoal: val})}
                >
                  <SelectTrigger className="h-14 border-slate-200 focus:ring-teal-600/10 focus:border-teal-600 font-inter bg-white">
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {prepGoalOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">COMMITMENT CONFIRMATION</Label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.99]">
                    <input 
                      type="checkbox" 
                      checked={confirmedStatus.noGuarantee}
                      onChange={(e) => setConfirmedStatus({...confirmedStatus, noGuarantee: e.target.checked})}
                      className="shrink-0 mt-1 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-teal-600"
                    />
                    <span className="text-[13px] sm:text-sm font-inter text-slate-600 leading-tight">I understand this does not guarantee acceptance into Veridex Core</span>
                  </label>

                  <label className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.99]">
                    <input 
                      type="checkbox" 
                      checked={confirmedStatus.effort}
                      onChange={(e) => setConfirmedStatus({...confirmedStatus, effort: e.target.checked})}
                      className="shrink-0 mt-1 w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-teal-600"
                    />
                    <span className="text-[13px] sm:text-sm font-inter text-slate-600 leading-tight">I am willing to put in consistent effort to improve my skills</span>
                  </label>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleFinalize}
              disabled={!isPrepValid}
              className={`w-full h-14 rounded-xl shadow-xl transition-all group cursor-pointer font-urbanist font-bold mt-4 sm:mt-8 text-sm sm:text-base ${isPrepValid ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-300'}`}
            >
              Join the Preparation Program
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </ApplicationLayout>
    );
  }

  // CORE TRACK VIEW
  return (
    <ApplicationLayout currentStep={4} totalSteps={4} title="Work Capacity" onBack={onBack}>
      <div className="w-full space-y-8 sm:space-y-12 pb-20">
        {/* Step badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-teal-700 uppercase">STEP: CAPACITY</span>
        </div>

        <div className="text-center space-y-3 px-2">
          <h2 className="text-xl sm:text-2xl font-urbanist font-bold text-slate-900">Weekly Commitment</h2>
          <p className="text-slate-500 font-inter text-sm max-w-md mx-auto">Choose the weekly hours you can realistically dedicate to projects.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {commitmentCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelection(card.id)}
              className={`group relative flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl border transition-all text-left cursor-pointer active:scale-[0.98] ${selectedCommitment === card.id ? 'border-slate-900 bg-white shadow-xl shadow-slate-200/50' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-white'}`}
            >
              <div className={`shrink-0 p-3 rounded-xl ${selectedCommitment === card.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                <span className={`inline-block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${card.statusColor}`}>{card.status}</span>
                <h3 className="text-base sm:text-lg font-urbanist font-bold text-slate-900">{card.title}</h3>
                <p className="text-[11px] sm:text-sm text-slate-500 font-inter leading-relaxed">{card.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedCommitment && selectedCommitment !== 'none' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="p-6 sm:p-8 bg-slate-900 rounded-2xl text-white shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="shrink-0 w-5 h-5 text-indigo-400" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">AGREEMENT</span>
                </div>
                <p className="text-[13px] sm:text-sm font-inter text-slate-300 leading-relaxed mb-8">
                  I understand that the Core Track requires professional-grade delivery and responsiveness. I commit to managing my academic workload alongside these tasks.
                </p>
                <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group active:scale-[0.99]">
                  <input 
                    type="checkbox" 
                    checked={confirmedStatus.coreConfirmed}
                    onChange={(e) => setConfirmedStatus({...confirmedStatus, coreConfirmed: e.target.checked})}
                    className="shrink-0 mt-0.5 w-4 h-4 rounded border-slate-700 bg-transparent text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] sm:text-xs font-urbanist font-bold text-white uppercase tracking-tight leading-tight">Confirm {selectedCommitment === 'core' ? '8–12' : '4–7'} hour weekly capacity</span>
                </label>
              </div>
              <Button 
                onClick={handleFinalize}
                disabled={!confirmedStatus.coreConfirmed}
                className={`w-full h-14 rounded-xl shadow-xl font-urbanist font-bold transition-all text-sm sm:text-base ${confirmedStatus.coreConfirmed ? 'bg-slate-900 hover:bg-black text-white shadow-slate-200' : 'bg-slate-100 text-slate-300 shadow-none'}`}
              >
                Complete Application
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ApplicationLayout>
  );
};