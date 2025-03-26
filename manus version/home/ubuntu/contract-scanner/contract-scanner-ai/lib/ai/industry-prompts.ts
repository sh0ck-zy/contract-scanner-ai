// lib/ai/industry-prompts.ts

interface IndustryPrompt {
  focusAreas: string;
  commonIssues: string;
  regionSpecific?: Record<string, string>;
}

const industryPrompts: Record<string, IndustryPrompt> = {
  "web_development": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Ownership of code and intellectual property rights
      3. Vague project scope that enables scope creep
      4. Payment terms longer than 15 days or with unclear milestones
      5. Hosting and maintenance responsibilities
      6. Warranty periods and liability for bugs/issues
      7. Browser/device compatibility requirements
    `,
    commonIssues: `
      Common issues in web development contracts:
      - Unclear definition of "project completion"
      - Missing provisions for third-party integrations
      - Ambiguous acceptance testing procedures
      - Lack of clear change request process
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for GDPR compliance requirements and data processing clauses"
    }
  },
  "graphic_design": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Full copyright transfer without adequate compensation
      3. Vague deliverable descriptions
      4. Usage rights limitations
      5. Client's ability to reject work subjectively
      6. Requirements to provide source files without additional payment
      7. Lack of kill fee or cancellation terms
    `,
    commonIssues: `
      Common issues in graphic design contracts:
      - Unclear ownership of unused concepts
      - Missing provisions for additional usage rights
      - Ambiguous approval processes
      - Lack of clear revision limits
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for moral rights provisions and copyright assignment limitations"
    }
  },
  "content_creation": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Work-for-hire clauses without adequate compensation
      2. Byline and credit requirements
      3. Exclusivity clauses
      4. Reuse and republication rights
      5. Indemnification for factual accuracy
      6. Editing and revision expectations
      7. Kill fees and cancellation terms
    `,
    commonIssues: `
      Common issues in content creation contracts:
      - Unclear ownership of research materials
      - Missing provisions for additional usage
      - Ambiguous word count requirements
      - Lack of clear revision limits
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for moral rights provisions and right to be identified as author"
    }
  },
  "general": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Full copyright transfer without adequate compensation
      3. Vague deliverable descriptions that enable scope creep
      4. Payment terms longer than 30 days or with unclear milestones
      5. Overly restrictive non-compete clauses
      6. Client ability to terminate without compensation
      7. Indemnification clauses that create unreasonable liability
    `,
    commonIssues: `
      Common issues in freelance contracts:
      - Unclear intellectual property rights
      - Missing provisions for additional work
      - Ambiguous completion criteria
      - Lack of clear payment terms
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for compliance with EU freelancer protection regulations"
    }
  }
};

export function getIndustrySpecificPrompt(industry: string, region: string = "US"): string {
  const industryKey = industry in industryPrompts ? industry : "general";
  const prompt = industryPrompts[industryKey];
  
  let fullPrompt = prompt.focusAreas + "\n\n" + prompt.commonIssues;
  
  if (prompt.regionSpecific && prompt.regionSpecific[region]) {
    fullPrompt += "\n\n" + prompt.regionSpecific[region];
  }
  
  return fullPrompt;
}
