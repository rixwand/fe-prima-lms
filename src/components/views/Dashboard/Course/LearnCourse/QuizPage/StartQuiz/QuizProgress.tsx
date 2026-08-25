import { CircularProgress } from "@heroui/react";
import { memo, useEffect } from "react";

const QuizProgress = memo(function QuizProgress({
  answeredCount,
  totalQuestions,
}: {
  answeredCount: number;
  totalQuestions: number;
}) {
  const progress = totalQuestions === 0 ? 0 : (answeredCount / totalQuestions) * 100;
  useEffect(() => {
    console.log("QuizProgress mounted");

    return () => console.log("QuizProgress unmounted");
  }, []);
  return (
    <div className="w-full flex flex-col items-center gap-y-4">
      <CircularProgress
        value={progress}
        showValueLabel
        classNames={{
          svg: "w-32 h-32 drop-shadow-md",
          indicator: "stroke-primary",
          track: "stroke-primary-200/30",
          value: "text-2xl font-semibold text-slate-700",
        }}
      />
      <p className="text-sm font-medium text-slate-500">
        {answeredCount} / {totalQuestions} Soal Dijawab
      </p>
    </div>
  );
});

export default QuizProgress;
