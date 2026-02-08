import React from 'react';
import { Hero } from './Hero';
import { WhoIsThisFor } from './WhoIsThisFor';
import { WhatWeLookFor } from './WhatWeLookFor';
import { HowItWorks } from './HowItWorks';
import { Footer } from '../layout/Footer';

interface LandingPageProps {
  onApply: () => void;
  onWaitlist: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onApply, onWaitlist }) => {
  return (
    <div className="flex flex-col">
      <Hero onApply={onApply} onWaitlist={onWaitlist} />
      <WhoIsThisFor onApply={onApply} />
      <HowItWorks onApply={onApply} />
      <WhatWeLookFor onApply={onApply} onWaitlist={onWaitlist} />
      <Footer />
    </div>
  );
};
