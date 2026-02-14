import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  LayoutGrid,
  Activity,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
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

type View = 'landing' | 'gate' | 'application' | 'admin' | 'success' | 'duplicate';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState('');
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
          setDuplicateEmail(finalData.email);
          setView('duplicate');
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
