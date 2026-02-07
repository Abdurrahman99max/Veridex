import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Hero } from './components/landing/Hero';
import { WhoIsThisFor } from './components/landing/WhoIsThisFor';
import { HowItWorks } from './components/landing/HowItWorks';
import { WhatWeLookFor } from './components/landing/WhatWeLookFor';
import { Footer } from './components/layout/Footer';
import { EntryGate } from './components/application/EntryGate';
import { Step1Eligibility } from './components/application/Step1Eligibility';
import { Step2SkillProof } from './components/application/Step2SkillProof';
import { Step3Availability } from './components/application/Step3Availability';
import { SubmissionConfirmation } from './components/application/SubmissionConfirmation';
import { PrepStep1Context } from './components/application/PrepStep1Context';
import { PrepStep2Skill } from './components/application/PrepStep2Skill';
import { PrepStep3Commitment } from './components/application/PrepStep3Commitment';

type ViewState = 'landing' | 'entry' | 'step1' | 'step2' | 'step3' | 'prepStep1' | 'prepStep2' | 'prepStep3' | 'confirmation';
type Track = 'core' | 'prep';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [track, setTrack] = useState<Track>('core');
  const [applicationData, setApplicationData] = useState<any>({});

  const startApplication = () => {
    window.scrollTo(0, 0);
    setView('entry');
  };

  const proceedToStep1 = () => {
    window.scrollTo(0, 0);
    setView('step1');
  };

  const handleStep1Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    
    // Branching Logic
    const prepYears = ['2027', '2028', '2029+'];
    if (prepYears.includes(data.gradYear)) {
      setTrack('prep');
      setView('prepStep1');
    } else {
      setTrack('core');
      setView('step2'); // Route to Core Step 2
    }
  };

  const handleStep2Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    setView('step3'); 
  };

  const handleStep3Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    setView('confirmation');
  };
  
  // Prep Track Handlers
  const handlePrepStep1Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    setView('prepStep2');
  };

  const handlePrepStep2Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    setView('prepStep3');
  };

  const handlePrepStep3Complete = (data: any) => {
    setApplicationData({ ...applicationData, ...data });
    window.scrollTo(0, 0);
    setView('confirmation');
  };
  
  const joinWaitlist = () => {
    // Direct entry to Prep Track
    setTrack('prep');
    setApplicationData({}); // Clear any previous data
    window.scrollTo(0, 0);
    setView('prepStep1');
  };

  // Application Flow Routing
  if (view === 'entry') {
    return (
      <EntryGate 
        onStart={proceedToStep1} 
        onWaitlist={joinWaitlist} 
        onBack={() => {
            window.scrollTo(0, 0);
            setView('landing');
        }}
      />
    );
  }

  if (view === 'step1') {
    return (
      <Step1Eligibility 
        onNext={handleStep1Complete} 
        onBack={() => {
            window.scrollTo(0, 0);
            setView('entry');
        }}
      />
    );
  }

  // Core Track
  if (view === 'step2') {
    return (
      <Step2SkillProof
        onNext={handleStep2Complete}
        onBack={() => setView('step1')}
        skillCategory={applicationData.skillCategory || 'design'} 
      />
    );
  }

  if (view === 'step3') {
    return (
      <Step3Availability
        onBack={() => setView('step2')}
        onSubmit={handleStep3Complete}
      />
    );
  }

  // Prep Track
  if (view === 'prepStep1') {
    return (
      <PrepStep1Context
        onNext={handlePrepStep1Complete}
        onBack={() => {
            if (track === 'prep' && Object.keys(applicationData).length === 0) {
                 setView('entry'); // Came from "Join Waitlist"
            } else {
                 setView('step1'); // Came from Branching
            }
        }}
      />
    );
  }

  if (view === 'prepStep2') {
    return (
      <PrepStep2Skill
        onNext={handlePrepStep2Complete}
        onBack={() => setView('prepStep1')}
      />
    );
  }

  if (view === 'prepStep3') {
    return (
      <PrepStep3Commitment
        onBack={() => setView('prepStep2')}
        onSubmit={handlePrepStep3Complete}
      />
    );
  }

  if (view === 'confirmation') {
    return (
      <SubmissionConfirmation 
        track={track}
        onReturnHome={() => {
          setView('landing');
          setApplicationData({});
          setTrack('core');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Hero onApply={startApplication} onWaitlist={joinWaitlist} />
      <WhoIsThisFor onApply={startApplication} />
      <HowItWorks onApply={startApplication} />
      <WhatWeLookFor onApply={startApplication} onWaitlist={joinWaitlist} />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
