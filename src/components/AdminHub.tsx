import React, { useState, useEffect } from 'react';
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
  RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

  const selectedApplicant = applicants.find(a => a.id === selectedId);

  useEffect(() => {
    if (selectedId && selectedApplicant) {
      setTempTier(selectedApplicant.reliabilityTier || 'medium');
      setTempFeedback(selectedApplicant.adminFeedback || '');
    }
  }, [selectedId, selectedApplicant]);

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
          adminFeedback: feedback 
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

        if (status === 'archived') setSelectedId(null);
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
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
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
      (a.university || '').toLowerCase().includes(searchQuery.toLowerCase());
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
              <input type="text" placeholder="Audit identity..." className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 text-sm`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                <thead className={`sticky top-0 ${bgColor} z-10`}>
                  <tr className={`border-b ${borderColor} text-[10px] uppercase tracking-widest opacity-50 font-bold`}>
                    <th className="text-left py-4 px-4 md:px-6">Identity Signal</th>
                    <th className="text-left py-4 px-4 md:px-6 hidden sm:table-cell">Institution</th>
                    <th className="text-left py-4 px-4 md:px-6">Status</th>
                    <th className="text-right py-4 px-4 md:px-6 hidden md:table-cell">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((a) => (
                    <tr key={a.id} onClick={() => setSelectedId(a.id)} className={`border-b ${borderColor} hover:bg-white/5 cursor-pointer transition-all ${selectedId === a.id ? 'bg-indigo-500/5' : ''}`}>
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[11px] opacity-40 uppercase tracking-tighter mb-0.5">{a.id}</span>
                          <span className={`${headingColor} font-bold truncate max-w-[150px] sm:max-w-none`}>{a.fullName}</span>
                          <span className="text-[10px] opacity-50 truncate max-w-[150px] sm:max-w-none sm:hidden">{a.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell">
                        <div className="text-[12px] opacity-70 truncate max-w-[200px]">{a.university}</div>
                      </td>
                      <td className="py-4 px-4 md:px-6">
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
                      <td className="py-4 px-6 text-right hidden md:table-cell opacity-40 text-[11px]">
                        {new Date(a.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredApplicants.length === 0 && (
                    <tr><td colSpan={4} className="py-20 text-center opacity-40">No signals detected in this frequency.</td></tr>
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
                    <div className="text-[9px] opacity-30 mt-1 uppercase">Log ID: {log.id}</div>
                  </div>
                </div>
              ))}
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
                    className={`flex-1 ${inputBg} border-none rounded-lg px-4 py-2 text-sm`}
                    value={newTeamMember} onChange={(e) => setNewTeamMember(e.target.value)}
                  />
                  <button 
                    onClick={() => handleWhitelistAction(newTeamMember, 'add')}
                    disabled={!newTeamMember}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase"
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <Resizable
              size={{ width: isMaximized ? '95%' : (window.innerWidth < 640 ? '100%' : 500), height: '100%' }}
              onResizeStop={(e, direction, ref, d) => {
                // Keep standard behavior but allow visual handle
              }}
              minWidth={350}
              maxWidth="100%"
              enable={{ left: true }}
              handleStyles={{
                left: {
                  width: '10px',
                  left: '-5px',
                  cursor: 'ew-resize',
                  zIndex: 200
                }
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
                className={`h-full ${surfaceColor} border-l ${borderColor} flex flex-col shadow-2xl relative`}
              >
                <div className={`p-4 border-b ${borderColor} flex items-center justify-between sticky top-0 ${surfaceColor} z-10`}>
                  <div className="flex flex-col">
                    <div className={`${headingColor} font-bold text-[10px] tracking-widest uppercase mb-1`}>Dossier Analysis</div>
                    <div className="text-xs opacity-50 font-bold">{selectedApplicant.id}</div>
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

              <div className="flex-1 overflow-auto p-6 md:p-8 space-y-8 pb-32">
                {/* Header Info */}
                <section className="space-y-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${headingColor} leading-tight`}>{selectedApplicant.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-tight underline">{selectedApplicant.email}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`${inputBg} p-3 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-40 font-bold mb-1">Institution</div>
                      <div className="text-xs font-bold truncate">{selectedApplicant.university}</div>
                    </div>
                    <div className={`${inputBg} p-3 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-40 font-bold mb-1">Track Designation</div>
                      <div className="flex items-center gap-2">
                        {selectedApplicant.track === 'core' ? <Zap className="w-3 h-3 text-amber-500" /> : <Activity className="w-3 h-3 text-indigo-500" />}
                        <span className="text-xs font-bold uppercase">{selectedApplicant.track}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Technical Audit Section (Portfolio) */}
                <section className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                    <Keyboard className="w-3 h-3" /> Technical Proof
                  </div>
                  {selectedApplicant.proofUrl ? (
                    <a 
                      href={selectedApplicant.proofUrl} target="_blank" rel="noopener noreferrer"
                      className={`w-full flex items-center justify-between p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all group`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 text-indigo-500" />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-tight">Active Portfolio Logic</div>
                          <div className="text-[9px] opacity-50 truncate max-w-[200px]">{selectedApplicant.proofUrl}</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  ) : (
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor} text-xs opacity-40 italic`}>No portfolio URL detected.</div>
                  )}

                  {selectedApplicant.projectContext && (
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor} space-y-2`}>
                      <div className="text-[9px] uppercase opacity-40 font-bold">Project Context</div>
                      <div className="text-xs leading-relaxed italic">"{selectedApplicant.projectContext}"</div>
                    </div>
                  )}
                </section>

                {/* Trust Anchor (Vault Document) */}
                <section className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Vault Inspection
                  </div>
                  {selectedApplicant.documentPath ? (
                    <button 
                      onClick={() => handleViewDocument(selectedApplicant.documentPath!)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border ${borderColor} ${inputBg} hover:border-indigo-500 transition-all group`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-tight">ENCRYPTED_ID_VAULT.VDX</div>
                          <div className="text-[9px] opacity-40">Stored in Private Secure Node</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ) : (
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor} text-xs opacity-40 italic`}>Verification documentation missing.</div>
                  )}
                </section>

                {/* Rationale Section */}
                <section className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-2">
                    <ArrowUpRight className="w-3 h-3" /> Rationale & Motivation
                  </div>
                  <div className={`${inputBg} p-4 rounded-xl border ${borderColor} space-y-4`}>
                    <div className="text-xs leading-relaxed">
                      <div className="text-[9px] opacity-40 mb-1 uppercase">Student Response:</div>
                      "{selectedApplicant.rationale}"
                    </div>
                    {selectedApplicant.commitment && (
                      <div className="text-xs leading-relaxed pt-2 border-t border-white/5">
                        <div className="text-[9px] opacity-40 mb-1 uppercase">Commitment Protocol:</div>
                        {selectedApplicant.commitment}
                      </div>
                    )}
                  </div>
                </section>

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.tags?.map(tag => (
                    <span key={tag} className="text-[8px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Fixed Action Footer */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-${theme === 'dark' ? '[#0D0D0F]' : 'white'} via-${theme === 'dark' ? '[#0D0D0F]' : 'white'} to-transparent border-t ${borderColor} flex flex-col gap-4 z-20`}>
                
                {/* Reliability Tier Selector */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Decision Parameters</div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {(['high', 'medium', 'under_review'] as const).map(t => (
                        <button 
                          key={t}
                          onClick={() => setTempTier(t)}
                          className={`px-2 py-1.5 rounded border text-[10px] font-bold uppercase transition-all ${
                            tempTier === t 
                            ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                            : `${borderColor} ${inputBg} opacity-50 hover:opacity-100`
                          }`}
                        >
                          {t.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    placeholder="Audit Feedback (Required for Flagging)..."
                    className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 text-xs min-h-[80px] focus:ring-1 focus:ring-indigo-500 outline-none`}
                    value={tempFeedback}
                    onChange={(e) => setTempFeedback(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(selectedId, 'verified', tempTier, tempFeedback)}
                    disabled={isUpdatingStatus === selectedId}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isUpdatingStatus === selectedId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
                    Verify
                  </button>
                  <button 
                    onClick={() => {
                      if (!tempFeedback) {
                        toast.error('Feedback required for flagged protocols.');
                        return;
                      }
                      handleStatusUpdate(selectedId, 'flagged', tempTier, tempFeedback);
                    }}
                    disabled={isUpdatingStatus === selectedId}
                    className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 text-rose-500 border border-rose-500/20 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    {isUpdatingStatus === selectedId ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />} 
                    Flag
                  </button>
                </div>
                <div className="flex gap-2">
                  {selectedApplicant.track === 'core' && (
                    <button 
                      onClick={() => handleReroute(selectedId)}
                      disabled={isUpdatingStatus === selectedId}
                      className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 text-amber-500 border border-amber-500/20 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
                    >
                      Optimize to Prep
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate(selectedId, 'archived')}
                    disabled={isUpdatingStatus === selectedId}
                    className="flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    Archive Signal
                  </button>
                </div>
              </div>
            </motion.div>
          </Resizable>
        </div>
      )}
    </AnimatePresence>
  </div>
);
}
