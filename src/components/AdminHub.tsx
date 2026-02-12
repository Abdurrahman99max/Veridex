import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Resizable } from 're-resizable';
import { 
  Shield, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  ChevronRight,
  ExternalLink,
  Mail,
  MoreVertical,
  MoreHorizontal,
  ArrowUpRight,
  User,
  Users,
  Settings,
  Keyboard,
  FileText,
  Trash2,
  Undo2,
  Loader2,
  Moon,
  Sun,
  LogOut,
  Activity,
  Zap,
  Download,
  Terminal,
  Key,
  Menu,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  UserPlus,
  RefreshCcw,
  Archive,
  Eye,
  AlertTriangle
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
  status: 'pending' | 'verified' | 'flagged' | 'archived';
  reliabilityTier?: 'high' | 'medium' | 'under_review';
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
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  operator?: string;
  timestamp: string;
}

interface AdminHubProps {
  token: string;
  adminEmail: string;
}

export function AdminHub({ token, adminEmail }: AdminHubProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs' | 'team'>('applicants');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'prep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [tempTier, setTempTier] = useState<'high' | 'medium' | 'under_review'>('medium');
  const [tempFeedback, setTempFeedback] = useState('');
  
  // Menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedApplicant = applicants.find(a => a.id === selectedId);

  useEffect(() => {
    if (selectedId && selectedApplicant) {
      setTempTier(selectedApplicant.reliabilityTier || 'medium');
      setTempFeedback(selectedApplicant.adminFeedback || '');
    }
  }, [selectedId, selectedApplicant]);

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

  const handleStatusUpdate = async (id: string, status: Applicant['status'], tier?: string, feedback?: string) => {
    setIsUpdatingStatus(id);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          status, 
          reliabilityTier: tier, 
          adminFeedback: feedback,
          operator: adminEmail
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status, reliabilityTier: tier as any, adminFeedback: feedback } : a));
        
        if (result.emailSent) {
          toast.success(`Protocol ${status} and email dispatched.`);
        } else if (result.emailError) {
          toast.warning(`Status updated, but email protocol failed.`);
          console.error('Email error:', result.emailError);
        } else {
          toast.success(`Protocol update transmitted: ${status.toUpperCase()}`);
        }

        if (status === 'archived') {
            setSelectedId(null);
        }
        // Force immediate log refresh for accountability
        fetchAllData();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      toast.error('Protocol transmission error');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleReroute = async (id: string) => {
    setIsUpdatingStatus(id);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants/${id}/reroute`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({ operator: adminEmail })
      });
      const result = await response.json();
      if (response.ok) {
        if (result.emailSent) toast.success('Reroute successful: Optimization email dispatched.');
        else toast.warning('Rerouted, but email failed.');
        fetchAllData();
      }
    } catch (err) {
      toast.error('Reroute failed');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('HARD RESET: Are you sure you want to permanently delete this protocol? This will clear the identity lock.')) return;
    
    setIsUpdatingStatus(id);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants/${id}/delete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify({ operator: adminEmail })
      });
      if (response.ok) {
        toast.success('Identity hard-reset complete.');
        setApplicants(prev => prev.filter(a => a.id !== id));
        if (selectedId === id) setSelectedId(null);
        setActiveMenuId(null);
        fetchAllData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      toast.error('Deletion protocol failed');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleWhitelistAction = async (email: string, action: 'add' | 'remove') => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/whitelist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, action })
      });
      if (response.ok) {
        const data = await response.json();
        setWhitelist(data.whitelist);
        setNewTeamMember('');
        toast.success(`Team member ${action === 'add' ? 'added' : 'removed'}`);
        fetchAllData();
      }
    } catch (err) {
      toast.error('Whitelist update failed');
    }
  };

  const handleViewDocument = async (path: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ path })
      });
      const data = await response.json();
      if (data.url) window.open(data.url, '_blank');
      else toast.error('Vault access denied');
    } catch (err) {
      toast.error('Vault connection failed');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'University', 'Track', 'Status', 'Date'];
    const rows = applicants.map(a => [
      a.id, a.fullName, a.email, a.university, a.track, a.status, new Date(a.submittedAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `veridex_dossier_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Dossier exported successfully');
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesTrack = filter === 'all' || a.track === filter;
    const matchesSearch = 
      (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.university || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch && (activeTab === 'applicants' ? a.status !== 'archived' : true);
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
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2">Dossier Operations</div>
        <button onClick={() => { setActiveTab('applicants'); setFilter('all'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Inbox className="w-4 h-4" /> All Signals
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('core'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Zap className="w-4 h-4" /> Core Track
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('prep'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'prep' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Activity className="w-4 h-4" /> Prep Track
        </button>
        
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2 mt-6">Administrative</div>
        <button onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Terminal className="w-4 h-4" /> Audit Logs
        </button>
        <button onClick={() => { setActiveTab('team'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'team' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Users className="w-4 h-4" /> Team Manager
        </button>
      </nav>

      <div className={`p-4 border-t ${borderColor}`}>
        <div className={`flex items-center gap-3 p-3 rounded-xl ${inputBg}`}>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold ${headingColor} truncate`}>{adminEmail}</div>
            <div className="text-[10px] opacity-50">Master Admin</div>
          </div>
          <button onClick={() => window.location.href = '/?dex=1'} className="p-2 opacity-50 hover:opacity-100"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} font-mono text-sm transition-colors duration-500 overflow-hidden relative`}>
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm" 
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[101] md:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-4 md:px-6 ${surfaceColor} shrink-0`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2"><Menu className="w-5 h-5" /></button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Audit identity..." className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleExportCSV} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border ${borderColor} ${surfaceColor} hover:bg-white/5 transition-colors text-[11px] font-bold uppercase`}>
              <Download className="w-3.5 h-3.5" /> Export
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
                    <th className="text-left py-4 px-4 md:px-6">Identity Signal</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden sm:table-cell">Institution</th>
                    <th className="text-left py-4 px-4 md:px-6">Status</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden md:table-cell">Timestamp</th>
                    <th className="text-right py-4 px-4 md:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((a) => (
                    <tr key={a.id} className={`border-b ${borderColor} hover:bg-white/[0.02] cursor-default transition-all ${selectedId === a.id ? 'bg-indigo-500/5' : ''}`}>
                      <td className="py-4 px-4 md:px-6 cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="flex flex-col">
                          <span className="font-bold text-[10px] opacity-40 uppercase tracking-tighter mb-0.5">{a.id}</span>
                          <span className={`${headingColor} font-bold truncate max-w-[150px] sm:max-w-none`}>{a.fullName}</span>
                          <span className="text-[10px] opacity-50 truncate max-w-[150px] sm:max-w-none sm:hidden">{a.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="text-[12px] opacity-70 truncate max-w-[200px]">{a.university}</div>
                      </td>
                      <td className="py-4 px-4 md:px-6 cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            a.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500' : 
                            a.status === 'flagged' ? 'bg-rose-500/10 text-rose-500' : 
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {a.status}
                          </span>
                          {a.status === 'verified' && a.reliabilityTier && (
                            <span className="text-[8px] font-bold uppercase tracking-tight opacity-50 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                              {a.reliabilityTier.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell opacity-40 text-[11px] cursor-pointer" onClick={() => setSelectedId(a.id)}>
                        {new Date(a.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 md:px-6 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === a.id ? null : a.id);
                          }}
                          className={`p-2 rounded-md hover:bg-white/10 transition-colors ${activeMenuId === a.id ? 'bg-white/10 text-indigo-500' : 'text-slate-500'}`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {activeMenuId === a.id && (
                          <div 
                            ref={menuRef}
                            className={`absolute right-10 top-12 w-48 ${surfaceColor} border ${borderColor} rounded-xl shadow-2xl z-[50] overflow-hidden py-1 animate-in fade-in zoom-in duration-150`}
                          >
                            <button 
                              onClick={() => { setSelectedId(a.id); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors text-left"
                            >
                              <Eye className="w-4 h-4 text-indigo-500" /> Open Application
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(a.id, 'archived')}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors text-left"
                            >
                              <Archive className="w-4 h-4 text-amber-500" /> Archive Protocol
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button 
                              onClick={() => handleDeleteApplication(a.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-rose-500/10 text-rose-500 transition-colors text-left font-bold"
                            >
                              <Trash2 className="w-4 h-4" /> Hard Reset (Delete)
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredApplicants.length === 0 && (
                    <tr><td colSpan={5} className="py-20 text-center opacity-40">No signals detected in this frequency.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'logs' ? (
            <div className="p-6 space-y-4">
              <div className={`${headingColor} font-bold text-lg mb-6`}>Audit Terminal</div>
              {auditLogs.map((log) => (
                <div key={log.id} className={`${surfaceColor} border ${borderColor} p-4 rounded-lg flex items-start gap-4 hover:border-indigo-500/50 transition-all`}>
                  <div className={`p-2 rounded bg-white/5`}>
                    <Activity className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{log.action}</span>
                      <span className="text-[10px] opacity-40">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className={`${headingColor} text-xs font-mono`}>{log.details}</div>
                    {log.operator && (
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[9px] font-bold opacity-30 uppercase tracking-wider">BY:</span>
                            <span className="text-[10px] font-bold text-indigo-500/70">{log.operator}</span>
                        </div>
                    )}
                    <div className="text-[9px] opacity-20 mt-1 uppercase">Log ID: {log.id}</div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                  <div className="py-20 text-center opacity-40">Audit trail is currently clear.</div>
              )}
            </div>
          ) : (
            <div className="p-6 max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className={`text-xl font-bold ${headingColor} mb-2`}>Team Access Management</h2>
                <p className="text-xs opacity-50">Manage protocol authorized identities. Only whitelisted users can access the Ghost Hub.</p>
              </div>

              <div className={`${surfaceColor} border ${borderColor} rounded-xl overflow-hidden`}>
                <div className="p-4 border-b border-white/5 flex gap-4">
                  <input 
                    type="email" placeholder="new.identity@veridex.io" 
                    className={`flex-1 ${inputBg} border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`}
                    value={newTeamMember} onChange={(e) => setNewTeamMember(e.target.value)}
                  />
                  <button 
                    onClick={() => handleWhitelistAction(newTeamMember, 'add')}
                    disabled={!newTeamMember}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all"
                  >
                    Authorize
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {whitelist.map((email) => (
                    <div key={email} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs">{email.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className={`text-sm font-bold ${headingColor}`}>{email}</div>
                          <div className="text-[10px] opacity-40 uppercase tracking-widest">{email === adminEmail ? 'Active Session' : 'Authorized Access'}</div>
                        </div>
                      </div>
                      {email !== adminEmail && (
                        <button onClick={() => handleWhitelistAction(email, 'remove')} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dossier Detail View (Mobile & Desktop Overlay) */}
      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <Resizable
              size={{ width: isMaximized ? '95%' : (window.innerWidth < 640 ? '100%' : 550), height: '100%' }}
              minWidth={350}
              maxWidth="100%"
              enable={{ left: true }}
              handleStyles={{
                left: { width: '10px', left: '-5px', cursor: 'ew-resize', zIndex: 200 }
              }}
              handleComponent={{
                left: (
                  <div className="h-full w-1 flex items-center justify-center group">
                    <div className={`h-24 w-1 rounded-full ${theme === 'dark' ? 'bg-white/10 group-hover:bg-indigo-500' : 'bg-slate-200 group-hover:bg-indigo-500'} transition-colors`} />
                  </div>
                )
              }}
              className="z-[151] relative h-full"
            >
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={`h-full bg-[#0D0D0F] border-l ${borderColor} flex flex-col shadow-2xl relative overflow-hidden`}
              >
                {/* FIXED HEADER */}
                <div className={`p-4 border-b ${borderColor} flex items-center justify-between shrink-0 bg-[#0D0D0F] z-20`}>
                  <div className="flex flex-col">
                    <div className={`${headingColor} font-bold text-[10px] tracking-widest uppercase mb-1`}>Dossier Analysis Protocol</div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-500">{selectedApplicant.id}</span>
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-tight ${selectedApplicant.track === 'core' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                            {selectedApplicant.track} Track
                        </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsMaximized(!isMaximized)} 
                      className="p-2 hover:bg-white/10 rounded-lg transition-all hidden sm:block"
                      title={isMaximized ? "Restore" : "Maximize"}
                    >
                      {isMaximized ? <LayoutGrid className="w-4 h-4 rotate-45" /> : <ArrowUpRight className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar pb-10">
                  {/* Primary Info */}
                  <section className="space-y-4">
                    <div>
                      <h3 className={`text-3xl font-bold text-white leading-tight`}>{selectedApplicant.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-tight underline select-all">{selectedApplicant.email}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] uppercase opacity-40 font-bold mb-1.5 flex items-center gap-2">
                            <Users className="w-3 h-3" /> Institution
                        </div>
                        <div className="text-sm font-bold text-white leading-snug">{selectedApplicant.university}</div>
                      </div>
                      <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] uppercase opacity-40 font-bold mb-1.5 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Grad Year
                        </div>
                        <div className="text-sm font-bold text-white">{selectedApplicant.gradYear || 'N/A'}</div>
                      </div>
                    </div>
                  </section>

                  {/* BIFURCATED VIEW CONTENT */}
                  {selectedApplicant.track === 'core' ? (
                    // CORE TRACK SPECIFIC DATA
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section className="space-y-3">
                        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> CORE: Technical Audit
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {selectedApplicant.proofUrl && (
                                <a 
                                    href={selectedApplicant.proofUrl} target="_blank" rel="noopener noreferrer"
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all group`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-500/10">
                                            <LayoutGrid className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white uppercase tracking-tight">Technical Portfolio</div>
                                            <div className="text-[10px] text-amber-500/70 font-mono truncate max-w-[200px]">{selectedApplicant.proofUrl}</div>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                            
                            <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase opacity-40 font-bold mb-2 tracking-widest">Skill Vector</div>
                                <div className="text-sm font-bold text-white bg-indigo-500/10 inline-block px-3 py-1 rounded-md border border-indigo-500/20">{selectedApplicant.skillCategory}</div>
                                <div className="mt-4 text-[11px] text-slate-400 leading-relaxed font-mono">
                                    {selectedApplicant.rationale}
                                </div>
                            </div>
                        </div>
                      </section>

                      {selectedApplicant.documentPath && (
                        <section className="space-y-3">
                          <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Trust Anchor (Verification)
                          </div>
                          <button 
                            onClick={() => handleViewDocument(selectedApplicant.documentPath!)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-left"
                          >
                            <div className="p-2.5 rounded-lg bg-emerald-500/10">
                                <FileText className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-white uppercase">Identity Proof Document</div>
                                <div className="text-[10px] text-emerald-500/70">Verified Vault Storage • Encrypted</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 opacity-40" />
                          </button>
                        </section>
                      )}

                      <section className="space-y-3">
                        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5" /> Project Context
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed font-mono">
                          {selectedApplicant.projectContext || "No additional technical context provided for this protocol."}
                        </div>
                      </section>
                    </div>
                  ) : (
                    // PREP TRACK SPECIFIC DATA
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section className="space-y-3">
                        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-indigo-500" /> PREP: Growth Motivation
                        </div>
                        <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5 space-y-4">
                            <div>
                                <div className="text-[10px] uppercase opacity-40 font-bold mb-1.5 tracking-widest">Aspirational Goal</div>
                                <div className="text-sm font-bold text-white bg-indigo-500/10 inline-block px-3 py-1 rounded-md border border-indigo-500/20">
                                    {selectedApplicant.skillCategory}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase opacity-40 font-bold mb-1.5 tracking-widest">The "Why"</div>
                                <div className="text-[12px] text-slate-300 leading-relaxed italic">
                                    "{selectedApplicant.motivation}"
                                </div>
                            </div>
                        </div>
                      </section>

                      <section className="space-y-3">
                        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> Commitment Protocol
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5 text-[11px] text-slate-300 leading-relaxed font-mono">
                          {selectedApplicant.commitment || "No specific commitment protocol defined for this applicant."}
                        </div>
                      </section>

                      {selectedApplicant.proofUrl && (
                        <section className="space-y-3">
                          <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                            <LayoutGrid className="w-3.5 h-3.5" /> Preliminary Evidence
                          </div>
                          <a 
                            href={selectedApplicant.proofUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                          >
                            <ExternalLink className="w-4 h-4 text-indigo-500" />
                            <span className="text-[11px] text-indigo-400 font-bold truncate underline">{selectedApplicant.proofUrl}</span>
                          </a>
                        </section>
                      )}
                    </div>
                  )}

                  {/* Metadata Signal */}
                  <section className="space-y-3 pb-24">
                    <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Metadata Signal</div>
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-wrap gap-2">
                      {selectedApplicant.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] uppercase font-bold text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-[9px] opacity-30 text-center uppercase tracking-[0.2em] pt-4">
                      Protocol Initialized: {new Date(selectedApplicant.submittedAt).toLocaleString()}
                    </div>
                  </section>
                </div>

                {/* FIXED FOOTER ACTIONS */}
                <div className={`p-6 border-t ${borderColor} shrink-0 bg-[#0D0D0F] shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-20`}>
                  {selectedApplicant.status === 'pending' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold opacity-40 px-1 tracking-widest">Reliability Tier</label>
                          <Select value={tempTier} onValueChange={(val) => setTempTier(val as any)}>
                            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white font-mono text-xs focus:ring-indigo-500/50 focus:border-indigo-500/50 border hover:border-indigo-500/30 transition-all">
                                <SelectValue placeholder="Select Tier" />
                            </SelectTrigger>
                            {/* FORCE HIGH Z-INDEX FOR THE DROPDOWN CONTENT */}
                            <SelectContent className="bg-[#121214] border-white/10 text-white z-[300]">
                                <SelectItem value="high" className="focus:bg-indigo-600 focus:text-white transition-colors cursor-pointer text-xs font-mono">Verified – High</SelectItem>
                                <SelectItem value="medium" className="focus:bg-indigo-600 focus:text-white transition-colors cursor-pointer text-xs font-mono">Verified – Medium</SelectItem>
                                <SelectItem value="under_review" className="focus:bg-indigo-600 focus:text-white transition-colors cursor-pointer text-xs font-mono">Under Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button 
                                onClick={() => handleStatusUpdate(selectedApplicant.id, 'verified', tempTier, tempFeedback)}
                                disabled={!!isUpdatingStatus}
                                className="w-full h-[40px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase rounded-lg shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                {isUpdatingStatus === selectedApplicant.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Verify Protocol
                            </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-40 px-1 tracking-widest">Audit Feedback (Optional)</label>
                        <textarea 
                          placeholder="Specify why this signal is being flagged or rerouted..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 min-h-[60px] font-mono transition-all"
                          value={tempFeedback}
                          onChange={(e) => setTempFeedback(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplicant.id, 'flagged', undefined, tempFeedback)}
                          disabled={!!isUpdatingStatus}
                          className="flex items-center justify-center gap-2 p-3 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-lg text-xs font-bold uppercase transition-all active:scale-[0.98]"
                        >
                          <ShieldAlert className="w-4 h-4" /> Flag
                        </button>
                        <button 
                          onClick={() => handleReroute(selectedApplicant.id)}
                          disabled={!!isUpdatingStatus || selectedApplicant.track === 'prep'}
                          className="flex items-center justify-center gap-2 p-3 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 disabled:opacity-30 rounded-lg text-xs font-bold uppercase transition-all active:scale-[0.98]"
                        >
                          <RefreshCcw className="w-4 h-4" /> Reroute to Prep
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white/[0.03] p-4 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedApplicant.status === 'verified' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                          {selectedApplicant.status === 'verified' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-rose-500" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{selectedApplicant.status} Protocol</div>
                          <div className="text-[10px] opacity-40 uppercase tracking-widest">Manual Audit Completed</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStatusUpdate(selectedApplicant.id, 'pending')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all active:scale-[0.98]"
                      >
                        Re-open Audit
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </Resizable>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0A0A0B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #18181B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #27272A;
        }
        
        /* Custom UI Select styling for Dark Theme */
        /* Ensure the portal content is visible above the dossier overlay */
        [data-slot="select-content"] {
            background-color: #121214 !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
            z-index: 300 !important;
        }
        [data-slot="select-item"]:focus {
            background-color: #4F46E5 !important;
            color: white !important;
        }
        [data-slot="select-trigger"] {
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        [data-slot="select-trigger"]:focus {
            border-color: #4F46E5 !important;
            box-shadow: 0 0 0 1px #4F46E5 !important;
        }
        
        /* Ensure the radix portal itself has the high z-index */
        div[data-radix-portal] {
            z-index: 300 !important;
        }
      `}} />
    </div>
  );
}
