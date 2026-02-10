import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Loader2, Mail, Lock, CheckCircle2 } from 'lucide-react';
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
        toast.success('Protocol authorization code sent');
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
        toast.success('Access Granted. Opening Ghost Hub.');
        onSuccess(data.token, normalizedEmail);
      } else {
        toast.error(data.error || 'Invalid Protocol Code');
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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tighter mb-2 uppercase">Veridex Hub</h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase">Internal Audit Protocol</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl backdrop-blur-sm shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleEmailSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500">Authorized Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="email" 
                      required
                      placeholder="admin@veridex.com"
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-white text-black py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      REQUEST ACCESS CODE
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500">Enter Security Protocol Code</label>
                  <p className="text-[11px] text-slate-400">Sent to {email}</p>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 bg-black/50 border border-white/10 rounded-lg text-center text-xl font-bold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-white text-black py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'VERIFY & ACCESS'
                    )}
                  </button>
                  <button 
                    onClick={() => setStep('email')}
                    className="w-full text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Use different email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Security Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          Secure Admin Environment Protocol active
        </div>
      </div>
    </div>
  );
}
