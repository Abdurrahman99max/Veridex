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
  Key
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
  rationale: string;
  skillCategory: string;
  proofUrl: string;
  gradYear?: string;
  submittedAt: string;
  tags: string[];
  projectContext?: string;
  motivation?: string;
  commitment?: string;
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
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs' | 'team'>('applicants');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'prep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Fetch all system data
  const fetchAllData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${publicAnonKey}` };
      
      const [appRes, logRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants`, { headers }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/audit-logs`, { headers }).catch(() => null)
      ]);

      if (appRes && appRes.ok) setApplicants(await appRes.json());
      
      // If server doesn't have log route yet, use mock for now but server will be updated
      if (logRes && logRes.ok) {
        setAuditLogs(await logRes.json());
      } else {
        // Fallback logs until server patch finishes
        setAuditLogs([{ id: '1', action: 'SYSTEM_SYNC', details: 'Node connection established', timestamp: new Date().toISOString() }]);
      }
      
      setLastSync(new Date());
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, status: Applicant['status']) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        toast.success(`Protocol ${id} status: ${status.toUpperCase()}`);
        fetchAllData(); 
      }
    } catch (err) {
      toast.error('Protocol update rejected');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'University', 'Track', 'Status', 'Date', 'Rationale'];
    const rows = applicants.map(a => [
      a.id, 
      a.fullName, 
      a.email, 
      a.university, 
      a.track, 
      a.status, 
      new Date(a.submittedAt).toLocaleDateString(),
      `"${(a.rationale || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `veridex_dossier_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Dossier exported successfully');
  };

  const selectedApplicant = applicants.find(a => a.id === selectedId);

  const filteredApplicants = applicants.filter(a => {
    const matchesTrack = filter === 'all' || a.track === filter;
    const matchesSearch = 
      (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.university || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch && a.status !== 'archived';
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Theme-based colors
  const bgColor = theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-[#FAFAFA]';
  const surfaceColor = theme === 'dark' ? 'bg-[#0D0D0F]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-white/5' : 'border-slate-200';
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const inputBg = theme === 'dark' ? 'bg-white/5' : 'bg-slate-100';

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} font-mono text-sm transition-colors duration-500 overflow-hidden relative`}>
      
      {/* Scanning Line Effect */}
      <AnimatePresence>
        {theme === 'dark' && (
          <motion.div 
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-indigo-500/20 z-50 pointer-events-none shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 border-r ${borderColor} flex flex-col z-20 transition-colors duration-500`}>
        <div className={`p-6 border-b ${borderColor} flex items-center gap-3`}>
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            <Shield className="w-5 h-5 text-white" />
          </motion.div>
          <span className={`font-bold ${headingColor} tracking-tighter text-lg uppercase`}>VERIDEX</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="pb-2 px-3 text-[10px] uppercase tracking-widest opacity-50 font-bold">Protocols</div>
          <button 
            onClick={() => { setActiveTab('applicants'); setFilter('all'); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" />
            All Signals
            <span className="ml-auto text-[10px] opacity-40">{applicants.length}</span>
          </button>
          <button 
            onClick={() => { setActiveTab('applicants'); setFilter('core'); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Zap className="w-4 h-4" />
            Core Track
          </button>
          
          <div className="pt-8 pb-2 px-3 text-[10px] uppercase tracking-widest opacity-50 font-bold">Management</div>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Terminal className="w-4 h-4" />
            Audit Logs
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'team' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Key className="w-4 h-4" />
            Whitelist
          </button>
        </nav>

        <div className={`p-4 border-t ${borderColor}`}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                VX
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0B] rounded-full animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`${headingColor} truncate text-xs font-bold`}>{adminEmail.split('@')[0]}</div>
              <div className="text-[9px] opacity-50 truncate flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                Live Node
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="p-1.5 hover:bg-white/5 rounded-md text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-6 ${surfaceColor} transition-colors duration-500`}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Audit identity, institution, or email..."
                className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 focus:ring-1 focus:ring-indigo-500/30 text-sm transition-all`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] opacity-40 uppercase tracking-widest ml-2 font-bold">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              Pulse: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full border ${borderColor} ${surfaceColor} hover:scale-110 transition-all shadow-sm`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <button 
              onClick={handleExportCSV}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'} px-4 py-2 rounded-md text-xs font-bold transition-all shadow-lg active:scale-95`}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative">
          {isLoading ? (
            <div className={`absolute inset-0 flex items-center justify-center ${bgColor}/80 backdrop-blur-sm z-20`}>
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Synchronizing Node...</span>
              </div>
            </div>
          ) : (
            <div className="p-0">
              {activeTab === 'applicants' && (
                <motion.table 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full border-collapse"
                >
                  <thead className={`sticky top-0 ${bgColor} z-10 transition-colors duration-500`}>
                    <tr className={`border-b ${borderColor} text-[10px] uppercase tracking-widest opacity-50 font-bold`}>
                      <th className="text-left py-4 px-6">ID Signal</th>
                      <th className="text-left py-4 px-6">Protocol Identity</th>
                      <th className="text-left py-4 px-6">Institution Signal</th>
                      <th className="text-left py-4 px-6">Status</th>
                      <th className="text-right py-4 px-6">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants.map((a) => (
                      <tr 
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`border-b ${borderColor} hover:bg-indigo-500/[0.03] cursor-pointer transition-all duration-200 group ${selectedId === a.id ? 'bg-indigo-500/[0.05]' : ''}`}
                      >
                        <td className={`py-4 px-6 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter group-hover:text-indigo-500`}>
                          {a.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className={`${headingColor} font-bold`}>{a.fullName}</div>
                          <div className="text-[11px] opacity-40">{a.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs font-bold">{a.university}</div>
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${a.track === 'core' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-slate-500'}`}>
                            {a.track}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              a.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                              a.status === 'flagged' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span className={`capitalize text-[11px] font-bold ${a.status === 'verified' ? 'text-emerald-500' : ''}`}>
                              {a.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-[11px] opacity-40">
                          {new Date(a.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {filteredApplicants.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-32 text-center opacity-30 text-[10px] uppercase tracking-widest">No Incoming Signals</td>
                      </tr>
                    )}
                  </tbody>
                </motion.table>
              )}

              {activeTab === 'logs' && (
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-xl font-bold ${headingColor} tracking-tighter uppercase`}>System Audit Feed</h2>
                  </div>
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className={`p-4 rounded-lg border ${borderColor} ${inputBg} flex justify-between items-center`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${log.action.includes('ERROR') ? 'bg-red-500' : 'bg-indigo-500'}`} />
                          <div>
                            <div className={`text-xs font-bold ${headingColor}`}>{log.action}</div>
                            <div className="text-[10px] opacity-50">{log.details}</div>
                          </div>
                        </div>
                        <div className="text-[9px] opacity-30 uppercase">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="p-8 max-w-2xl">
                  <h2 className={`text-xl font-bold ${headingColor} tracking-tighter uppercase mb-2`}>Identity Whitelist</h2>
                  <p className="text-xs opacity-50 mb-8">Administrators with verified access to the Ghost Hub node.</p>
                  
                  <div className="flex gap-2 mb-8">
                    <input 
                      type="email"
                      placeholder="Enter administrative email..."
                      className={`flex-1 ${inputBg} border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 transition-all outline-none`}
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <button 
                      onClick={() => toast.info('Protocol in development')}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
                    >
                      Authorize
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className={`p-4 rounded-lg border ${borderColor} flex justify-between items-center bg-indigo-500/5 border-indigo-500/20`}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span className={`text-xs font-bold ${headingColor}`}>{adminEmail}</span>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">Master Admin</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Resizable Inspector Pane */}
      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <Resizable
            key={selectedId} // Reset size when selectedId changes
            defaultSize={{ width: 480, height: '100%' }}
            minWidth={400}
            maxWidth="85%"
            enable={{ left: true }}
            handleStyles={{ 
              left: { 
                width: '10px', 
                left: '-5px', 
                backgroundColor: 'transparent',
                cursor: 'col-resize' 
              } 
            }}
            className={`fixed top-0 right-0 bottom-0 z-50 shadow-2xl transition-colors duration-500`}
            style={{ position: 'relative' }} 
          >
            <div className={`h-full border-l ${borderColor} ${surfaceColor} flex flex-col overflow-hidden`}>
              <div className={`p-4 border-b ${borderColor} flex items-center justify-between shrink-0`}>
                <div className={`flex items-center gap-2 ${headingColor} font-bold text-[10px] tracking-widest uppercase`}>
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  Signal Analysis
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedId(null)}
                    className={`p-1.5 hover:${inputBg} rounded-md text-slate-500`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-8 space-y-10 custom-scrollbar">
                {/* Profile Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Verification Dossier</div>
                    <span className={`text-[10px] ${inputBg} px-2 py-0.5 rounded font-bold border ${borderColor}`}>{selectedApplicant.id}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-2xl font-bold ${headingColor} tracking-tight leading-none`}>
                      {selectedApplicant.fullName}
                    </h3>
                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-tighter">
                      <Mail className="w-3 h-3" />
                      {selectedApplicant.email}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Institution</div>
                      <div className={`${headingColor} font-bold text-xs`}>{selectedApplicant.university}</div>
                    </div>
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Graduation</div>
                      <div className={`${headingColor} font-bold text-xs`}>Class of {selectedApplicant.gradYear || 'N/A'}</div>
                    </div>
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Protocol Track</div>
                      <div className={`${headingColor} font-bold text-xs uppercase`}>{selectedApplicant.track} Signal</div>
                    </div>
                    <div className={`${inputBg} p-4 rounded-xl border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Skill Vector</div>
                      <div className={`${headingColor} font-bold text-xs`}>{selectedApplicant.skillCategory}</div>
                    </div>
                  </div>
                </section>

                {/* Content Section */}
                <section className="space-y-4">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Signal Rationale</div>
                  <div className={`${inputBg} p-6 rounded-xl border ${borderColor} ${textColor} leading-relaxed relative overflow-hidden group shadow-inner`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/30" />
                    <p className="text-sm italic">"{selectedApplicant.rationale}"</p>
                  </div>
                  
                  {selectedApplicant.projectContext && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Project Context</div>
                      <div className="text-xs leading-relaxed opacity-70 p-4 rounded-lg bg-white/5 border border-white/5">
                        {selectedApplicant.projectContext}
                      </div>
                    </div>
                  )}

                  {selectedApplicant.motivation && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Admission Motivation</div>
                      <div className="text-xs leading-relaxed opacity-70 p-4 rounded-lg bg-white/5 border border-white/5">
                        {selectedApplicant.motivation}
                      </div>
                    </div>
                  )}

                  {selectedApplicant.commitment && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Commitment Level</div>
                      <div className="text-xs leading-relaxed font-bold text-indigo-500">
                        {selectedApplicant.commitment}
                      </div>
                    </div>
                  )}
                </section>

                {/* Proof Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Capability Proof</div>
                    {selectedApplicant.proofUrl && (
                      <a 
                        href={selectedApplicant.proofUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
                      >
                        DECRYPT SOURCE <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className={`aspect-video ${theme === 'dark' ? 'bg-black' : 'bg-slate-200'} rounded-xl border ${borderColor} flex flex-col items-center justify-center relative overflow-hidden group shadow-inner`}>
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FileText className="w-8 h-8 text-indigo-500 mb-2 opacity-40 group-hover:scale-110 transition-transform" />
                    <div className={`text-[10px] ${headingColor} font-bold tracking-widest`}>INTERNAL PREVIEW SECURED</div>
                    <div className="text-[9px] opacity-30 mt-1 uppercase tracking-tighter">Protocol v1.0.4-GHOST</div>
                  </div>
                </section>

                {/* Tags */}
                <section className="space-y-4">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">System Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Timeline */}
                <section className="space-y-4">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Node Timeline</div>
                  <div className="space-y-4 border-l-2 border-indigo-500/10 ml-1 pl-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="text-xs">
                        <span className={`${headingColor} font-bold`}>System:</span> Signal captured successfully.
                        <div className="text-[9px] opacity-40 mt-0.5 uppercase">{new Date(selectedApplicant.submittedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    {selectedApplicant.status !== 'pending' && (
                      <div className="relative">
                        <div className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500`} />
                        <div className="text-xs">
                          <span className={`${headingColor} font-bold`}>Audit:</span> Protocol marked as {selectedApplicant.status}.
                          <div className="text-[9px] opacity-40 mt-0.5 uppercase">Identity Verified</div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Action Toolbar */}
              <div className={`p-8 border-t ${borderColor} ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-slate-50'} space-y-4 shrink-0`}>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedApplicant.id, 'verified')}
                    className={`flex-1 ${theme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'} h-12 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95`}
                  >
                    VERIFY SIGNAL [V]
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedApplicant.id, 'flagged')}
                    className={`flex-1 border ${borderColor} ${headingColor} h-12 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:${inputBg} transition-all active:scale-95`}
                  >
                    FLAG FOR AUDIT [F]
                  </button>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleStatusUpdate(selectedApplicant.id, 'archived')}
                    className="flex-1 border border-red-500/20 text-red-500/70 h-12 rounded-lg font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-red-500/5 transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ARCHIVE PROTOCOL
                  </button>
                </div>
              </div>
            </div>
          </Resizable>
        )}
      </AnimatePresence>
    </div>
  );
}
