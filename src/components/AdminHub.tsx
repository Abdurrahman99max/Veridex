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
          toast.success(`Application ${status} and email sent.`);
        } else if (result.emailError) {
          toast.warning(`Status updated, but email failed to send.`);
          console.error('Email error:', result.emailError);
        } else {
          toast.success(`Update successful: ${status.toUpperCase()}`);
        }

        if (status === 'archived') {
            setSelectedId(null);
        }
        fetchAllData();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      toast.error('Transmission error');
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
        if (result.emailSent) toast.success('Moved to Bridge Track: Update email sent.');
        else toast.warning('Moved track, but email failed.');
        fetchAllData();
      }
    } catch (err) {
      toast.error('Failed to move track');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('DELETE & RESTART: Are you sure you want to permanently delete this application? This will allow the applicant to try again.')) return;
    
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
        toast.success('Application deleted successfully.');
        setApplicants(prev => prev.filter(a => a.id !== id));
        if (selectedId === id) setSelectedId(null);
        setActiveMenuId(null);
        fetchAllData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      toast.error('Deletion failed');
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
      else toast.error('Access denied');
    } catch (err) {
      toast.error('Connection failed');
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
    link.setAttribute("download", `veridex_applicants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Applicants exported successfully');
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
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2">Review Center</div>
        <button onClick={() => { setActiveTab('applicants'); setFilter('all'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Inbox className="w-4 h-4" /> Active Applications
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('core'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Zap className="w-4 h-4" /> Core Track
        </button>
        <button onClick={() => { setActiveTab('applicants'); setFilter('prep'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'prep' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Activity className="w-4 h-4" /> Bridge Track
        </button>
        
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold px-3 py-2 mt-6">Administrative</div>
        <button onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
          <Terminal className="w-4 h-4" /> Activity History
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
            <div className="text-[10px] opacity-50">Administrator</div>
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
              <input type="text" placeholder="Search applicants..." className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                    <th className="text-left py-4 px-4 md:px-6">Applicant</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden sm:table-cell">Institution</th>
                    <th className="text-left py-4 px-4 md:px-6">Status</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden md:table-cell">Applied On</th>
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
                            {a.status === 'flagged' ? 'Not Approved' : a.status}
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
                              <Eye className="w-4 h-4 text-indigo-500" /> View Application
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(a.id, 'archived')}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors text-left"
                            >
                              <Archive className="w-4 h-4 text-amber-500" /> Archive Application
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button 
                              onClick={() => handleDeleteApplication(a.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-rose-500/10 text-rose-500 transition-colors text-left font-bold"
                            >
                              <Trash2 className="w-4 h-4" /> Delete & Restart
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredApplicants.length === 0 && (
                    <tr><td colSpan={5} className="py-20 text-center opacity-40">No applicants found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'logs' ? (
            <div className="p-6 space-y-4">
              <div className={`${headingColor} font-bold text-lg mb-6`}>Activity History</div>
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
                    <div className="text-[9px] opacity-20 mt-1 uppercase">ID: {log.id}</div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                  <div className="py-20 text-center opacity-40">No activity recorded yet.</div>
              )}
            </div>
          ) : (
            <div className="p-6 max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className={`text-xl font-bold ${headingColor} mb-2`}>Team Access Management</h2>
                <p className="text-xs opacity-50">Manage authorized administrators. Only whitelisted users can access the Hub.</p>
              </div>

              <div className={`${surfaceColor} border ${borderColor} rounded-xl overflow-hidden`}>
                <div className="p-4 border-b border-white/5 flex gap-4">
                  <input 
                    type="email" placeholder="admin@veridex.io" 
                    className={`flex-1 ${inputBg} border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none`}
                    value={newTeamMember} onChange={(e) => setNewTeamMember(e.target.value)}
                  />
                  <button 
                    onClick={() => handleWhitelistAction(newTeamMember, 'add')}
                    disabled={!newTeamMember}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all"
                  >
                    Add Member
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {whitelist.map((email) => (
                    <div key={email} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs">{email.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className={`text-sm font-bold ${headingColor}`}>{email}</div>
                          <div className="text-[10px] opacity-40 uppercase tracking-widest">{email === adminEmail ? 'Current User' : 'Authorized Administrator'}</div>
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

      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`w-full h-full md:max-w-6xl md:h-[90vh] ${surfaceColor} border ${borderColor} md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative`}
            >
              {/* Header */}
              <div className={`p-6 border-b ${borderColor} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${headingColor}`}>{selectedApplicant.fullName}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-40">
                      <span>ID: {selectedApplicant.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span>{selectedApplicant.track} Track</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Info Panel */}
                <div className="w-full md:w-2/3 p-8 space-y-8">
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Email Address</div>
                      <div className={`text-sm font-bold ${headingColor} flex items-center gap-2`}>
                        {selectedApplicant.email}
                        <button className="p-1 hover:bg-white/5 rounded text-indigo-500"><Mail className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Institution</div>
                      <div className={`text-sm font-bold ${headingColor}`}>{selectedApplicant.university}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Category</div>
                      <div className={`text-sm font-bold ${headingColor}`}>{selectedApplicant.skillCategory}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Applied On</div>
                      <div className={`text-sm font-bold ${headingColor}`}>{new Date(selectedApplicant.submittedAt).toLocaleString()}</div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Technical Review</div>
                    <div className={`p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4`}>
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Project Description</div>
                        <p className={`text-sm leading-relaxed ${textColor}`}>{selectedApplicant.rationale}</p>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center justify-between">
                         <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Skill Evidence</div>
                         <a href={selectedApplicant.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 hover:underline">
                           View Link <ExternalLink className="w-3 h-3" />
                         </a>
                      </div>
                    </div>
                  </section>

                  {selectedApplicant.documentPath && (
                    <section className="space-y-4">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Verification Document</div>
                      <button 
                        onClick={() => handleViewDocument(selectedApplicant.documentPath!)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-indigo-500/10 text-indigo-500">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className={`text-xs font-bold ${headingColor}`}>Identity Verification Document</div>
                            <div className="text-[10px] opacity-40">Stored securely in private vault</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    </section>
                  )}
                </div>

                {/* Actions Panel */}
                <div className={`w-full md:w-1/3 p-8 ${inputBg} space-y-8 flex flex-col`}>
                  <div className="space-y-6 flex-1">
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Review Decision</div>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplicant.id, 'verified', tempTier, tempFeedback)}
                          disabled={isUpdatingStatus === selectedApplicant.id}
                          className={cn(
                            "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase transition-all",
                            selectedApplicant.status === 'verified' 
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                              : "bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 border border-white/5"
                          )}
                        >
                          {isUpdatingStatus === selectedApplicant.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplicant.id, 'flagged', undefined, tempFeedback)}
                          disabled={isUpdatingStatus === selectedApplicant.id}
                          className={cn(
                            "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase transition-all",
                            selectedApplicant.status === 'flagged' 
                              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                              : "bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 border border-white/5"
                          )}
                        >
                          {isUpdatingStatus === selectedApplicant.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                          Not Approved
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedApplicant.status === 'verified' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Reliability Tier</div>
                          <Select 
                            value={tempTier} 
                            onValueChange={(val: any) => {
                              setTempTier(val);
                              handleStatusUpdate(selectedApplicant.id, 'verified', val, tempFeedback);
                            }}
                          >
                            <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 font-bold text-xs uppercase tracking-widest">
                              <SelectValue placeholder="Select Tier" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0D0D0F] border-white/10 text-white">
                              <SelectItem value="high" className="focus:bg-indigo-500 focus:text-white">High Reliability</SelectItem>
                              <SelectItem value="medium" className="focus:bg-indigo-500 focus:text-white">Medium Reliability</SelectItem>
                              <SelectItem value="under_review" className="focus:bg-indigo-500 focus:text-white">Under Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Review Feedback (Sent to Applicant)</div>
                      <textarea 
                        className={`w-full h-32 ${surfaceColor} border ${borderColor} rounded-xl p-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none`}
                        placeholder="Add notes for the applicant..."
                        value={tempFeedback}
                        onChange={(e) => setTempFeedback(e.target.value)}
                      />
                      <button 
                        onClick={() => handleStatusUpdate(selectedApplicant.id, selectedApplicant.status, tempTier, tempFeedback)}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        Save Feedback
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    {selectedApplicant.track === 'core' && (
                      <button 
                        onClick={() => handleReroute(selectedApplicant.id)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 transition-all text-amber-500 group"
                      >
                        <div className="flex items-center gap-3">
                          <Undo2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Move to Bridge Track</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteApplication(selectedApplicant.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all text-rose-500 group"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Delete Application</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1" />
                    </button>
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
