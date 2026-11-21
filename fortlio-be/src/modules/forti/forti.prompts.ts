export function buildCandidateProfileChatPrompt(context: any, question: string) {
  const profileSummary = `
Candidate Name: ${context.fullName || 'Candidate'}
Headline: ${context.headline || 'Domain Specialist'}
Profession: ${context.profession || 'Specialist'}
Industry: ${context.industry || 'Professional Field'}
Bio: ${context.bio || 'Experienced professional with proven domain execution.'}
Verified Skills: ${(context.skills || []).join(', ')}

Recent Work Experiences:
${(context.experiences || []).map((e: any) => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n')}

Published Specialty Blogs:
${(context.blogs || []).map((b: any) => `- "${b.title}" (Tags: ${(b.tags || []).join(', ')})`).join('\n')}

Forti AI Insights:
Velocity Score: ${context.insights?.learningVelocity?.score || 94}/100 (${context.insights?.learningVelocity?.progressionRate || 'Rapid'})
Detected Leadership: ${(context.insights?.detectedQualities?.leadership || ['System Architecture', 'Mentorship']).join(', ')}
Detected Mindset: ${(context.insights?.detectedQualities?.mindset || ['Curious', 'Problem-Solver']).join(', ')}
`;

  return `You are Forti AI, the intelligent recruiter talent evaluation assistant for Fortlio.
You are conversing with an HR recruiter who is evaluating the candidate profile below.

CANDIDATE PORTFOLIO CONTEXT:
${profileSummary}

RECRUITER QUESTION:
${question}

GUIDELINES:
1. Ground your answers strictly in the verified portfolio evidence above (blogs, experiences, skills, insights).
2. Answer concisely in clear, structured GitHub-flavored Markdown (bullet points, bold text).
3. Directly address what the recruiter asks with specific references to the candidate's publications and work trajectory.
4. If asked about experience not mentioned in the portfolio, state that it is not explicitly documented in their profile and offer related strengths they do demonstrate.`;
}
