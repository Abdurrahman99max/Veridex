import React from 'react';
import { Hero } from './Hero';
import { WhoIsThisFor } from './WhoIsThisFor';
import { WhatWeLookFor } from './WhatWeLookFor';
import { HowItWorks } from './HowItWorks';
import { ReliabilitySection } from './ReliabilitySection';
import { CohortSection } from './CohortSection';
import { EmployerSection } from './EmployerSection';
import { Footer } from '../layout/Footer';

interface LandingPageProps {
  onApply: () => void;
  onWaitlist: () => void;
  onCheckStatus: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onApply, onWaitlist, onCheckStatus }) => {
  return (
    <div className="flex flex-col">
      <Hero onApply={onApply} onWaitlist={onWaitlist} onCheckStatus={onCheckStatus} />
      <ReliabilitySection onApply={onApply} />
      <WhoIsThisFor onApply={onApply} />
      <HowItWorks onApply={onApply} />
      <CohortSection onApply={onApply} onWaitlist={onWaitlist} />
      <WhatWeLookFor onApply={onApply} onWaitlist={onWaitlist} />
      <EmployerSection onApply={onApply} />
      <Footer />
    </div>
  );
};
