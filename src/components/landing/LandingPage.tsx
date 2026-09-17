import React from 'react';
import { Hero } from './Hero';
import { WhoIsThisFor } from './WhoIsThisFor';
import { WhatWeLookFor } from './WhatWeLookFor';
import { HowItWorks } from './HowItWorks';
import { ReliabilitySection } from './ReliabilitySection';
import { RiskSection } from './RiskSection';
import { CohortSection } from './CohortSection';
import { EmployerSection } from './EmployerSection';
import { FinalCTASection } from './FinalCTASection';
import { Footer } from '../layout/Footer';

interface LandingPageProps {
  onApply: () => void;
  onWaitlist: () => void;
  onCheckStatus: () => void;
  onResumeDraft?: () => void;
  hasDraft?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onApply, onWaitlist, onCheckStatus, onResumeDraft, hasDraft }) => {
  return (
    <div className="flex flex-col">
      {hasDraft && onResumeDraft && (
        <div className="sticky top-0 z-50 bg-[#08307F] text-white px-4 py-3 flex items-center justify-center gap-4 text-sm">
          <span className="font-inter">You have an unfinished application.</span>
          <button onClick={onResumeDraft} className="px-4 py-1.5 rounded-full bg-[#0BE149] text-[#08307F] font-semibold text-xs hover:bg-white transition">Resume application →</button>
        </div>
      )}
      <Hero onApply={onApply} onWaitlist={onWaitlist} onCheckStatus={onCheckStatus} />
      {/* Figma UI preserved in order as on figma.site */}
      <ReliabilitySection onApply={onApply} />
      <RiskSection />
      <WhoIsThisFor onApply={onApply} />
      <HowItWorks onApply={onApply} />
      <CohortSection onApply={onApply} onWaitlist={onWaitlist} />
      <WhatWeLookFor onApply={onApply} onWaitlist={onWaitlist} />
      <EmployerSection onApply={onApply} />
      <FinalCTASection onApply={onApply} />
      <Footer />
    </div>
  );
};
