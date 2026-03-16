import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Shield } from 'lucide-react';
import { LandingPage } from './components/landing/LandingPage';
import { EntryGate } from './components/application/EntryGate';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Verification } from './components/application/Step3Verification';
import { Step3Commitment } from './components/application/Step3Commitment';
import { ReviewStep } from './components/application/ReviewStep';
import { NextStepConfirmation } from './components/application/NextStepConfirmation';
import { SuccessScreen } from './components/application/SuccessScreen';
import { StatusCheck } from './components/StatusCheck';
import { AdminLogin } from './components/AdminLogin';
import { AdminHub } from './components/AdminHub';
import { projectId, publicAnonKey } from './utils/supabase/info';

type View = 'landing' | 'gate' | 'application' | 'admin' | 'success' | 'duplicate';

export default function App() {
  // 1. State Declarations
  const [view, setView] = useState<View>(() => {
    const saved = localStorage.getItem('vdx_app_draft_view');
    return (saved === 'application') ? 'application' : 'landing';
  });
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState('');
  const [formData, setFormData] = useState<any>(() => {
    const saved = localStorage.getItem('vdx_app_draft_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('vdx_app_draft_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [track, setTrack] = useState<'core' | 'prep' | null>(() => {
    const saved = localStorage.getItem('vdx_app_draft_track');
    return saved ? saved as 'core' | 'prep' : null;
  });
  const [adminAuth, setAdminAuth] = useState<{ token: string; email: string } | null>(() => {
    const saved = localStorage.getItem('vdx_admin_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingStepData, setPendingStepData] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 2. Persistence Sync
  useEffect(() => {
    if (view === 'application') {
      localStorage.setItem('vdx_app_draft_data', JSON.stringify(formData));
      localStorage.setItem('vdx_app_draft_step', step.toString());
      localStorage.setItem('vdx_app_draft_view', 'application');
      if (track) localStorage.setItem('vdx_app_draft_track', track);
    } else if (view === 'success') {
      localStorage.removeItem('vdx_app_draft_data');
      localStorage.removeItem('vdx_app_draft_step');
      localStorage.removeItem('vdx_app_draft_view');
      localStorage.removeItem('vdx_app_draft_track');
    }
  }, [formData, step, view, track]);

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

  // 3. Handlers
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

  const submitApplication = async (finalData: any) => {
    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(finalData),
        signal: controller.signal
      });
      
      const result = await response.json();
      clearTimeout(timeoutId);

      if (response.ok) {
        if (result.duplicate) {
          setDuplicateEmail(finalData.email);
          setView('duplicate');
        } else {
          setView('success');
        }
      } else {
        toast.error(result.message || 'Submission timed out. Please try again.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.error('The connection timed out. Please check your network or try again.');
      } else {
        toast.error('Application submission failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async (stepData: any) => {
    setPendingStepData(stepData);
    setShowConfirmation(true);
  };

  const confirmNextStep = () => {
    const updatedData = { ...formData, ...pendingStepData };
    setFormData(updatedData);

    if (updatedData.track) {
      setTrack(updatedData.track);
    }

    const currentTrack = updatedData.track || track;
    const totalSteps = currentTrack === 'prep' ? 4 : 5;

    if (step < totalSteps) {
      setStep(step + 1);
    }
    setShowConfirmation(false);
    setPendingStepData(null);
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setView('gate');
    }
  };

  // 4. Render Helpers
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
      if (step === 4) {
        return (
          <ReviewStep 
            data={formData}
            onConfirm={() => submitApplication(formData)}
            onBack={handleBackStep}
            isSubmitting={isSubmitting}
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
      if (step === 5) {
        return (
          <ReviewStep 
            data={formData}
            onConfirm={() => submitApplication(formData)}
            onBack={handleBackStep}
            isSubmitting={isSubmitting}
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
          <div className="min-h-screen flex flex-col bg-[#EEF2F7] overflow-x-hidden">
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

      case 'duplicate':
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
                <Shield className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-urbanist font-bold text-slate-900 mb-3">Record Located</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                It looks like an application for <span className="font-bold text-slate-900">{duplicateEmail}</span> is already in our registry. You don't need to apply twice.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setView('landing');
                    setShowStatusCheck(true);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                >
                  Check My Status
                </button>
                <button 
                  onClick={() => setView('landing')}
                  className="w-full py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          </div>
        );

      case 'admin':
        if (!adminAuth) {
          return (
            <div className="min-h-screen bg-[#0A0A0B]">
               <AdminLogin onSuccess={(token, email) => setAdminAuth({ token, email })} />
            </div>
          );
        }
        return <AdminHub token={adminAuth.token} adminEmail={adminAuth.email} onLogout={() => setAdminAuth(null)} />;

      default:
        return (
          <LandingPage 
            onApply={handleApply} 
            onWaitlist={handleWaitlist} 
            onCheckStatus={() => setShowStatusCheck(true)} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white relative">
      <Toaster position="top-center" richColors theme="light" />
      {renderView()}
      <NextStepConfirmation 
        isOpen={showConfirmation}
        onConfirm={confirmNextStep}
        onCancel={() => setShowConfirmation(false)}
        title="Verify your input"
        description="Please take a moment to review what you just entered before proceeding to the next step."
      />
    </div>
  );
}