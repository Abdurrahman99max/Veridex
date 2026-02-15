import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  ChevronRight,
  ExternalLink,
  Mail,
  MoreHorizontal,
  User,
  Users,
  LogOut,
  Activity,
  Zap,
  Download,
  Terminal,
  Menu,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  RefreshCcw,
  Archive,
  Eye,
  Trash2,
  Undo2,
  AlertTriangle,
  FileText,
  Loader2,
  Sun,
  Moon,
  Scale,
  Settings,
  UserX,
  FileSearch,
  BookOpen,
  CalendarDays
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "./ui/utils";

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  university: string;
  track: 'core' | 'prep';
  application_state: 'APPLIED' | 'ROUTED_TO_PREP' | 'ACCEPTED' | 'REJECTED' | 'REVOKED' | 'ARCHIVED';
  account_status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  reliabilityTier?: 'high' | 'medium' | 'under_review';
  strike_count?: number;
  cooldown_until?: string;
  adminFeedback?: string;
  rationale: string;
  skillCategory: string;
  proofUrl: string;
  gradYear?: string;
  submittedAt: string;
  tags: string[];
  projectContext?: string;
  motivation?: string;
  commitment?: string;
  documentPath?: string;
  // Prep specific
  skillLevel?: string;
  learningMethods?: string[];
  weeklyHours?: string;
  primaryGoal?: string;
}

interface AuditLog {
  id: string;
  entity_id: string;
  actor_id: string;
  action_type: string;
  previous_value: any;
  new_value: any;
  note: string;
  timestamp: string;
}

interface AdminHubProps {
  token: string;
  adminEmail: string;
}

interface PendingAction {
  id: string;
  type: 'status_update' | 'reroute' | 'delete' | 'revoke' | 'promote' | 'strike';
  newState?: string;
  tier?: string;
  feedback?: string;
  label: string;
  warning: string;
  strikeType?: string;
}

