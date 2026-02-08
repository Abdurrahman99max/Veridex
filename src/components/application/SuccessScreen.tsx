import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';

interface SuccessScreenProps {
  track: 'core' | 'prep';
  onReturn: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ track, onReturn }) => {
  const [auditProgress, setAuditProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (track === 'core') {
      const timer = setInterval(() => {
        setAuditProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setShowContent(true), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(timer);
    } else {
      setShowContent(true);
    }
  }, [track]);

  const ParticleBurst = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0.5],
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
          }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className={`absolute left-1/2 top-1/2 w-2 h-2 rounded-full ${track === 'core' ? 'bg-indigo-500' : 'bg-amber-500'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-xl w-full relative">
        {track === 'core' && !showContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-8"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden">
              <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                style={{ width: `${auditProgress}%` }}
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-urbanist font-bold text-slate-900 uppercase tracking-tight">Initiating Audit Protocol</h3>
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-slate-400">
                <Terminal className="w-3 h-3" />
                <span>HASHING_ARTIFACTS... {auditProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white p-10 md:p-12 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 text-center space-y-8 relative"
          >
            <ParticleBurst />
            
            {track === 'core' ? (
              <div className="space-y-8">
                <div className="relative inline-block">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100"
                  >
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border border-dashed border-indigo-200 rounded-3xl -z-10"
                  />
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                      PROTOCOL: CORE_AUDIT_PENDING
                    </span>
                  </div>
                  <h2 className="text-3xl font-urbanist font-bold text-slate-900 tracking-tight">Application Transmitted</h2>
                  <p className="text-slate-500 font-inter leading-relaxed max-w-sm mx-auto text-sm">
                    Your technical artifacts have been hashed and entered into the manual review queue. We'll notify you once the audit protocol is complete.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">QUEUE_HASH</p>
                    <p className="text-sm font-urbanist font-bold text-slate-900 truncate">VX-2026-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">EST_AUDIT_TIME</p>
                    <p className="text-sm font-urbanist font-bold text-slate-900">48-72 Hours</p>
                  </div>
                </div>

                <Button 
                  onClick={onReturn}
                  className="w-full h-14 bg-slate-900 text-white rounded-xl font-urbanist font-bold hover:bg-black transition-all cursor-pointer shadow-lg shadow-slate-200 group"
                >
                  Return to Command Center
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <motion.div 
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-100"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase">
                      STATUS: PREP_TRACK_QUEUED
                    </span>
                  </div>
                  <h2 className="text-3xl font-urbanist font-bold text-slate-900 tracking-tight">Ready for Growth</h2>
                  <p className="text-slate-500 font-inter leading-relaxed max-w-sm mx-auto text-sm">
                    You've been successfully registered for the <span className="text-slate-900 font-bold underline decoration-amber-200 decoration-4 underline-offset-4">Preparation Track</span>. We'll reach out when the next cohort begins.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">NEXT STEP</p>
                      <p className="text-sm font-urbanist font-bold text-slate-900">Watch for Cohort Email</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={onReturn}
                  className="w-full h-14 bg-slate-900 text-white rounded-xl font-urbanist font-bold hover:bg-black transition-all cursor-pointer shadow-lg shadow-slate-200 group"
                >
                  Return to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
