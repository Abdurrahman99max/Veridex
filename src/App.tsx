import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Commitment } from './components/application/Step3Commitment';
import { SuccessScreen } from './components/application/SuccessScreen';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [step, setStep] = useState(0); // 0: Landing, 1-3: Application, 4: Success
  const [track, setTrack] = useState<'core' | 'prep' | null>(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    university: '',
    email: '',
    file: null,
    gradYear: '',
    skillCategory: '',
    customSkill: '',
    proofUrl: '',
    projectContext: '',
    rationale: '',
    commitment: '',
    confirmedStatus: ''
  });

  const nextStep = (newData: any) => {
    const updatedData = { ...applicationData, ...newData };
    setApplicationData(updatedData);
    
    if (newData.track) {
      setTrack(newData.track);
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = (finalData: any) => {
    const completeData = { ...applicationData, ...finalData };
    setApplicationData(completeData);
    setStep(4); 
  };

  const handleApplyCore = () => {
    setTrack(null);
    setStep(1);
  };

  const handleJoinPrep = () => {
    setTrack(null);
    setStep(1);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage 
              onApply={handleApplyCore} 
              onWaitlist={handleJoinPrep} 
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step1Eligibility onNext={nextStep} onBack={() => setStep(0)} initialPath={track} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step2SkillProof 
              onNext={nextStep} 
              onBack={prevStep} 
              skillCategory={applicationData.skillCategory} 
              track={track || 'core'}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Step3Commitment 
              onComplete={handleComplete} 
              onBack={prevStep}
              prevData={applicationData}
              track={track || 'core'}
            />
          </motion.div>
        )}

        {step === 4 && (
          <SuccessScreen 
            track={track || 'core'} 
            onReturn={() => setStep(0)} 
          />
        )}
      </AnimatePresence>
      <SpeedInsights />
    </main>
  );
}
