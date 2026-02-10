import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap
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
  submittedAt: string;
  tags: string[];
}

interface AdminHubProps {
  token: string;
  adminEmail: string;
}

export function AdminHub({ token, adminEmail }: AdminHubProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'core' | 'prep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Fetch applicants
  useEffect(() => {
    fetchApplicants();
    const interval = setInterval(fetchApplicants, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setApplicants(data);
      setLastSync(new Date());
    } catch (err) {
      toast.error('Sync interruption detected');
    } finally {
      setIsLoading(false);
    }
  };

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
        toast.success(`Protocol ${id} updated to ${status}`);
        if (status === 'verified' || status === 'archived') {
          setSelectedId(null);
        }
      }
    } catch (err) {
      toast.error('Protocol update failed');
    }
  };

  const selectedApplicant = applicants.find(a => a.id === selectedId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      if (e.key === 'v' || e.key === 'V') {
        handleStatusUpdate(selectedId, 'verified');
      } else if (e.key === 'f' || e.key === 'F') {
        handleStatusUpdate(selectedId, 'flagged');
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const filteredApplicants = applicants.filter(a => {
    const matchesTrack = filter === 'all' || a.track === filter;
    const matchesSearch = a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch && a.status !== 'archived';
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

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
          <div className="pb-2 px-3 text-[10px] uppercase tracking-widest opacity-50">Protocols</div>
          <button 
            onClick={() => setFilter('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" />
            All Signals
            <span className="ml-auto text-[10px] opacity-40">{applicants.length}</span>
          </button>
          <button 
            onClick={() => setFilter('core')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${filter === 'core' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Zap className="w-4 h-4" />
            Core Track
          </button>
          <button 
            onClick={() => setFilter('prep')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${filter === 'prep' ? 'bg-indigo-500/10 text-indigo-500 font-bold' : 'hover:bg-white/5'}`}
          >
            <Activity className="w-4 h-4" />
            Prep Track
          </button>
          
          <div className="pt-8 pb-2 px-3 text-[10px] uppercase tracking-widest opacity-50">System</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
            <Clock className="w-4 h-4" />
            Audit Logs
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
            Team Manager
          </button>
        </nav>

        <div className={`p-4 border-t ${borderColor}`}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white">
                VX
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0B] rounded-full animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`${headingColor} truncate text-xs font-bold`}>{adminEmail.split('@')[0]}</div>
              <div className="text-[9px] opacity-50 truncate flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                Live Node 04
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="p-1.5 hover:bg-white/5 rounded-md text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
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
                placeholder="Search protocol identity..."
                className={`w-full ${inputBg} border-none rounded-md pl-10 pr-4 py-2 focus:ring-1 focus:ring-indigo-500/30 text-sm transition-all`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] opacity-40 uppercase tracking-widest ml-2">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              Last Sync: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full border ${borderColor} ${surfaceColor} hover:scale-110 transition-all shadow-sm`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <div className={`flex items-center ${inputBg} rounded-md p-1`}>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-slate-900 shadow-sm') : 'hover:opacity-70'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white text-slate-900 shadow-sm') : 'hover:opacity-70'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <button className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'} px-4 py-2 rounded-md text-xs font-bold transition-all shadow-lg active:scale-95`}>
              <FileText className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </header>

        {/* List View */}
        <div className="flex-1 overflow-auto relative">
          {isLoading ? (
            <div className={`absolute inset-0 flex items-center justify-center ${bgColor}/80 backdrop-blur-sm z-20`}>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <div className="absolute inset-0 blur-md bg-indigo-500/20 animate-pulse" />
                </div>
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Establishing Protocol Link...</span>
              </div>
            </div>
          ) : (
            <motion.table 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full border-collapse"
            >
              <thead className={`sticky top-0 ${bgColor} z-10 transition-colors duration-500`}>
                <tr className={`border-b ${borderColor} text-[10px] uppercase tracking-widest opacity-50`}>
                  <th className="text-left py-4 px-6 font-medium">Protocol ID</th>
                  <th className="text-left py-4 px-6 font-medium">Applicant</th>
                  <th className="text-left py-4 px-6 font-medium">Track</th>
                  <th className="text-left py-4 px-6 font-medium">Tags</th>
                  <th className="text-left py-4 px-6 font-medium">Status</th>
                  <th className="text-right py-4 px-6 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a) => (
                  <motion.tr 
                    variants={itemVariants}
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`border-b ${borderColor} hover:bg-indigo-500/[0.03] cursor-pointer transition-all duration-200 group ${selectedId === a.id ? 'bg-indigo-500/[0.05]' : ''}`}
                  >
                    <td className={`py-4 px-6 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter group-hover:text-indigo-500 transition-colors`}>
                      {a.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`${headingColor} font-bold`}>{a.fullName}</div>
                      <div className="text-[11px] opacity-40">{a.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.track === 'core' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {a.track}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {a.tags.map(tag => (
                          <span key={tag} className={`text-[9px] px-1.5 py-0.5 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'} rounded border text-slate-400`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          a.status === 'verified' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          a.status === 'flagged' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-400 animate-pulse'
                        }`} />
                        <span className={`capitalize text-xs font-bold ${a.status === 'verified' ? 'text-emerald-500' : a.status === 'flagged' ? 'text-amber-500' : ''}`}>
                          {a.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-[11px] opacity-40">
                      {new Date(a.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          )}
          {!isLoading && filteredApplicants.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-500 gap-4">
              <div className={`w-16 h-16 rounded-full ${inputBg} flex items-center justify-center`}>
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center">
                <p className="font-bold uppercase tracking-widest text-[10px] mb-1">Silence on the Wire</p>
                <p className="text-xs opacity-40">No protocols matching current search parameters.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Inspector Pane */}
      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`w-[480px] border-l ${borderColor} ${surfaceColor} flex flex-col z-50 shadow-2xl transition-colors duration-500`}
          >
            <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
              <div className={`flex items-center gap-2 ${headingColor} font-bold text-[10px] tracking-widest uppercase`}>
                <Activity className="w-4 h-4 text-indigo-500" />
                Protocol Inspection
              </div>
              <button 
                onClick={() => setSelectedId(null)}
                className={`p-1 hover:${inputBg} rounded-md transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-10">
              {/* Profile */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Identity Signature</div>
                  <span className={`text-[10px] ${inputBg} px-2 py-0.5 rounded font-bold`}>{selectedApplicant.id}</span>
                </div>
                <div className="space-y-1">
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-2xl font-bold ${headingColor} tracking-tight leading-none`}
                  >
                    {selectedApplicant.fullName}
                  </motion.h3>
                  <div className="text-indigo-500 font-bold text-xs">{selectedApplicant.university}</div>
                </div>
                <div className="flex gap-4">
                  <div className={`flex-1 ${inputBg} p-4 rounded-lg border ${borderColor}`}>
                    <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Protocol Track</div>
                    <div className={`${headingColor} capitalize font-bold text-xs`}>{selectedApplicant.track} Level</div>
                  </div>
                  <div className={`flex-1 ${inputBg} p-4 rounded-lg border ${borderColor}`}>
                    <div className="text-[9px] uppercase opacity-50 mb-2 font-bold tracking-widest">Skill Vector</div>
                    <div className={`${headingColor} font-bold text-xs`}>{selectedApplicant.skillCategory}</div>
                  </div>
                </div>
              </section>

              {/* Technical Rationale */}
              <section className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Signal Rationale</div>
                <div className={`${inputBg} p-6 rounded-xl border ${borderColor} ${textColor} leading-relaxed relative overflow-hidden group`}>
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-colors" />
                   <p className="italic text-sm">"{selectedApplicant.rationale}"</p>
                </div>
              </section>

              {/* Proof View */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Capability Proof</div>
                  <a 
                    href={selectedApplicant.proofUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
                  >
                    DECRYPT SOURCE <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className={`aspect-video ${theme === 'dark' ? 'bg-black' : 'bg-slate-200'} rounded-xl border ${borderColor} flex flex-col items-center justify-center relative overflow-hidden group shadow-inner`}>
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className={`text-[10px] ${headingColor} font-bold tracking-widest`}>INTERNAL PREVIEW SECURED</div>
                    <div className="text-[9px] opacity-30 mt-1 uppercase tracking-tighter">Protocol v1.0.4-GHOST</div>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Node History</div>
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
                      <div className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full ${selectedApplicant.status === 'verified' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                      <div className="text-xs">
                        <span className={`${headingColor} font-bold`}>Audit:</span> Status updated to {selectedApplicant.status}.
                        <div className="text-[9px] opacity-40 mt-0.5 uppercase">Now</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Actions Bar */}
            <div className={`p-8 border-t ${borderColor} ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-slate-50'} space-y-4`}>
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
              <div className="flex items-center justify-center gap-3 text-[10px] opacity-30 uppercase tracking-[0.2em] pt-2">
                <Keyboard className="w-3 h-3" />
                <span>ESC to Disconnect</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
