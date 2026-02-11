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
  };
  const handleWaitlist = () => {
    setTrack(null);
    setView('application');
    setStep(1);
  };
  const handleBackToLanding = () => setView('landing');

  const handleNextStep = async (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (updatedData.track) setTrack(updatedData.track);

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Final Submission logic
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/submit-application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(updatedData)
        });
        
        const result = await response.json();
        if (response.ok) {
          setView('success');
        } else {
          if (result.error === 'IDENTITY_ALREADY_REGISTERED') {
            toast.error('Identity already registered in secure node.');
          } else {
            toast.error('Transmission failed. Check connection.');
          }
        }
      } catch (err) {
        toast.error('Protocol synchronization error.');
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setView('gate');
    }
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
        if (step === 3) {
          return (
            <Step3Verification
              onNext={handleNextStep}
              onBack={handleBackStep}
              prevData={formData}
              track={track || 'core'}
            />
          );
        }
        if (step === 4) {
          return (
            <Step3Commitment 
              onComplete={handleNextStep} 
              onBack={handleBackStep} 
              prevData={formData}
              track={track || 'core'} 
            />
          );
        }
        return null;

      case 'success':
        return <SuccessScreen track={track || 'core'} onReturn={() => window.location.href = '/'} />;

      case 'admin':
        if (!adminAuth) {
          return <AdminLogin onSuccess={(token, email) => setAdminAuth({ token, email })} />;
        }
        return <AdminHub token={adminAuth.token} adminEmail={adminAuth.email} />;

      default:
        return <LandingPage onApply={handleApply} onWaitlist={handleWaitlist} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors />
      {renderView()}
    </div>
  );
}
