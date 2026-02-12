import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Loader2, Mail, Lock, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminLoginProps {
  onSuccess: (token: string, email: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Invalid administrative credentials');
      return;
    }
    
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: normalizedEmail })
      });
      
      const data = await response.json();
      if (data.success) {
        setStep('otp');
        toast.success('Access code sent via email');
      } else {
        toast.error(data.error || 'Failed to request code');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      handleOtpSubmit();
    }
  }, [otp]);

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: normalizedEmail, code: otp.join('') })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Access Granted. Opening Admin Hub.');
        onSuccess(data.token, normalizedEmail);
      } else {
        toast.error(data.error || 'Invalid Code');
        setOtp(['', '', '', '', '', '']);
        otpRefs[0].current?.focus();
      }
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center mb-8 shadow-[0_0_50px_-10px_rgba(99,102,241,0.6)] relative group"
          >
            <Shield className="w-10 h-10 text-white z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white tracking-tighter mb-3 uppercase flex items-center gap-3 justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
              Veridex Hub
            </h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-slate-800" />
              Administrator Portal
              <span className="w-8 h-px bg-slate-800" />
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/5 p-10 rounded-[2rem] backdrop-blur-xl shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-indigo-500/[0.02] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Authorized Identity</label>
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="email" 
                      required
                      placeholder="admin@veridex.io"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all outline-none text-sm placeholder:text-slate-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-white/5"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      REQUEST ACCESS
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-3 text-center">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold">Identity Verification</label>
                  <p className="text-[11px] text-slate-500 font-medium">Delivered to <span className="text-slate-300">{email}</span></p>
                </div>

                <div className="flex justify-between gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      className="w-full h-16 bg-black/40 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'SIGN IN'
                    )}
                  </button>
                  <button 
                    onClick={() => setStep('email')}
                    className="w-full text-[10px] text-slate-600 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" />
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3 text-[9px] text-slate-600 uppercase tracking-[0.4em] font-bold">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Secure Connection Active
          </div>
          <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-[8px] text-slate-700 uppercase tracking-widest">
            Veridex Security v1.0.4
          </div>
        </motion.div>
      </div>
    </div>
  );
}
