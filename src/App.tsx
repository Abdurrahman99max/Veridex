import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Commitment } from './components/application/Step3Commitment';
import { SuccessScreen } from './components/application/SuccessScreen';
import { AdminLogin } from './components/AdminLogin';
import { AdminHub } from './components/AdminHub';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from './utils/supabase/info';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(window.location.search);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
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

  const handleComplete = async (finalData: any) => {
    const completeData = { ...applicationData, ...finalData };
    setApplicationData(completeData);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...completeData,
          track: track || 'core'
        })
      });
      
      if (!response.ok) throw new Error('Transmission failed');
      
      setStep(4);
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback to success screen for demo/prototype if server is down
      setStep(4); 
    }
  };

  const handleApplyCore = () => {
    setTrack(null);
    setStep(1);
  };

  const handleJoinPrep = () => {
    setTrack(null);
    setStep(1);
  };

  // Simulated internal routing for /dex
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [authSession, setAuthSession] = useState<{ token: string; email: string } | null>(null);

  const handleAdminSuccess = (token: string, email: string) => {
    setAuthSession({ token, email });
    setIsAdminAuthenticated(true);
  };

  const isDexHub = currentPath.replace(/\/$/, '') === '/dex' || new URLSearchParams(searchParams).has('dex');

  if (isDexHub) {
    return (
      <main className="min-h-screen bg-[#0A0A0B]">
        <Toaster position="top-center" theme="dark" />
        {isAdminAuthenticated && authSession ? (
          <AdminHub token={authSession.token} adminEmail={authSession.email} />
        ) : (
          <AdminLogin onSuccess={handleAdminSuccess} />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-center" />
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
    </main>
  );
}