export function AdminHub({ token, adminEmail }: AdminHubProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs' | 'team' | 'policy'>('applicants');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'prep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [tempTier, setTempTier] = useState<'high' | 'medium' | 'under_review'>('medium');
  const [tempFeedback, setTempFeedback] = useState('');
  const [selectedAuditLogs, setSelectedAuditLogs] = useState<AuditLog[]>([]);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);
  const [docSignedUrl, setDocSignedUrl] = useState<string | null>(null);
  
  // Safety Interlock State
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [interlockConfirmed, setInterlockConfirmed] = useState(false);
  const [actionJustification, setActionJustification] = useState('');

  // Menu state
  // Session Timeout Logic
  useEffect(() => {
    let timeoutId: number;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        toast.info("Session expired for security. Please log in again.");
        localStorage.removeItem('vdx_admin_session');
        window.location.href = '/?dex=1';
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => document.addEventListener(event, resetTimer));
    
    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  const selectedApplicant = applicants.find(a => a.id === selectedId);

  useEffect(() => {
    if (selectedId && selectedApplicant) {
      setTempTier(selectedApplicant.reliabilityTier || 'medium');
      setTempFeedback(selectedApplicant.adminFeedback || '');
      fetchAuditLogs(selectedId);
      if (selectedApplicant.documentPath) {
        fetchSignedUrl(selectedApplicant.documentPath);
      } else {
        setDocSignedUrl(null);
      }
    }
  }, [selectedId, selectedApplicant]);

  const fetchSignedUrl = async (path: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/signed-url`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({ path })
      });
      if (response.ok) {
        const { url } = await response.json();
        setDocSignedUrl(url);
      }
    } catch (err) {
      console.error('Signed URL fetch error:', err);
    }
  };

  const fetchAuditLogs = async (id: string) => {
    setIsFetchingLogs(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (response.ok) {
        const allLogs: AuditLog[] = await response.json();
        setSelectedAuditLogs(allLogs.filter(log => log.entity_id === id));
      }
    } catch (err) {
      console.error('Audit sync error:', err);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const fetchAllData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${publicAnonKey}` };
      const [appRes, logRes, whiteRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants`, { headers }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/audit-logs`, { headers }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/whitelist`, { headers })
      ]);
      if (appRes.ok) setApplicants(await appRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
      if (whiteRes.ok) setWhitelist(await whiteRes.json());
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 45000);
    return () => clearInterval(interval);
  }, []);

  const executeAction = async () => {
    if (!pendingAction || !interlockConfirmed) return;
    setIsUpdatingStatus(pendingAction.id);
    const id = pendingAction.id;

    try {
        const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        let endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/execute-transition`;
        let method = 'POST';
        let body: any = { 
            applicationId: id,
            operator: adminEmail, 
            confirmed: true,
            idempotencyKey
        };

        if (pendingAction.type === 'status_update') {
            body = { 
                ...body,
                newState: pendingAction.newState === 'verified' ? 'ACCEPTED' : (pendingAction.newState === 'flagged' ? 'REJECTED' : 'ARCHIVED'),
                reason: actionJustification || tempFeedback || 'Status update via Admin Hub',
                reliabilityTier: pendingAction.tier
            };
        } else if (pendingAction.type === 'reroute') {
            body = { ...body, newState: 'ROUTED_TO_PREP', reason: actionJustification || 'Reroute to Preparation Program' };
        } else if (pendingAction.type === 'promote') {
            body = { ...body, newState: 'ACCEPTED', reason: actionJustification || 'Graduated from Prep Program', operator: 'SYSTEM_PROMOTION' };
        } else if (pendingAction.type === 'revoke') {
            body = { ...body, newState: 'REVOKED', reason: actionJustification };
        } else if (pendingAction.type === 'strike') {
            endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/issue-strike`;
            body = {
                applicationId: id,
                reason: actionJustification,
                operator: adminEmail,
                strikeType: pendingAction.strikeType || 'POLICY_VIOLATION',
                idempotencyKey
            };
        }

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast.success(`${pendingAction.label} successful.`);
            setPendingAction(null);
            setInterlockConfirmed(false);
            setActionJustification('');
            fetchAllData();
        } else {
            const err = await response.json();
            throw new Error(err.error || 'Operation failed');
        }
    } catch (err: any) {
        toast.error(err.message || 'Transmission error');
    } finally {
        setIsUpdatingStatus(null);
    }
  };

  const initiateAction = (action: PendingAction) => {
    setPendingAction(action);
    setInterlockConfirmed(false);
    setActionJustification(action.feedback || '');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'University', 'Track', 'Status', 'Strikes', 'Date'];
    const rows = applicants.map(a => [
      a.id, a.fullName, a.email, a.university, a.track, a.application_state, a.strike_count || 0, new Date(a.submittedAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `veridex_hardened_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported with governance flags.');
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesTrack = filter === 'all' || a.track === filter;
    const matchesSearch = 
      (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch && (activeTab === 'applicants' ? a.application_state !== 'ARCHIVED' : true);
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const bgColor = theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-[#F1F5F9]';
  const surfaceColor = theme === 'dark' ? 'bg-[#0D0D0F]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-white/5' : 'border-slate-200';
  const textColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const inputBg = theme === 'dark' ? 'bg-white/5' : 'bg-slate-100';

  const Sidebar = () => (
    <div className={`flex flex-col h-full ${surfaceColor} border-r ${borderColor}`}>
      <div className={`p-6 border-b ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold ${headingColor} tracking-tighter text-lg uppercase`}>VERIDEX</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden"><X className="w-5 h-5" /></button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2">Hardened Control</div>
        <button onClick={() => { setActiveTab('applicants'); setFilter('all'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Inbox className="w-4 h-4" /> Operations Hub
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('core'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Zap className="w-4 h-4" /> Core Track
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('prep'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'prep' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Activity className="w-4 h-4" /> Prep Program
        </button>
        
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2 mt-6">Governance</div>
        <button onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Terminal className="w-4 h-4" /> Audit Registry
        </button>
        <button onClick={() => { setActiveTab('policy'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'policy' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Scale className="w-4 h-4" /> Policy Center
        </button>
        <button onClick={() => { setActiveTab('team'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'team' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Users className="w-4 h-4" /> Admin Access
        </button>
      </nav>

      <div className={`p-4 border-t ${borderColor}`}>
        <div className={`flex items-center gap-3 p-3 rounded-xl ${inputBg}`}>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold ${headingColor} truncate`}>{adminEmail}</div>
            <div className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">Verified Admin</div>
          </div>
          <button onClick={() => { localStorage.removeItem('vdx_admin_session'); window.location.href = '/?dex=1'; }} className="p-2 opacity-50 hover:opacity-100"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} font-mono text-sm transition-colors duration-500 overflow-hidden relative`}>
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-[280px] z-[101] md:hidden"><Sidebar /></motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-4 md:px-6 ${surfaceColor} shrink-0`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2"><Menu className="w-5 h-5" /></button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search registry..." className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleExportCSV} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border ${borderColor} ${surfaceColor} hover:bg-white/5 transition-colors text-[11px] font-bold uppercase`}>
              <Download className="w-3.5 h-3.5" /> Data Export
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-full border ${borderColor} ${surfaceColor}`}>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <button onClick={fetchAllData} className={`p-2 rounded-full border ${borderColor} hover:bg-white/5`}><RefreshCcw className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
          ) : activeTab === 'applicants' ? (
            <div className="min-w-full">
              <table className="w-full border-collapse">
                <thead className={`sticky top-0 ${surfaceColor} z-10`}>
                  <tr className={`border-b ${borderColor} text-[10px] uppercase tracking-widest opacity-50 font-bold`}>
                    <th className="text-left py-4 px-4 md:px-6">Identity</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden sm:table-cell">Institution</th>
                    <th className="text-left py-4 px-4 md:px-6">Standing</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden md:table-cell">Strikes</th>
                    <th className="text-right py-4 px-4 md:px-6">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((a) => (
                    <tr key={a.id} className={`border-b ${borderColor} hover:bg-white/[0.02] cursor-default transition-all ${selectedId === a.id ? 'bg-indigo-500/5' : ''}`}>
                      <td className="py-4 px-4 md:px-6 cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="flex flex-col">
                          <span className="font-bold text-[10px] opacity-40 uppercase tracking-tighter mb-0.5">{a.id}</span>
                          <span className={`${headingColor} font-bold truncate max-w-[150px] sm:max-w-none`}>{a.fullName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="text-[12px] opacity-70 truncate max-w-[200px]">{a.university}</div>
                      </td>
                      <td className="py-4 px-4 md:px-6 cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            a.application_state === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500' : 
                            a.application_state === 'REJECTED' || a.application_state === 'REVOKED' ? 'bg-rose-500/10 text-rose-500' : 
                            a.application_state === 'ROUTED_TO_PREP' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {a.account_status === 'SUSPENDED' ? 'SUSPENDED' : (a.application_state || 'APPLIED')}
                          </span>
                          {a.reliabilityTier && (
                             <span className="text-[8px] font-bold uppercase tracking-tight opacity-50 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                                {a.reliabilityTier.replace('_', ' ')}
                             </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <span className={`text-xs font-bold ${a.strike_count && a.strike_count > 0 ? 'text-rose-500' : 'opacity-20'}`}>
                          {a.strike_count || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 md:px-6 text-right relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === a.id ? null : a.id); }} className={`p-2 rounded-md hover:bg-white/10 transition-colors ${activeMenuId === a.id ? 'bg-white/10 text-indigo-500' : 'text-slate-500'}`}>
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {activeMenuId === a.id && (
                          <div ref={menuRef} className={`absolute right-10 top-12 w-48 ${surfaceColor} border ${borderColor} rounded-xl shadow-2xl z-[50] overflow-hidden py-1 animate-in fade-in zoom-in duration-150`}>
                            <button onClick={() => { setSelectedId(a.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors text-left"><Eye className="w-4 h-4 text-indigo-500" /> View Detailed File</button>
                            <button onClick={() => initiateAction({ id: a.id, type: 'status_update', newState: 'archived', label: 'Archive Record', warning: 'Moving to deep archive. Student standing will be preserved but hidden from active view.' })} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors text-left"><Archive className="w-4 h-4 text-amber-500" /> Archive Record</button>
                            <div className="h-px bg-white/5 my-1" />
                            <button onClick={() => initiateAction({ id: a.id, type: 'strike', label: 'Issue Formal Strike', warning: 'This action initiates the disciplinary escalation protocol. Multiple strikes will lead to automatic suspension or revocation.' })} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-rose-500/10 text-rose-500 transition-colors text-left font-bold"><AlertTriangle className="w-4 h-4" /> Issue Strike</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'logs' ? (
            <div className="p-6 space-y-4">
              <h2 className={`${headingColor} font-bold text-lg mb-6 uppercase tracking-widest`}>Registry Immutable Audit Log</h2>
              {auditLogs.map((log) => (
                <div key={log.id} className={`${surfaceColor} border ${borderColor} p-4 rounded-lg flex items-start gap-4 hover:border-indigo-500/50 transition-all`}>
                  <div className={`p-2 rounded bg-white/5`}><Activity className="w-4 h-4 text-indigo-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{log.action_type}</span>
                      <span className="text-[10px] opacity-40">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs opacity-70 mb-2">{log.note}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold opacity-30 uppercase">Actor:</span>
                        <span className="text-[10px] font-bold text-indigo-500/70">{log.actor_id}</span>
                        <span className="text-[9px] font-bold opacity-30 uppercase ml-4">Entity:</span>
                        <span className="text-[10px] font-bold text-slate-500">{log.entity_id}</span>
                        <span className="text-[9px] opacity-20 uppercase ml-auto">Hash: {log.id.substring(0, 12)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'policy' ? (
            <div className="p-6 max-w-4xl mx-auto space-y-8">
               <h2 className={`text-xl font-bold ${headingColor} mb-2 uppercase tracking-tighter`}>Governance Policy Center</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${surfaceColor} border ${borderColor} p-6 rounded-2xl space-y-4`}>
                    <div className="flex items-center gap-3 mb-2">
                        <Scale className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Strike Enforcement Policy</h3>
                    </div>
                    <div className="space-y-3 opacity-60 text-[11px]">
                        <div className="flex justify-between"><span>Warning Threshold:</span> <span>1 Strike</span></div>
                        <div className="flex justify-between"><span>Suspension Threshold:</span> <span>3 Strikes</span></div>
                        <div className="flex justify-between"><span>Revocation Threshold:</span> <span>5 Strikes</span></div>
                        <div className="flex justify-between"><span>Cooldown Period:</span> <span>7 Days</span></div>
                    </div>
                    <button className="w-full py-2 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-500 hover:text-white transition-all">Propose Policy Change</button>
                  </div>
                  <div className={`${surfaceColor} border ${borderColor} p-6 rounded-2xl space-y-4 opacity-50`}>
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Active Safety Interlocks</h3>
                    </div>
                    <p className="text-[10px] leading-relaxed italic">All interlocks are currently operational. Mandatory justifications are required for 100% of administrative mutations.</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="p-6 max-w-4xl mx-auto space-y-8">
              <h2 className={`text-xl font-bold ${headingColor} mb-2 uppercase tracking-tighter`}>Administrative Access Control</h2>
              <div className={`${surfaceColor} border ${borderColor} rounded-xl overflow-hidden`}>
                <div className="p-4 border-b border-white/5 flex gap-4">
                  <input type="email" placeholder="admin@veridex.io" className={`flex-1 ${inputBg} border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`} value={newTeamMember} onChange={(e) => setNewTeamMember(e.target.value)} />
                  <button onClick={() => {}} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all">Grant Access</button>
                </div>
                <div className="divide-y divide-white/5">
                  {whitelist.map((email) => (
                    <div key={email} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs">{email.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className={`text-sm font-bold ${headingColor}`}>{email}</div>
                          <div className="text-[10px] opacity-40 uppercase tracking-widest">{email === adminEmail ? 'System Authority' : 'Regional Administrator'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPendingAction(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${surfaceColor} border-2 border-indigo-500/20 w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><ShieldAlert className="w-6 h-6" /></div>
                <div>
                  <h3 className={`text-lg font-bold ${headingColor} tracking-tight`}>Safety Interlock</h3>
                  <p className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">Administrative Confirmation Required</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
                <p className={`text-xs font-bold ${headingColor} mb-2 uppercase tracking-wide`}>{pendingAction.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{pendingAction.warning}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Immutable Justification</label>
                  <textarea className={`w-full h-24 ${inputBg} border ${borderColor} rounded-xl p-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none`} placeholder="Detail the reason for this governance action..." value={actionJustification} onChange={(e) => setActionJustification(e.target.value)} />
                </div>
                <label className={`flex items-start gap-3 p-4 rounded-xl border ${interlockConfirmed ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5'} cursor-pointer transition-all`}>
                  <input type="checkbox" className="mt-0.5" checked={interlockConfirmed} onChange={(e) => setInterlockConfirmed(e.target.checked)} />
                  <span className="text-[11px] leading-relaxed select-none">I verify this action complies with Veridex policy and acknowledge it will be archived in the audit logs.</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => setPendingAction(null)} className="flex-1 py-3 text-xs font-bold opacity-50 hover:opacity-100 transition-all uppercase">Cancel</button>
                  <button onClick={executeAction} disabled={!interlockConfirmed || actionJustification.length < 5 || isUpdatingStatus !== null} className="flex-[2] bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-xs uppercase transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                    {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Confirm Action
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`w-full h-full md:max-w-6xl md:h-[90vh] ${surfaceColor} border ${borderColor} md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative`}>
              <div className={`p-6 border-b ${borderColor} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><User className="w-6 h-6" /></div>
                  <div>
                    <h3 className={`text-xl font-bold ${headingColor}`}>{selectedApplicant.fullName}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-40">
                      <span>ID: {selectedApplicant.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span>{selectedApplicant.track === 'core' ? 'Core Protocol' : 'Prep Program'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span className={selectedApplicant.account_status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}>{selectedApplicant.account_status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                <div className="w-full md:w-2/3 p-8 space-y-8">
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1"><div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Identity</div><div className={`text-sm font-bold ${headingColor}`}>{selectedApplicant.email}</div></div>
                    <div className="space-y-1"><div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Academic Institution</div><div className={`text-sm font-bold ${headingColor}`}>{selectedApplicant.university}</div></div>
                  </section>

                  {/* Core Specific: Verification Data */}
                  {selectedApplicant.track === 'core' && (
                    <section className="space-y-4">
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Student Verification Data</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                <div className="text-[9px] uppercase opacity-40">Verification Document</div>
                                {docSignedUrl ? (
                                    <a href={docSignedUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 font-bold text-xs hover:underline"><FileSearch className="w-4 h-4" /> View ID Upload</a>
                                ) : <span className="text-[10px] opacity-20 italic">No document uploaded.</span>}
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                <div className="text-[9px] uppercase opacity-40">Expected Graduation</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-white"><CalendarDays className="w-4 h-4 text-indigo-500" /> Class of {selectedApplicant.gradYear || '2026'}</div>
                            </div>
                        </div>
                    </section>
                  )}

                  {/* Prep Specific: Application Data */}
                  {selectedApplicant.track === 'prep' && (
                    <section className="space-y-4">
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Prep Program Enrollment Data</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                                <div className="text-[9px] uppercase opacity-40">Current Proficiency</div>
                                <div className="text-xs font-bold text-white capitalize">{selectedApplicant.skillLevel?.replace('_', ' ') || 'N/A'}</div>
                                <div className="flex flex-wrap gap-1">
                                    {selectedApplicant.learningMethods?.map(m => <span key={m} className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] uppercase">{m}</span>)}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                                <div className="text-[9px] uppercase opacity-40">Program Commitment</div>
                                <div className="text-xs font-bold text-white">{selectedApplicant.weeklyHours || 'N/A'} / Week</div>
                                <div className="text-[9px] text-amber-500/60 font-bold uppercase">Goal: {selectedApplicant.primaryGoal?.replace('_', ' ') || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                            <div className="text-[9px] uppercase opacity-40 mb-2">Institutional Motivation</div>
                            <p className="text-xs leading-relaxed italic opacity-70">"{selectedApplicant.motivation || 'N/A'}"</p>
                        </div>
                    </section>
                  )}

                  <section className="space-y-4">
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Technical Rationale & Proof</div>
                    <div className={`p-6 rounded-2xl bg-white/5 border border-white/5`}>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{selectedApplicant.skillCategory || 'Generalist'}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${textColor}`}>{selectedApplicant.rationale || selectedApplicant.projectContext || 'No rationale provided.'}</p>
                      {selectedApplicant.proofUrl && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <a href={selectedApplicant.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 hover:underline">
                                View Technical Assets <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Full Registry Data</div>
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                        {Object.entries(selectedApplicant).map(([key, value]) => {
                            // Skip already displayed or sensitive/internal fields
                            const skipped = ['id', 'fullName', 'email', 'university', 'track', 'application_state', 'account_status', 'reliabilityTier', 'strike_count', 'cooldown_until', 'adminFeedback', 'rationale', 'skillCategory', 'proofUrl', 'gradYear', 'submittedAt', 'tags', 'projectContext', 'motivation', 'commitment', 'documentPath', 'skillLevel', 'learningMethods', 'weeklyHours', 'primaryGoal'];
                            if (skipped.includes(key)) return null;
                            if (typeof value === 'object' && value !== null) return null; // Skip complex objects for this view

                            return (
                                <div key={key} className="space-y-1 p-2 rounded bg-white/5 border border-white/5 overflow-hidden">
                                    <div className="text-[8px] uppercase opacity-40 truncate">{key.replace(/([A-Z])/g, ' $1')}</div>
                                    <div className="text-xs font-mono truncate">{String(value)}</div>
                                </div>
                            );
                        })}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Security History</div>
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 max-h-[200px] overflow-auto`}>
                        {isFetchingLogs ? <Loader2 className="w-4 h-4 animate-spin mx-auto opacity-20" /> : 
                         selectedAuditLogs.length > 0 ? (
                            <div className="space-y-3">
                                {selectedAuditLogs.map(log => (
                                    <div key={log.id} className="text-[10px] font-mono border-l-2 border-indigo-500/20 pl-3">
                                        <div className="flex justify-between opacity-40 mb-1"><span>{new Date(log.timestamp).toLocaleString()}</span><span>{log.actor_id}</span></div>
                                        <div className="font-bold">{log.action_type}</div>
                                        <div className="opacity-50 italic mt-1">{log.note}</div>
                                    </div>
                                ))}
                            </div>
                         ) : <div className="text-center py-4 text-[10px] opacity-20">No security incidents recorded.</div>}
                    </div>
                  </section>
                </div>

                <div className={`w-full md:w-1/3 p-8 ${inputBg} space-y-8`}>
                  <div className="space-y-6">
                    <div className={cn("p-4 rounded-xl border flex flex-col gap-3", selectedApplicant.track === 'core' ? "bg-indigo-500/5 border-indigo-500/20" : "bg-amber-500/5 border-amber-500/20")}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {selectedApplicant.track === 'core' ? <Zap className="w-4 h-4 text-indigo-500" /> : <Activity className="w-4 h-4 text-amber-500" />}
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest", selectedApplicant.track === 'core' ? "text-indigo-500" : "text-amber-500")}>{selectedApplicant.track === 'core' ? 'Core Protocol' : 'Prep Program'}</span>
                            </div>
                            <span className="text-[8px] font-bold bg-white/10 px-2 py-0.5 rounded">VERIFIED</span>
                        </div>
                        <div className="pt-2 border-t border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] opacity-40 uppercase">Reliability Tier</span>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase">{selectedApplicant.reliabilityTier || 'UNRATED'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] opacity-40 uppercase">Strike Count</span>
                                <span className={cn("text-[10px] font-bold", (selectedApplicant.strike_count || 0) > 0 ? "text-rose-500" : "opacity-40")}>{selectedApplicant.strike_count || 0}</span>
                            </div>
                            {selectedApplicant.account_status === 'SUSPENDED' && (
                                <div className="mt-2 p-2 bg-rose-500/10 rounded border border-rose-500/20 text-[9px] text-rose-500 font-bold uppercase tracking-tighter">
                                    SUSPENDED UNTIL {new Date(selectedApplicant.cooldown_until!).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Decision Center</div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => initiateAction({ id: selectedApplicant.id, type: 'status_update', newState: 'verified', tier: tempTier, feedback: tempFeedback, label: 'Grant Full Access', warning: 'This will formally admit the student into the Veridex registry and trigger notification events.' })} disabled={selectedApplicant.application_state === 'ACCEPTED'} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase border transition-all", selectedApplicant.application_state === 'ACCEPTED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white")}><ShieldCheck className="w-3.5 h-3.5" /> Approve</button>
                        <button onClick={() => initiateAction({ id: selectedApplicant.id, type: 'status_update', newState: 'flagged', feedback: tempFeedback, label: 'Deny Enrollment', warning: 'The application will be rejected. This action is auditable and final for this submission.' })} disabled={selectedApplicant.application_state === 'REJECTED'} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase border transition-all", selectedApplicant.application_state === 'REJECTED' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white")}><ShieldAlert className="w-3.5 h-3.5" /> Decline</button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Governance & Discipline</div>
                      {selectedApplicant.track === 'prep' && selectedApplicant.application_state === 'ACCEPTED' && (
                        <button onClick={() => initiateAction({ id: selectedApplicant.id, type: 'promote', label: 'Institutional Promotion', warning: 'Transitioning student to Core Track. This graduation event will be recorded in the immutable audit log.' })} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold text-[10px] uppercase border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all"><Zap className="w-3.5 h-3.5" /> Promote to Core</button>
                      )}
                      <button onClick={() => initiateAction({ id: selectedApplicant.id, type: 'strike', strikeType: 'POLICY_VIOLATION', label: 'Issue Formal Strike', warning: 'Executing disciplinary strike. Automated suspension protocols will engage if thresholds are breached.' })} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-[10px] uppercase border border-amber-500/30 hover:bg-amber-500 hover:text-white transition-all"><AlertTriangle className="w-3.5 h-3.5" /> Issue Strike</button>
                      <button onClick={() => initiateAction({ id: selectedApplicant.id, type: 'revoke', label: 'Total Access Revocation', warning: 'CRITICAL: Revoking all institutional access. This account will be PERMANENTLY flagged and disabled.' })} disabled={selectedApplicant.application_state === 'REVOKED'} className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase border border-rose-500/30 transition-all", selectedApplicant.application_state === 'REVOKED' ? "bg-rose-500/10 text-rose-500 opacity-50" : "bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white")}><UserX className="w-3.5 h-3.5" /> Revoke Access</button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Administrative Narrative</div>
                        <textarea className={`w-full h-32 ${surfaceColor} border ${borderColor} rounded-xl p-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none`} placeholder="Enter professional assessment for audit record..." value={tempFeedback} onChange={(e) => setTempFeedback(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
