import type { InterviewType, TargetLevel } from './interview.interface';

export function getInitialQuestionPrompt(
  profession: string,
  specialty: string,
  targetLevel: TargetLevel,
  interviewType: InterviewType,
): string {
  return `You are an elite, highly experienced interviewer conducting a ${interviewType.replace('_', ' ')} evaluation for a ${targetLevel}-level candidate in the domain of "${profession}", specializing in "${specialty}".

Your objective is to assess the candidate's authentic depth, technical rigor, and problem-solving methodology.

Please provide a realistic, challenging, and domain-appropriate opening scenario or question. The question should not be a superficial trivia check; it must test practical judgment, trade-offs, edge-case mitigation, and architectural or clinical/operational reasoning.

Respond ONLY with the question/scenario text itself, without introductory greetings or sign-offs.`;
}

export function getFollowUpQuestionPrompt(
  profession: string,
  specialty: string,
  targetLevel: TargetLevel,
  transcript: Array<{ questionText: string; answerText?: string }>,
): string {
  const formattedHistory = transcript
    .map((turn, i) => `Turn ${i + 1}:\nQuestion: ${turn.questionText}\nCandidate Answer: ${turn.answerText || 'No answer'}`)
    .join('\n\n');

  return `You are an expert interviewer evaluating a ${targetLevel}-level professional in "${profession}" (${specialty}).

Here is the conversation so far:
${formattedHistory}

Based strictly on the candidate's last answer, formulate a incisive, probing follow-up question. Challenge an assumption, probe a specific trade-off or failure mode they mentioned (or missed), or test their reasoning when conditions change (e.g., scale increases by 100x, budget is halved, contradictory symptoms or precedents emerge).

Respond ONLY with the follow-up question text itself.`;
}

export function getEvaluationPrompt(
  profession: string,
  specialty: string,
  targetLevel: TargetLevel,
  transcript: Array<{ questionText: string; answerText?: string }>,
): string {
  const formattedHistory = transcript
    .map((turn, i) => `Question ${i + 1}: ${turn.questionText}\nCandidate Answer: ${turn.answerText || 'No answer'}`)
    .join('\n\n');

  return `You are an objective hiring committee evaluation panel grading an interview transcript for a ${targetLevel}-level role in "${profession}" (${specialty}).

Transcript:
${formattedHistory}

Evaluate the candidate across 4 dimensions (scores strictly 1 to 100):
1. domainDepth: Technical / discipline-specific depth and authenticity.
2. problemSolving: Logical structuring, trade-off analysis, edge-case anticipation.
3. communication: Clarity, precision, conciseness.
4. leadership: Decisiveness, composure, strategic awareness.

Compute an overallScore (weighted average: 40% domainDepth, 30% problemSolving, 15% communication, 15% leadership).
Assign readinessBadge:
- overallScore >= 90: "Expert / Lead"
- overallScore >= 75: "Advanced"
- overallScore >= 60: "Proficient"
- otherwise: "Emerging"

Provide 2-3 specific strengths, 2-3 actionable improvements, and a concise 2-sentence summary.

Return ONLY a valid JSON object matching this schema:
{
  "overallScore": number,
  "domainDepth": number,
  "problemSolving": number,
  "communication": number,
  "leadership": number,
  "strengths": string[],
  "improvements": string[],
  "summary": string,
  "readinessBadge": "Emerging" | "Proficient" | "Advanced" | "Expert / Lead"
}`;
}
