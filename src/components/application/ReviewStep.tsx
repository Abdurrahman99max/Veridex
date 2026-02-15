import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Shield, 
  FileText, 
  Zap, 
  Activity,
  Calendar,
  Mail,
  Building
} from 'lucide-react';
import { ApplicationLayout } from './ApplicationLayout';
import { Button } from "../ui/button";

interface ReviewStepProps {
  data: any;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data, onConfirm, onBack, isSubmitting }) => {
  const track = data.track || 'core';
  
  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 opacity-40">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        {children}
      </div>
    </div>
  );

  const DataPoint = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</span>
      <span className="text-sm font-urbanist font-bold text-slate-900 leading-tight">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <ApplicationLayout 
      currentStep={track === 'core' ? 5 : 4} 
      totalSteps={track === 'core' ? 5 : 4} 
      title="Final Verification" 
      onBack={onBack}
    >
      <div className="w-full space-y-10 pb-20">
        <div className="text-center space-y-3 px-2">
          <h2 className="text-2xl font-urbanist font-bold text-slate-900">Review your journey</h2>
          <p className="text-slate-500 font-inter text-sm max-w-md mx-auto">Please confirm your details before we record your application in the Veridex registry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Institutional Identity" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataPoint label="Full Name" value={data.fullName} />
              <DataPoint label="University" value={data.university} />
              <DataPoint label="Email" value={data.email} />
              <DataPoint label="Expected Grad" value={data.gradYear} />
            </div>
          </Section>

          <Section title="Technical Path" icon={Shield}>
            <div className="grid grid-cols-1 gap-4">
              <DataPoint label="Selected Track" value={track === 'core' ? 'Veridex Core' : 'Prep Program'} />
              <DataPoint label="Specialty" value={data.skillCategory} />
            </div>
          </Section>

          <Section title="Proof of Work" icon={FileText}>
            <div className="space-y-4">
              <DataPoint label="Rationale" value={data.rationale?.substring(0, 150) + '...'} />
              {data.proofUrl && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-indigo-600 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Artifact linked successfully
                </div>
              )}
            </div>
          </Section>

          {track === 'prep' ? (
            <Section title="Prep Commitment" icon={Activity}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataPoint label="Weekly Hours" value={data.weeklyHours} />
                <DataPoint label="Primary Goal" value={data.primaryGoal} />
              </div>
            </Section>
          ) : (
            <Section title="Core Commitment" icon={Zap}>
              <div className="grid grid-cols-1 gap-4">
                <DataPoint label="Availability" value={data.commitment === 'core' ? 'High Availability (8-12h)' : 'Sustainable Pacing (4-7h)'} />
              </div>
            </Section>
          )}
        </div>

        <div className="p-6 bg-slate-900 rounded-[24px] text-white shadow-2xl shadow-slate-200">
          <p className="text-sm font-inter leading-relaxed opacity-80 mb-6">
            I verify that all information provided is accurate and represents my current academic standing and technical capabilities.
          </p>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full h-16 bg-white text-slate-900 rounded-2xl font-urbanist font-bold hover:bg-slate-100 transition-all group flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
            Confirm & Submit Application
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
