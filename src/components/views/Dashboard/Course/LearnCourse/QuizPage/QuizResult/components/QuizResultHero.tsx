import cn from "@/libs/utils/cn";
import { Card, CardBody, CircularProgress } from "@heroui/react";
import { GoChecklist } from "react-icons/go";
import { LuClipboardX } from "react-icons/lu";

type QuizResultHeroProps = {
  percentage: number;
  score: number;
  totalPoints: number;

  passed: boolean;

  quizTitle: string;
  quizDescription?: string;

  passingScorePercent: number;
};

export default function QuizResultHero({
  percentage,
  score,
  totalPoints,
  passed,
  quizTitle,
  quizDescription,
  passingScorePercent,
}: QuizResultHeroProps) {
  return (
    <Card
      shadow="sm"
      className={cn(
        passed ? "border-success-200 bg-success-50/40" : "border-danger-200 bg-danger-50/40",
        "relative overflow-hidden border ",
      )}>
      <CardBody className="relative">
        <div className="grid @lg:grid-cols-12 max-w-xl @lg:items-center py-3 gap-y-4">
          <div className="flex justify-center @lg:col-span-5">
            <div className="flex flex-col items-center gap-y-4">
              <CircularProgress
                value={percentage}
                showValueLabel
                classNames={{
                  svg: "w-44 h-44 drop-shadow-md",
                  indicator: cn(passed ? "stroke-success" : "stroke-danger", "stroke-[2.5]"),
                  track: cn(passed ? "stroke-success-200/30" : "stroke-danger-200/30", "stroke-[2.5]"),
                  value: "text-3xl font-semibold text-slate-700",
                }}
              />
              <p className="text-sm font-medium text-slate-500">
                {score} / {totalPoints} Poin
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center text-center @lg:col-span-7">
            <div
              className={cn(
                "mb-3 flex p-5 items-center justify-center rounded-full border-2  bg-white",
                passed ? "border-success-300" : "border-danger-300",
              )}>
              {passed ? (
                <GoChecklist className="text-success text-2xl @xl:text-[28px]" />
              ) : (
                <LuClipboardX className="text-danger text-2xl @xl:text-[28px]" />
              )}
            </div>
            <h1 className={cn("text-2xl font-bold tracking-tight", passed ? "text-success" : "text-danger")}>
              {passed ? "PASSED!" : "FAILED"}
            </h1>
            <h2 className="mt-3 text-xl font-semibold">{quizTitle}</h2>
            {quizDescription && <p className="mt-3 max-w-xl text-lg text-default-500">{quizDescription}</p>}
            <div className="mt-8 flex divide-x divide-default-200 rounded-xl">
              <div className="px-12 text-center">
                <p className="text-default-500">Passing Score</p>

                <p className="mt-2 text-xl font-bold">{passingScorePercent}%</p>
              </div>

              <div className="px-12 text-center">
                <p className="text-default-500">Total Points</p>

                <p className="mt-2 text-xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
