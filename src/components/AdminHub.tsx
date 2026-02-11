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
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs' | 'team'>('applicants');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'prep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${publicAnonKey}` };
      const [appRes, logRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants`, { headers }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/audit-logs`, { headers }).catch(() => null)
      ]);
      if (appRes && appRes.ok) setApplicants(await appRes.json());
      if (logRes && logRes.ok) setAuditLogs(await logRes.json());
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
    setIsUpdatingStatus(status);
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
        toast.success(`Protocol ${id} status updated to ${status}`);
        fetchAllData(); 
      }
    } catch (err) {
      toast.error('Protocol update rejected');
    } finally {
      setIsUpdatingStatus(null);
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
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Failed to generate vault link');
      }
    } catch (err) {
      toast.error('Vault access error');
    }
  };

  const selectedApplicant = applicants.find(a => a.id === selectedId);
  const filteredApplicants = applicants.filter(a => {
    const matchesTrack = filter === 'all' || a.track === filter;
    const matchesSearch = 
      (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.university || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch && a.status !== 'archived';
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const bgColor = theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-[#FAFAFA]';
  const surfaceColor = theme === 'dark' ? 'bg-[#0D0D0F]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-white/5' : 'border-slate-200';
  const textColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const inputBg = theme === 'dark' ? 'bg-white/5' : 'bg-slate-100';

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} font-mono text-sm transition-colors duration-500 overflow-hidden relative`}>
      <aside className={`w-64 border-r ${borderColor} hidden md:flex flex-col z-20`}>
        <div className={`p-6 border-b ${borderColor} flex items-center gap-3`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold ${headingColor} tracking-tighter text-lg uppercase`}>VERIDEX</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('applicants'); setFilter('all'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
            <Users className="w-4 h-4" /> All Signals
          </button>
          <button onClick={() => { setActiveTab('applicants'); setFilter('core'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
            <Zap className="w-4 h-4" /> Core Track
          </button>
          <button onClick={() => { setActiveTab('applicants'); setFilter('prep'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'applicants' && filter === 'prep' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
            <Activity className="w-4 h-4" /> Prep Track
          </button>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === 'logs' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}>
            <Terminal className="w-4 h-4" /> Audit Logs
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-6 ${surfaceColor}`}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Audit identity..." className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 text-sm`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full border ${borderColor} ${surfaceColor}`}>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <button onClick={handleExportCSV} className={`bg-white text-black px-4 py-2 rounded-md text-xs font-bold`}>
              Export
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
          ) : (
            <table className="w-full border-collapse">
              <thead className={`sticky top-0 ${bgColor}`}>
                <tr className={`border-b ${borderColor} text-[10px] uppercase tracking-widest opacity-50 font-bold`}>
                  <th className="text-left py-4 px-6">ID Signal</th>
                  <th className="text-left py-4 px-6">Identity</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-right py-4 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedId(a.id)} className={`border-b ${borderColor} hover:bg-white/5 cursor-pointer transition-all ${selectedId === a.id ? 'bg-indigo-500/5' : ''}`}>
                    <td className="py-4 px-6 font-bold">{a.id}</td>
                    <td className="py-4 px-6">
                      <div className={`${headingColor} font-bold`}>{a.fullName}</div>
                      <div className="text-[11px] opacity-40">{a.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'verified' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="capitalize text-[11px]">{a.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-[11px] opacity-40">{new Date(a.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <Resizable
            key={selectedId}
            defaultSize={{ width: 450, height: '100%' }}
            minWidth={350} maxWidth="80%" enable={{ left: true }}
            className={`fixed top-0 right-0 bottom-0 z-50 shadow-2xl`}
          >
            <div className={`h-full border-l ${borderColor} ${surfaceColor} flex flex-col`}>
              <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
                <div className={`${headingColor} font-bold text-[10px] tracking-widest uppercase`}>Protocol Inspection</div>
                <button onClick={() => setSelectedId(null)}><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-auto p-8 space-y-8">
                <section className="space-y-4">
                  <h3 className={`text-xl font-bold ${headingColor}`}>{selectedApplicant.fullName}</h3>
                  <div className="text-indigo-500 text-xs font-bold uppercase">{selectedApplicant.email}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${inputBg} p-4 rounded-lg border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-1">Institution</div>
                      <div className="text-xs">{selectedApplicant.university}</div>
                    </div>
                    <div className={`${inputBg} p-4 rounded-lg border ${borderColor}`}>
                      <div className="text-[9px] uppercase opacity-50 mb-1">Track</div>
                      <div className="text-xs uppercase">{selectedApplicant.track}</div>
                    </div>
                  </div>
                </section>
                <section className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Trust Anchor</div>
                  {selectedApplicant.documentPath ? (
                    <button 
                      onClick={() => handleViewDocument(selectedApplicant.documentPath!)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border ${borderColor} ${inputBg} hover:border-indigo-500 transition-all group`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-tight">ENCRYPTED_ID_DOCUMENT.VAULT</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ) : (
                    <div className={`${inputBg} p-4 rounded-lg border ${borderColor} text-xs opacity-40 italic`}>No document attached to this signal.</div>
                  )}
                </section>
                <section className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Rationale</div>
                  <div className={`${inputBg} p-4 rounded-lg border ${borderColor} italic`}>"{selectedApplicant.rationale}"</div>
                </section>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => handleStatusUpdate(selectedId, 'verified')} className="flex-1 bg-white text-black py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Verify</button>
                  <button onClick={() => handleStatusUpdate(selectedId, 'flagged')} className="flex-1 border border-white/10 py-3 rounded-lg font-bold text-xs uppercase tracking-widest">Flag</button>
                </div>
              </div>
            </div>
          </Resizable>
        )}
      </AnimatePresence>
    </div>
  );
}
