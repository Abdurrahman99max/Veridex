import React, { useState } from 'react';
import { Loader2, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { seedDemoData } from '../utils/seed-demo-data';
import { toast } from 'sonner@2.0.3';

interface DemoDataSeederProps {
  token: string;
  adminEmail: string;
  onLogout: () => void;
}

export function DemoDataSeeder({ token, adminEmail, onLogout }: DemoDataSeederProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);
    setResults([]);

    try {
      const seedResults = await seedDemoData();
      setResults(seedResults);
      toast.success(`Successfully created ${seedResults.length} demo applicants!`);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to seed demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-indigo-500" />
            <div>
              <h1 className="text-2xl font-bold">Demo Data Seeder</h1>
              <p className="text-xs opacity-50 mt-1">Populate your Veridex backend with test applicants</p>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-500 mb-1">Test Data Only</p>
                <p className="text-[11px] opacity-60 leading-relaxed">
                  This will create 5 demo applicants with realistic data. Run this once to test your admin system.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-sm uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                Seed Demo Data
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-rose-500 mb-1">Seeding Failed</p>
                  <p className="text-[11px] opacity-60 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
                  Successfully Created {results.length} Applicants
                </h3>
              </div>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs">{r.name}</span>
                    <span className="text-[10px] font-mono text-indigo-500 font-bold">{r.id}</span>
                  </div>
                ))}
              </div>
              <div className="text-center pt-4">
                <p className="text-xs opacity-50">Now refresh your Admin Hub to see the data!</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/?dex=1"
            className="text-xs text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold"
          >
            ← Back to Admin Hub
          </a>
        </div>
      </div>
    </div>
  );
}