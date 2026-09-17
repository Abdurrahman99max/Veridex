import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, Award, Sparkles } from 'lucide-react';

interface Props {
  applicant: any;
  adminEmail: string;
  onClose: () => void;
  onEvaluated: () => void;
  projectId: string;
  publicAnonKey: string;
}

const RUBRIC = [
  { key: 'authenticity', label: 'Authenticity', desc: 'Live URL vs template/mockup', weight: 0.3 },
  { key: 'technicalDepth', label: 'Technical Depth', desc: 'Trade-off rationale 20w+', weight: 0.3 },
  { key: 'completeness', label: 'Completeness', desc: '1:1 proof vs Hello World', weight: 0.25 },
  { key: 'reproducibility', label: 'Reproducibility', desc: 'README, runnable, evidence', weight: 0.15 },
];

export const EvaluationPanel: React.FC<Props> = ({ applicant, adminEmail, onClose, onEvaluated, projectId, publicAnonKey }) => {
  const [scores, setScores] = useState<Record<string, number>>({ authenticity: 3, technicalDepth: 3, completeness: 3, reproducibility: 3 });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const calc = useMemo(() => {
    let weighted = 0;
    RUBRIC.forEach(r => { weighted += (scores[r.key] / 5) * 100 * r.weight; });
    const score = Math.round(weighted);
    // Map to 3 Figma sub-scores approximation
    const delivery = Math.round((scores.authenticity + scores.reproducibility) / 10 * 100);
    const quality = Math.round((scores.technicalDepth + scores.completeness) / 10 * 100);
    const consistency = Math.round((scores.completeness + scores.authenticity) / 10 * 100);
    const tier = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'under_review';
    const decision = score >= 80 ? 'ACCEPTED' : score >= 50 ? 'ROUTED_TO_PREP' : 'REJECTED';
    return { score, delivery, quality, consistency, tier, decision };
  }, [scores]);

  const canSubmit = notes.trim().length >= 10 || calc.decision === 'ACCEPTED' ? true : false;
  const needsNotes = calc.decision !== 'ACCEPTED' && notes.trim().length < 10;

  const submit = async () => {
    if (needsNotes) { setError('Add ≥10 chars justification for REJECT / ROUTED_TO_PREP'); return; }
    setSubmitting(true); setError('');
    try {
      const idempotencyKey = `eval-${applicant.id}-${Date.now()}`;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-45707f2b/admin/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          applicationId: applicant.id,
          operator: adminEmail,
          scores,
          notes,
          reliability_score: calc.score,
          subScores: { delivery: calc.delivery, quality: calc.quality, consistency: calc.consistency },
          tier: calc.tier,
          decision: calc.decision,
          idempotencyKey,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Evaluate failed');
      onEvaluated();
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">Evaluation — {applicant.skillCategory || 'General'}</p>
          <h3 className="font-urbanist font-bold text-lg text-[#0D1825] mt-1">Score the submission</h3>
          <p className="font-inter text-xs text-[#6B7F94] mt-1">Login → Evaluate → Submit (4 criteria, 0-5 each). Score auto-maps to tier/decision.</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F8F9FB]"><X className="w-4 h-4 text-[#6B7F94]" /></button>
      </div>

      <div className="mt-6 grid gap-4">
        {RUBRIC.map(r => (
          <div key={r.key} className="bg-[#F8F9FB] rounded-xl border border-[#E2E6ED] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter font-semibold text-sm text-[#0D1825]">{r.label} <span className="text-xs font-normal text-[#9AAABB]">· {r.desc}</span></p>
                <p className="font-inter text-xs text-[#9AAABB] mt-0.5">Weight {(r.weight*100).toFixed(0)}%</p>
              </div>
              <span className="font-urbanist font-bold text-[#08307F] text-lg">{scores[r.key]}/5</span>
            </div>
            <input type="range" min={0} max={5} step={1} value={scores[r.key]} onChange={e=>setScores({...scores, [r.key]: parseInt(e.target.value)})} className="w-full mt-3 accent-[#08307F]" />
            <div className="flex justify-between font-inter text-xs text-[#9AAABB]"><span>0 weak</span><span>5 excellent</span></div>
          </div>
        ))}
      </div>

      {/* Live preview — Figma 94% style */}
      <div className="mt-6 bg-white rounded-2xl border border-[#E2E6ED] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-xs font-semibold tracking-widest uppercase text-[#9AAABB]">Live Preview</p>
            <p className="font-urbanist font-bold text-2xl text-[#0D1825] mt-1">{calc.score}% <span className={`text-sm font-semibold ${calc.tier==='high'?'text-[#07A334]':calc.tier==='medium'?'text-amber-600':'text-[#D4183D]'}`}>{calc.tier==='high'?'High Reliability':calc.tier==='medium'?'Medium':'Under Review'}</span></p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${calc.tier==='high'?'bg-[#D4FCE3]':calc.tier==='medium'?'bg-amber-100':'bg-[#FFF1F2]'}`}>
            {calc.tier==='high' ? <ShieldCheck className="w-5 h-5 text-[#07A334]" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
          </div>
        </div>
        {[
          {label:'Delivery Reliability', v:calc.delivery},
          {label:'Output Quality', v:calc.quality},
          {label:'Consistency', v:calc.consistency},
        ].map(m=>(
          <div key={m.label} className="mt-3">
            <div className="flex justify-between"><span className="font-inter text-xs font-semibold text-[#4A5D70]">{m.label}</span><span className="font-inter text-xs font-semibold text-[#08307F]">{m.v}%</span></div>
            <div className="h-2 rounded-full bg-[#E2E6ED] overflow-hidden mt-1"><div className="h-full rounded-full bg-[#0BE149]" style={{width:`${m.v}%`}} /></div>
          </div>
        ))}
        <p className="font-inter text-xs text-[#9AAABB] mt-3">Decision → <span className="font-semibold text-[#0D1825]">{calc.decision}</span> {calc.decision==='ACCEPTED'?'✓ Core':calc.decision==='ROUTED_TO_PREP'?'→ Prep Track':'✕ Reject'}</p>
        {calc.score>=50 && calc.score<80 && <p className="font-inter text-xs text-amber-700 mt-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Borderline 50-79 may need moderator second approval.</p>}
      </div>

      <div className="mt-4">
        <label className="font-inter text-xs font-semibold tracking-widest uppercase text-[#6B7F94]">Evaluator notes {calc.decision!=='ACCEPTED' && <span className="text-[#D4183D]">* required ≥10 chars</span>}</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={calc.decision==='ACCEPTED' ? 'Optional: praise or next steps…' : 'Required: why reject/route to prep? Reference acceptable/rejection cards.'} rows={3} className="w-full mt-1 rounded-xl border border-[#E2E6ED] px-3 py-2.5 text-sm font-inter bg-[#F8F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BE149] focus:border-[#0BE149]" />
      </div>

      {error && <p className="font-inter text-xs text-[#D4183D] mt-2">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E2E6ED] font-inter font-semibold text-sm hover:bg-[#F8F9FB]">Cancel</button>
        <button onClick={submit} disabled={submitting || needsNotes} className={`flex-1 py-3 rounded-xl font-inter font-bold text-sm flex items-center justify-center gap-2 ${needsNotes ? 'bg-[#E2E6ED] text-[#9AAABB] cursor-not-allowed' : calc.decision==='ACCEPTED' ? 'bg-[#08307F] text-white hover:bg-[#041D50]' : calc.decision==='ROUTED_TO_PREP' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-[#D4183D] text-white hover:bg-[#B0122F]'} disabled:opacity-50`}>
          {submitting ? 'Submitting…' : calc.decision==='ACCEPTED' ? <><Check className="w-4 h-4" /> Accept → Core</> : calc.decision==='ROUTED_TO_PREP' ? 'Route to Prep' : 'Reject'}
        </button>
      </div>
      <p className="font-inter text-xs text-[#9AAABB] mt-2 text-center">Login → Evaluate (this panel) → Submit = audit + email + idempotency `eval-{id}`</p>
    </div>
  );
};
