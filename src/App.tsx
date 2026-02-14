import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/landing/LandingPage';
import { EntryGate } from './components/application/EntryGate';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Verification } from './components/application/Step3Verification';
import { Step3Commitment } from './components/application/Step3Commitment';
import { SuccessScreen } from './components/application/SuccessScreen';
import { StatusCheck } from './components/StatusCheck';
import { AdminLogin } from './components/AdminLogin';
import { AdminHub } from './components/AdminHub';
import { projectId, publicAnonKey } from './utils/supabase/info';

type View = 'landing' | 'gate' | 'application' | 'admin' | 'success';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState<'core' | 'prep' | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [adminAuth, setAdminAuth] = useState<{ token: string; email: string } | null>(() => {
    const saved = localStorage.getItem('vdx_admin_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (adminAuth) {
      localStorage.setItem('vdx_admin_session', JSON.stringify(adminAuth));
    } else {
      localStorage.removeItem('vdx_admin_session');
    }
  }, [adminAuth]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('dex')) {
      setView('admin');
    }
  }, []);

  const handleApply = () => {
    setTrack(null);
    setView('gate');
  };
  const handleStartApplication = () => {
    setTrack(null);
    setView('application');
    setStep(1);
    setFormData({});
  };
  const handleWaitlist = () => {
    setTrack(null);
    setView('application');
    setStep(1);
    setFormData({});
  };
  const handleBackToLanding = () => setView('landing');

  // Bifurcation Logic: Prep (3 steps), Core (4 steps)
  const getTotalSteps = () => (track === 'prep' ? 3 : 4);

  const submitApplication = async (finalData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(finalData)
      });
      
      const result = await response.json();
      if (response.ok) {
        if (result.duplicate) {
          toast.info("It looks like you've already applied. Please check the Status Portal on the main page for updates.", { duration: 6000 });
          setView('landing');
        } else {
          setView('success');
        }
      } else {
        toast.error(result.message || 'Submission failed. Please check your connection.');
      }
    } catch (err) {
      toast.error('Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (updatedData.track) {
      setTrack(updatedData.track);
    }

    const currentTrack = updatedData.track || track;
    const totalSteps = currentTrack === 'prep' ? 3 : 4;

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await submitApplication(updatedData);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setView('gate');
    }
  };

  const renderApplicationStep = () => {
    if (step === 1) {
      return (
        <Step1Eligibility 
          onNext={handleNextStep} 
          onBack={handleBackStep} 
          initialPath={track} 
        />
      );
    }
    
    if (step === 2) {
      return (
        <Step2SkillProof 
          onNext={handleNextStep} 
          onBack={handleBackStep} 
          skillCategory={formData.skillCategory} 
          track={track || 'core'} 
        />
      );
    }

    if (track === 'prep') {
      if (step === 3) {
        return (
          <Step3Commitment 
            onComplete={handleNextStep} 
            onBack={handleBackStep} 
            prevData={formData}
            track="prep" 
          />
        );
      }
    } else {
      if (step === 3) {
        return (
          <Step3Verification
            onNext={handleNextStep}
            onBack={handleBackStep}
            prevData={formData}
            track="core"
          />
        );
      }
      if (step === 4) {
        return (
          <Step3Commitment 
            onComplete={handleNextStep} 
            onBack={handleBackStep} 
            prevData={formData}
            track="core" 
          />
        );
      }
    }
    return null;
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <>
            <LandingPage 
              onApply={handleApply} 
              onWaitlist={handleWaitlist} 
              onCheckStatus={() => setShowStatusCheck(true)} 
            />
            <AnimatePresence mode="wait">
              {showStatusCheck && (
                <StatusCheck key="status-check-modal" onClose={() => setShowStatusCheck(false)} />
              )}
            </AnimatePresence>
          </>
        );
      
      case 'gate':
        return (
          <EntryGate 
            onStart={handleStartApplication} 
            onWaitlist={handleWaitlist} 
            onBack={handleBackToLanding} 
          />
        );

      case 'application':
        return (
          <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
            {isSubmitting && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  <div className="font-mono text-xs uppercase tracking-widest font-bold">Submitting your application...</div>
                </div>
              </div>
            )}
            {renderApplicationStep()}
          </div>
        );

      case 'success':
        return <SuccessScreen track={track || 'core'} onReturn={() => window.location.href = '/'} />;

      case 'admin':
        if (!adminAuth) {
          return (
            <div className="min-h-screen bg-[#0A0A0B]">
               <AdminLogin onSuccess={(token, email) => setAdminAuth({ token, email })} />
            </div>
          );
        }
        return <AdminHub token={adminAuth.token} adminEmail={adminAuth.email} />;

      default:
        return <LandingPage onApply={handleApply} onWaitlist={handleWaitlist} onCheckStatus={() => setShowStatusCheck(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white relative">
      <Toaster position="top-center" richColors theme="light" />
      {renderView()}
    </div>
  );
}
