import { cn } from "@heroui/react";

const QuizNavigator = ({
  handleSetCurrentQuestion,
  isAnswered,
  questions,
  currentQuestionIdx,
}: {
  questions: PublishedQuizQuestion[];
  handleSetCurrentQuestion: (id: number) => void;
  isAnswered: (id: number) => boolean;
  currentQuestionIdx: number;
}) => (
  <div className="grid grid-cols-5 gap-2.5 mb-5">
    {questions.map(({ id }, idx) => (
      <span
        onClick={() => handleSetCurrentQuestion(id)}
        className={cn(
          "w-12 h-12 font-medium rounded-md flex justify-center items-center border cursor-pointer ",
          currentQuestionIdx == idx
            ? "bg-primary border-primary text-white hover:bg-primary-600"
            : isAnswered(id)
              ? "border-success bg-success text-white hover:bg-success-600"
              : "border-slate-300 hover:bg-blue-50 hover:border-blue-200",
        )}>
        {idx + 1}
      </span>
    ))}
  </div>
);

export default QuizNavigator;
