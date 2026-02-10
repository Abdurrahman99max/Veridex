import React, { useState, useEffect } from 'react';
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
  Loader2
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

  // Fetch applicants
  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/applicants`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setApplicants(data);
    } catch (err) {
      toast.error('Failed to sync protocols');
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
        toast.success(`Protocol ${id} marked as ${status}`);
        if (status === 'verified' || status === 'archived') {
          setSelectedId(null);
        }
      }
    } catch (err) {
      toast.error('Update failed');
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

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-300 font-mono text-sm">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tighter text-lg">VERIDEX</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setFilter('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-white/5 text-white' : 'hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" />
            All Protocols
            <span className="ml-auto text-[10px] opacity-40">{applicants.length}</span>
          </button>
          <button 
            onClick={() => setFilter('core')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${filter === 'core' ? 'bg-white/5 text-white' : 'hover:bg-white/5'}`}
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            Core Track
          </button>
          <button 
            onClick={() => setFilter('prep')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${filter === 'prep' ? 'bg-white/5 text-white' : 'hover:bg-white/5'}`}
          >
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            Prep Track
          </button>
          
          <div className="pt-8 pb-2 px-3 text-[10px] uppercase tracking-widest text-slate-500">System</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
            <Clock className="w-4 h-4" />
            Audit Logs
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
            Team Manager
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white truncate">Admin Account</div>
              <div className="text-[10px] opacity-40 truncate text-emerald-500">Connected</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0D0D0F]">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search protocol identity..."
                className="w-full bg-white/5 border-none rounded-md pl-10 pr-4 py-2 focus:ring-1 focus:ring-white/10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-md p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </header>

        {/* List View */}
        <div className="flex-1 overflow-auto relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0B]/50 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Syncing Protocols...</span>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#0A0A0B] z-10">
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
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
                  <tr 
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedId === a.id ? 'bg-white/[0.04]' : ''}`}
                  >
                    <td className="py-4 px-6 font-bold text-white tracking-tighter">{a.id}</td>
                    <td className="py-4 px-6">
                      <div className="text-white">{a.fullName}</div>
                      <div className="text-[11px] opacity-40">{a.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.track === 'core' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {a.track}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {a.tags.map(tag => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          a.status === 'verified' ? 'bg-emerald-500' : 
                          a.status === 'flagged' ? 'bg-amber-500' : 'bg-slate-500 animate-pulse'
                        }`} />
                        <span className="capitalize text-xs">{a.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-[11px] opacity-40">
                      {new Date(a.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filteredApplicants.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              No protocols matching current filters.
            </div>
          )}
        </div>
      </main>

      {/* Inspector Pane */}
      <AnimatePresence>
        {selectedId && selectedApplicant && (
          <motion.aside 
            initial={{ x: 450 }}
            animate={{ x: 0 }}
            exit={{ x: 450 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[450px] border-l border-white/5 bg-[#0D0D0F] flex flex-col z-20"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <FileText className="w-4 h-4 text-indigo-400" />
                PROTOCOL INSPECTION
              </div>
              <button 
                onClick={() => setSelectedId(null)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-8">
              {/* Profile */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Applicant Identity</div>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded">{selectedApplicant.id}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{selectedApplicant.fullName}</h3>
                  <div className="text-slate-400">{selectedApplicant.university}</div>
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="flex-1 bg-white/5 p-3 rounded border border-white/5">
                    <div className="text-[9px] uppercase text-slate-500 mb-1">Track</div>
                    <div className="text-white capitalize">{selectedApplicant.track} Protocol</div>
                  </div>
                  <div className="flex-1 bg-white/5 p-3 rounded border border-white/5">
                    <div className="text-[9px] uppercase text-slate-500 mb-1">Skill</div>
                    <div className="text-white">{selectedApplicant.skillCategory}</div>
                  </div>
                </div>
              </section>

              {/* Technical Rationale */}
              <section className="space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Technical Rationale</div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-slate-300 leading-relaxed italic">
                  "{selectedApplicant.rationale}"
                </div>
              </section>

              {/* Proof View (Internal Frame Simulation) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Proof of Capability</div>
                  <a 
                    href={selectedApplicant.proofUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
                  >
                    Open Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="aspect-video bg-black rounded-lg border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FileText className="w-8 h-8 text-white/20 mb-2" />
                  <div className="text-[10px] text-white/40">INTERNAL PREVIEW FRAME</div>
                  <div className="text-[9px] text-white/20 mt-1 uppercase tracking-widest">Protocol Secured</div>
                </div>
              </section>

              {/* Internal Logs */}
              <section className="space-y-3 pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Audit History</div>
                <div className="space-y-3">
                  <div className="flex gap-3 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                    <div>
                      <span className="text-white">System:</span> Protocol submitted successfully.
                      <div className="text-[10px] opacity-30 mt-0.5">Today at 10:45 AM</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Actions Bar */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant.id, 'verified')}
                  className="flex-1 bg-white text-black h-10 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  VERIFY [V]
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant.id, 'flagged')}
                  className="flex-1 border border-white/10 text-white h-10 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                >
                  FLAG [F]
                </button>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleStatusUpdate(selectedApplicant.id, 'archived')}
                  className="flex-1 border border-red-500/20 text-red-400 h-10 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  ARCHIVE
                </button>
                <button 
                  className="flex-1 border border-white/10 text-white h-10 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  CONTACT
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <Keyboard className="w-3 h-3" />
                <span>ESC to close</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
