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
  ShieldX
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
    description: 'Your file has been logged in the Veridex registry and is awaiting manual review by our administration team.',
    color: 'amber'
  },
  'ROUTED_TO_PREP': { 
    label: 'Pathway: Preparation Program', 
    description: "You've been selected for our Preparation Program track. This is designed to help you strengthen your foundation before entering the Core track.",
    color: 'amber'
  },
  'ACCEPTED': { 
    label: 'Access Granted', 
    description: 'Congratulations! Your application has been verified. Please keep an eye on your inbox for official onboarding instructions.',
    color: 'emerald'
  },
  'REJECTED': { 
    label: 'Review Concluded', 
    description: "We've carefully reviewed your submission but aren't able to move forward at this time. We appreciate your interest in the platform.",
    color: 'rose'
  },
  'REVOKED': { 
    label: 'Access Terminated', 
    description: 'Your standing has been permanently revoked for multiple policy violations or administrative non-compliance.',
    color: 'rose'
  },
  'SUSPENDED': { 
    label: 'Access Suspended', 
    description: 'Your account is currently under a cooling-off period due to institutional policy violations.',
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

  const addTerminalLine = async (line: string, delay = 400) => {
    if (!isMounted.current) return;
    setTerminalLines(prev => [...prev, line]);
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleCheck = async () => {
    if (!email || !email.includes('@')) return;
    
    setPhase('searching');
    setTerminalLines([]);
    setError(null);

    await addTerminalLine("Initializing secure connection...");
    await addTerminalLine("Accessing Veridex Registry v1.1.0...");

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/status-lookup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      await addTerminalLine(`Querying registry for: ${email.toLowerCase().trim()}...`, 600);
      
      const result = await response.json();

      await addTerminalLine("Synchronizing with state machine...", 400);

      if (result.found) {
        await addTerminalLine("Record located. Checking enforcement layers...", 500);
        if (isMounted.current) {
          setStatusData(result);
          setPhase('result');
        }
      } else {
        await addTerminalLine("Error: No record associated with this identity.", 800);
        if (isMounted.current) {
          setPhase('input');
          setError("We couldn't find an application for that email. Please double-check the spelling.");
        }
      }
    } catch (err) {
      await addTerminalLine("System failure: Connection interrupted.", 1000);
      if (isMounted.current) {
        setPhase('input');
        setError("System busy. Please try again later.");
      }
    }
  };

  const getStatusDisplay = () => {
    const currentState = statusData.suspended ? 'SUSPENDED' : (statusData.account_status === 'REVOKED' ? 'REVOKED' : statusData.application_state);
    const stateInfo = STATE_MAP[currentState] || STATE_MAP['APPLIED'];
    
    return (
      <div className="space-y-6">
        <div className={`flex items-center gap-4 p-4 rounded-xl border border-${stateInfo.color}-100 bg-${stateInfo.color}-50/50`}>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            {statusData.suspended ? <ShieldAlert className="w-6 h-6 text-rose-500" /> : 
             statusData.account_status === 'REVOKED' ? <ShieldX className="w-6 h-6 text-rose-600" /> :
             statusData.application_state === 'ACCEPTED' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : 
             statusData.application_state === 'REJECTED' ? <AlertCircle className="w-6 h-6 text-rose-500" /> : 
             <Clock className="w-6 h-6 text-amber-500" />}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">REGISTRY STATUS</p>
            <h4 className="font-urbanist font-bold text-slate-900">{stateInfo.label}</h4>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
          <p className="text-sm text-slate-600 font-inter leading-relaxed">
            {stateInfo.description}
          </p>
          {statusData.suspended && statusData.cooldown_until && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-rose-600 font-bold text-xs uppercase tracking-tighter">
              COOLDOWN ACTIVE UNTIL: {new Date(statusData.cooldown_until).toLocaleDateString()} {new Date(statusData.cooldown_until).toLocaleTimeString()}
            </div>
          )}
        </div>

        {statusData.reliabilityTier && statusData.application_state === 'ACCEPTED' && (
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg text-white">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Reliability Tier</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
              statusData.reliabilityTier === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
              statusData.reliabilityTier === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-slate-500/20 text-slate-400'
            }`}>
              {statusData.reliabilityTier.replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl hover:bg-black transition-all" onClick={onClose}>
            Acknowledge
          </Button>
          <button 
            onClick={() => {
              setPhase('input');
              setStatusData(null);
            }}
            className="w-full text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            Check another identity
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
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">HARDENED_ACCESS</span>
          </div>
          <h2 className="text-2xl font-urbanist font-bold text-slate-900">Identity Portal</h2>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <UserCheck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      Registry Standing Check
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter your institutional identifier to verify your current status within the Veridex network.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => setPhase('input')}
                  className="w-full h-14 bg-slate-900 text-white rounded-xl font-urbanist font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 group"
                >
                  Lookup Application
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-14 border-slate-200 text-slate-600 rounded-xl font-urbanist font-bold hover:bg-slate-50 transition-all"
                >
                  Return
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
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">IDENTIFIER (EMAIL)</label>
                <Input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="h-14 border-slate-200 focus:border-slate-900 transition-all font-inter bg-white"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="flex items-start gap-2 text-rose-500 text-xs bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setPhase('intro')}
                  className="h-14 px-4 border-slate-200 text-slate-600 rounded-xl"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCheck}
                  disabled={!email.includes('@')}
                  className="flex-1 h-14 bg-slate-900 text-white rounded-xl font-urbanist font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 group"
                >
                  Query Registry
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              className="space-y-6"
            >
              <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[11px] min-h-[160px] shadow-inner border border-slate-800">
                <div className="space-y-2">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">›</span>
                      <span className="text-slate-300">{line}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 items-center">
                    <span className="text-emerald-500 font-bold">›</span>
                    <span className="w-2 h-4 bg-emerald-500/50 animate-pulse" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 font-inter italic">
                Scanning audit logs and state machine...
              </p>
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
