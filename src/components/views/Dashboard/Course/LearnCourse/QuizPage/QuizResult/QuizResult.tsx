import { intoLocalTimeWithTz } from "@/libs/utils/moment";
import { Button } from "@heroui/react";
import { useState } from "react";
import { LuX } from "react-icons/lu";
import QuizTopicsCovered from "../QuizTopicsCovered";
import QuizAttemptSummary from "./components/QuizAttemptSummary";
import QuizResultHero from "./components/QuizResultHero";
import QuizReviewSection, { QuestionReview } from "./components/QuizReviewSection";

export default function ({
  quizResult,
  quizTitle,
  topics,
  onClose,
}: {
  quizResult: QuizResult;
  quizTitle: string;
  topics: string[];
  onClose: () => void;
}) {
  const [currentQuestionIdx, setCurrentQuestionIndex] = useState(0);
  const {
    passed,
    percentage,
    score,
    totalPoints,
    attemptNumber,
    startedAt,
    submittedAt,
    timeSpentSecond,
    status,
    quizSnapshot: {
      data: { passingScorePercent },
      data,
    },
    userAnswers,
  } = quizResult;
  return (
    <div className="w-full flex justify-center pb-20 gap-3 relative flex-wrap">
      {/* <Code className="whitespace-pre-wrap">{JSON.stringify(quizResult, null, 2)}</Code> */}
      <div className="flex-col flex gap-y-5 bg-white p-6 rounded-2xl shadow-sm">
        <QuizResultHero
          {...{
            passed,
            passingScorePercent,
            percentage,
            score,
            totalPoints,
            quizTitle,
          }}
        />
        <QuizReviewSection
          currentQuestion={currentQuestionIdx}
          onSelectQuestion={setCurrentQuestionIndex}
          questions={getQuestionReviews(quizResult)}
        />
      </div>
      <div className="sticky top-20 flex h-fit flex-col gap-y-3 self-start">
        <QuizAttemptSummary
          {...{
            attemptNumber,
            startedAt: intoLocalTimeWithTz(new Date(startedAt)),
            submittedAt: intoLocalTimeWithTz(new Date(submittedAt)),
            percentage,
            score,
            passed,
            totalPoints,
            timeSpentSecond,
            status,
          }}
        />
        <div className="bg-white shadow-xs rounded-xl p-5 w-sm h-fit">
          <QuizTopicsCovered topics={topics} />
        </div>
      </div>
      <Button
        onPress={onClose}
        className="reset-button p-1.5 @6xl:sticky @6xl:top-20 absolute right-0 @3xl:right-10"
        variant="light"
        radius="full"
        isIconOnly
        size="lg">
        <LuX size={24} className="text-slate-400" />
      </Button>
    </div>
  );
}

export function getQuestionReviews(quizResult: QuizResult): QuestionReview[] {
  const answerMap = new Map(quizResult.userAnswers.map(answer => [answer.snapshotQuestionId, answer]));

  return quizResult.quizSnapshot.data.questions
    .sort((a, b) => a.position - b.position)
    .map(question => {
      const answer = answerMap.get(question.id);

      return {
        id: question.id,
        question: question.question,
        points: question.points,
        earnedPoints: answer?.earnedPoints ?? 0,
        multipleAnswer: question.multipleAnswer,
        // fill this later if you add explanation
        explanation: undefined,

        options: question.options
          .sort((a, b) => a.position - b.position)
          .map(option => ({
            id: option.id,
            text: option.value,
            selected: answer?.selectedOptionIds.includes(option.id) ?? false,
            correct: answer?.correctOptionIds.includes(option.id) ?? false,
          })),
      };
    });
}
