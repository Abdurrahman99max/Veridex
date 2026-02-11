import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { LandingPage } from './components/landing/LandingPage';
import { EntryGate } from './components/application/EntryGate';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Verification } from './components/application/Step3Verification';
import { Step3Commitment } from './components/application/Step3Commitment';
import { SuccessScreen } from './components/application/SuccessScreen';
import { AdminLogin } from './components/AdminLogin';
import { AdminHub } from './components/AdminHub';
import { projectId, publicAnonKey } from './utils/supabase/info';

type View = 'landing' | 'gate' | 'application' | 'admin' | 'success';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState<'core' | 'prep' | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [adminAuth, setAdminAuth] = useState<{ token: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  // Prep: 1 (Eligibility) -> 2 (Skill) -> 3 (Commitment)
  // Core: 1 (Eligibility) -> 2 (Skill) -> 3 (Verification) -> 4 (Commitment)
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
        setView('success');
      } else {
        if (result.error === 'IDENTITY_ALREADY_REGISTERED') {
          toast.error('Identity already registered in secure node.');
        } else {
          toast.error(result.message || 'Transmission failed. Check connection.');
        }
      }
    } catch (err) {
      toast.error('Protocol synchronization error.');
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
    // Logic for Step Mapping based on Track
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
      // For Prep Track, step 3 is Commitment
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
      // For Core Track
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
        return <LandingPage onApply={handleApply} onWaitlist={handleWaitlist} />;
      
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
                  <div className="font-mono text-xs uppercase tracking-widest font-bold">Synchronizing Protocol...</div>
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
        return <LandingPage onApply={handleApply} onWaitlist={handleWaitlist} />;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Toaster position="top-center" richColors theme="light" />
      {renderView()}
    </div>
  );
}
