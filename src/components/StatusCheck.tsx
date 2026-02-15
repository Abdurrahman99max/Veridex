import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  ArrowRight, 
  X, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Terminal,
  UserCheck,
  ShieldX,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StatusCheckProps {
  onClose: () => void;
}

type Phase = 'intro' | 'input' | 'searching' | 'result';

// Human-Centered State Mapping
const STATE_MAP: Record<string, { label: string; description: string; color: string }> = {
  'APPLIED': { 
    label: 'Application Received', 
    description: 'We have received your application. Our team is currently reviewing your details to ensure you are placed in the right track for your journey.',
    color: 'amber'
  },
  'ROUTED_TO_PREP': { 
    label: 'Preparation Program', 
    description: "You have been matched with our Preparation Program. This track is focused on helping you build the technical foundation you need to succeed in the Core track later on.",
    color: 'amber'
  },
  'ACCEPTED': { 
    label: 'Welcome to Veridex', 
    description: 'Great news! Your application has been approved. You now have full access to the platform. Please check your email for your next steps.',
    color: 'emerald'
  },
  'REJECTED': { 
    label: 'Review Finished', 
    description: "We have carefully reviewed your application, but we aren't able to move forward at this time. We truly appreciate the time you took to share your work with us.",
    color: 'rose'
  },
  'REVOKED': { 
    label: 'Account Closed', 
    description: 'Your access to Veridex has been ended due to a policy violation. If you believe this is a mistake, please reach out to our support team.',
    color: 'rose'
  },
  'SUSPENDED': { 
    label: 'Temporary Pause', 
    description: 'Your account is currently on a brief hold. This is a standard cooling-off period to help you realign with our community standards.',
    color: 'rose'
  }
};

export const StatusCheck: React.FC<StatusCheckProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [email, setEmail] = useState('');
  const [statusData, setStatusData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const addTerminalLine = async (line: string, delay = 500) => {
    if (!isMounted.current) return;
    setTerminalLines(prev => [...prev, line]);
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleCheck = async () => {
    if (!email || !email.includes('@')) return;
    
    setPhase('searching');
    setTerminalLines([]);
    setError(null);

    await addTerminalLine("Finding your records...");
    await addTerminalLine("Checking the Veridex network...");

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/status-lookup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      await addTerminalLine(`Looking for ${email.toLowerCase().trim()}...`, 600);
      
      const result = await response.json();

      await addTerminalLine("Reviewing your application progress...", 400);

      if (result.found) {
        await addTerminalLine("Record found. Just a moment...", 500);
        if (isMounted.current) {
          setStatusData(result);
          setPhase('result');
        }
      } else {
        await addTerminalLine("We couldn't find an application with that email.", 800);
        if (isMounted.current) {
          setPhase('input');
          setError("We couldn't find an application for that email. Please double-check the spelling.");
        }
      }
    } catch (err) {
      await addTerminalLine("Something went wrong. Please try again.", 1000);
      if (isMounted.current) {
        setPhase('input');
        setError("Our system is a bit busy right now. Please try again in a moment.");
      }
    }
  };

  const getStatusDisplay = () => {
    const currentState = statusData.suspended ? 'SUSPENDED' : (statusData.account_status === 'REVOKED' ? 'REVOKED' : statusData.application_state);
    const stateInfo = STATE_MAP[currentState] || STATE_MAP['APPLIED'];
    
    return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 p-5 rounded-2xl border border-${stateInfo.color}-100 bg-${stateInfo.color}-50/30`}>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            {statusData.suspended ? <ShieldAlert className="w-6 h-6 text-rose-500" /> : 
             statusData.account_status === 'REVOKED' ? <ShieldX className="w-6 h-6 text-rose-600" /> :
             statusData.application_state === 'ACCEPTED' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : 
             statusData.application_state === 'REJECTED' ? <AlertCircle className="w-6 h-6 text-rose-500" /> : 
             <Clock className="w-6 h-6 text-amber-500" />}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-0.5">Application Status</p>
            <h4 className="font-urbanist font-bold text-slate-900 text-lg leading-tight">{stateInfo.label}</h4>
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
          <p className="text-sm text-slate-600 font-inter leading-relaxed">
            {stateInfo.description}
          </p>
          {statusData.suspended && statusData.cooldown_until && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-rose-600 font-bold text-xs uppercase tracking-tight">
              Access returns on: {new Date(statusData.cooldown_until).toLocaleDateString()}
            </div>
          )}
        </div>

        {statusData.reliabilityTier && statusData.application_state === 'ACCEPTED' && (
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Community Standing</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
              statusData.reliabilityTier === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
              statusData.reliabilityTier === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-slate-500/20 text-slate-400'
            }`}>
              {statusData.reliabilityTier.replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button className="w-full bg-slate-900 text-white font-bold h-14 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200" onClick={onClose}>
            Back to Home
          </Button>
          <button 
            onClick={() => {
              setPhase('input');
              setStatusData(null);
            }}
            className="w-full text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            Check another email address
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">Status Check</span>
          </div>
          <h2 className="text-3xl font-urbanist font-bold text-slate-900 tracking-tight">How is your application doing?</h2>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <UserCheck className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-700 font-bold leading-tight">
                      For registered students
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed font-inter">
                      If you've already applied to Veridex, you can check your progress here. Otherwise, please start a new application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => setPhase('input')}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-urbanist font-bold hover:bg-black transition-all shadow-2xl shadow-slate-300 group text-base"
                >
                  I've applied already
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-16 border-slate-200 text-slate-600 rounded-2xl font-urbanist font-bold hover:bg-slate-50 transition-all text-base"
                >
                  Return to Main Page
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Email Address</label>
                <Input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="h-16 border-slate-200 rounded-2xl focus:border-slate-900 transition-all font-inter bg-white text-lg px-6"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="flex items-start gap-3 text-rose-500 text-sm bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setPhase('intro')}
                  className="h-16 px-6 border-slate-200 text-slate-600 rounded-2xl font-bold"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCheck}
                  disabled={!email.includes('@')}
                  className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-urbanist font-bold hover:bg-black transition-all shadow-2xl shadow-slate-300 group text-lg"
                >
                  Find my Application
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'searching' && (
            <motion.div 
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 py-10"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-xl font-urbanist font-bold text-slate-900">{terminalLines[terminalLines.length - 1]}</p>
                  <p className="text-sm text-slate-400 font-inter">Checking our student records in real-time...</p>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {statusData && getStatusDisplay()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
