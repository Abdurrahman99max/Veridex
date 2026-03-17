// Demo Data Seeder for Veridex
// Run this once to populate your backend with test data

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-45707f2b`;

const demoApplicants = [
  {
    fullName: "Sarah Chen",
    email: "sarah.chen@stanford.edu",
    university: "Stanford University",
    track: "core",
    rationale: "Built a machine learning model that predicts student outcomes with 92% accuracy",
    skillCategory: "Machine Learning",
    proofUrl: "https://github.com/sarachen/ml-predictor",
    gradYear: "2026",
    tags: ["AI/ML", "Python", "Research"],
    projectContext: "Developed as part of CS229 final project, now being used by academic advisors",
    motivation: "Want to help other students leverage technology for better educational outcomes"
  },
  {
    fullName: "Marcus Johnson",
    email: "mjohnson@mit.edu",
    university: "MIT",
    track: "core",
    rationale: "Created an open-source robotics framework used by 500+ universities",
    skillCategory: "Robotics",
    proofUrl: "https://github.com/marcusj/robo-framework",
    gradYear: "2025",
    tags: ["Robotics", "C++", "Open Source"],
    projectContext: "Started during IAP, grew into a community of 2000+ contributors",
    motivation: "Passionate about making robotics accessible to all students"
  },
  {
    fullName: "Priya Patel",
    email: "priya.p@berkeley.edu",
    university: "UC Berkeley",
    track: "prep",
    rationale: "Learning web development through CS50 and freeCodeCamp",
    skillCategory: "Web Development",
    proofUrl: "https://github.com/priyap/portfolio",
    gradYear: "2027",
    tags: ["HTML/CSS", "JavaScript", "Learning"],
    skillLevel: "beginner",
    learningMethods: ["online_courses", "documentation"],
    weeklyHours: "10-15",
    primaryGoal: "career_readiness"
  },
  {
    fullName: "Alex Rivera",
    email: "alex.rivera@caltech.edu",
    university: "Caltech",
    track: "core",
    rationale: "Published research on quantum computing algorithms in Nature Physics",
    skillCategory: "Quantum Computing",
    proofUrl: "https://doi.org/10.1038/example",
    gradYear: "2025",
    tags: ["Quantum", "Physics", "Research"],
    projectContext: "Working in Prof. Johnson's lab on topological quantum error correction",
    motivation: "Advancing the field of quantum information science"
  },
  {
    fullName: "Emma Williams",
    email: "emma.w@cornell.edu",
    university: "Cornell University",
    track: "prep",
    rationale: "Building mobile apps to learn iOS development",
    skillCategory: "Mobile Development",
    proofUrl: "https://github.com/emmaw/ios-apps",
    gradYear: "2028",
    tags: ["Swift", "iOS", "Mobile"],
    skillLevel: "intermediate",
    learningMethods: ["online_courses", "personal_projects"],
    weeklyHours: "5-10",
    primaryGoal: "skill_mastery"
  }
];

export async function seedDemoData() {
  console.log('🌱 Starting demo data seed...');
  
  try {
    const results = [];
    
    for (const applicant of demoApplicants) {
      console.log(`📝 Submitting: ${applicant.fullName}`);
      
      const response = await fetch(`${API_BASE}/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(applicant)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Created: ${applicant.fullName} (${result.id})`);
        results.push({ name: applicant.fullName, id: result.id });
      } else {
        console.log(`⚠️  Skipped: ${applicant.fullName} (${result.duplicate ? 'already exists' : 'error'})`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n✨ Demo data seeding complete!');
    console.log(`📊 Created ${results.length} applicants`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

// Export for direct use
export { demoApplicants };
