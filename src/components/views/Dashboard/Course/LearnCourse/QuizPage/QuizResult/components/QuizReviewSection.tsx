import QuestionReviewCard from "./QuestionReviewCard";

export interface QuestionReview {
  id: number;
  question: string;
  points: number;
  earnedPoints: number;
  multipleAnswer: boolean;
  explanation?: string;

  options: {
    id: number;
    text: string;
    selected: boolean;
    correct: boolean;
  }[];
}
interface Props {
  questions: QuestionReview[];
  currentQuestion: number;
  onSelectQuestion: (index: number) => void;
}

export default function QuizReviewSection({ questions, currentQuestion, onSelectQuestion }: Props) {
  const question = questions[currentQuestion];

  return (
    <div className="flex gap-3">
      {/* <QuestionReviewNav questions={questions} currentQuestion={currentQuestion} onSelectQuestion={onSelectQuestion} /> */}

      <div className="flex flex-col gap-y-3 w-full">
        {questions.map((q, idx) => (
          <div className="flex-1">
            <QuestionReviewCard idx={idx} question={q} />
          </div>
        ))}
      </div>
    </div>
  );
}
