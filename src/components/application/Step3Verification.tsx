import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  AlertTriangle,
  ArrowRight,
  Lock,
  Zap
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ApplicationLayout } from './ApplicationLayout';
import { Button } from "../ui/button";

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface VerificationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  prevData: any;
  track: 'core' | 'prep';
}

export const Step3Verification: React.FC<VerificationProps> = ({ onNext, onBack, prevData, track }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'uploading' | 'secured' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setErrorMessage('Document exceeds 5MB limit.');
        return;
      }
      setFile(selected);
      setErrorMessage('');
    }
  };

  const startVerification = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus('encrypting');
    
    // Aesthetic delay for processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('uploading');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const emailFolder = prevData.email.replace(/[^a-zA-Z0-9]/g, '_');
      const filePath = `verification/${emailFolder}/${fileName}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', filePath);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/vault/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Upload failed');
      }

      const result = await response.json();
      setStatus('secured');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onNext({ documentPath: filePath });
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <ApplicationLayout 
      currentStep={3} 
      totalSteps={4} 
      title="Identity Verification" 
      onBack={onBack}
    >
      <div className="w-full space-y-8 pb-20">
        <div className="text-center space-y-3 px-2">
          <h2 className="text-xl sm:text-2xl font-urbanist font-bold text-slate-900">Verify your identity</h2>
          <p className="text-slate-500 font-inter text-sm max-w-md mx-auto">
            Upload proof of your student status for our review team. This helps us ensure the integrity of the platform.
          </p>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {status === 'idle' || status === 'error' ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl transition-all ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-500/20">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-urbanist font-bold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-indigo-600 uppercase font-mono tracking-widest mt-1">DOCUMENT READY FOR UPLOAD</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-urbanist font-bold text-slate-900">Upload Status Proof</p>
                        <p className="text-xs text-slate-400 font-inter mt-1">Portal Screenshot or Enrollment Letter (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-mono font-bold tracking-tight uppercase">{errorMessage}</p>
                  </div>
                )}

                <Button 
                  onClick={startVerification}
                  disabled={!file || isUploading}
                  className={`w-full h-14 rounded-xl shadow-xl font-urbanist font-bold transition-all text-sm sm:text-base ${file && !isUploading ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-300'}`}
                >
                  Verify Identity
                  <ShieldCheck className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                    {status === 'secured' ? (
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center scale-110 transition-transform duration-500">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-indigo-400 uppercase">
                        {status === 'encrypting' && 'ENCRYPTING DATA'}
                        {status === 'uploading' && 'UPLOADING TO SECURE STORAGE'}
                        {status === 'secured' && 'SUCCESS: UPLOAD COMPLETE'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-urbanist font-bold">
                      {status === 'encrypting' && 'Securing your data...'}
                      {status === 'uploading' && 'Uploading...'}
                      {status === 'secured' && 'Upload Successful'}
                    </h3>

                    <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: status === 'secured' ? '100%' : '70%' }}
                        transition={{ duration: status === 'secured' ? 0.5 : 2 }}
                        className={`h-full ${status === 'secured' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 w-full max-w-[200px]">
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                      <span>Service</span>
                      <span>Veridex Secure</span>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                      <span>Server</span>
                      <span>{projectId.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 font-inter leading-relaxed">
            All documents are stored in a private, encrypted storage bucket. Only authorized administrators can view your identity proof for manual verification.
          </p>
        </div>
      </div>
    </ApplicationLayout>
  );
};
