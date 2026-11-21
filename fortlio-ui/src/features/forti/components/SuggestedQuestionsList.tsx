import { MessageSquareText } from 'lucide-react';

interface SuggestedQuestionsListProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const DEFAULT_QUESTIONS = [
  'Summarize their systems architecture experience',
  'What technical depth do their published blogs show?',
  'What leadership and soft qualities are verified?',
  'How does Forti evaluate their learning trajectory?',
];

export function SuggestedQuestionsList({
  onSelectQuestion,
  disabled,
}: SuggestedQuestionsListProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <MessageSquareText className="size-3" />
        <span>Suggested Recruiter Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuestion(q)}
            className="text-left text-[11px] bg-muted/60 hover:bg-muted hover:border-primary/40 border border-border/60 text-muted-foreground hover:text-foreground rounded-lg py-1 px-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
