import useLearnCourse from "@/hooks/course/useLearnCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import learnQueries from "@/queries/learn-queries";
import { addToast } from "@heroui/react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function useQuizPage({ title, id, ...item }: CourseSectionsItem) {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(learnQueries.options.getQuizContent({ itemId: id, ...item }));
  const {
    data: attemptHistory,
    isLoading: isLoadingGetAttemptHistory,
    isError: isErrorGetAttemptHistory,
    error: errorGetAttemptHistory,
    fetchNextPage: fetchNextPageAttemptHistory,
    hasNextPage: hasNextPageAttemptHistory,
  } = useInfiniteQuery(learnQueries.options.getQuizAttemptHistory({ itemId: id, ...item }));
  const {
    startQuiz,
    submitQuiz,
    isLoading: { isPendingStartQuiz, isPendingSubmitQuiz },
  } = useLearnCourse({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const additionalData = useMemo(() => {
    const estimatedTimeSecond = data?.questions.reduce((acc, curr) => acc + curr.estimatedTimesSecond, 0) ?? 0;
    return {
      estimatedTimeMinutes: estimatedTimeSecond > 0 ? Math.ceil(estimatedTimeSecond / 60) : 0,
      totalPoints: data?.questions.reduce((acc, curr) => acc + curr.points, 0) ?? 0,
      estimatedTimeSecond,
    };
  }, [data]);
  const handleStartQuiz = async () => {
    const quizAttemptData = await startQuiz({ itemId: id, ...item });
    if (quizAttemptData) {
      setQuizAttempt(quizAttemptData);
      setIsQuizStarted(true);
    }
  };

  const submitQuizHandler = async (form: QuizSubmissionForm, showResult: boolean = true) => {
    if (!quizAttempt) {
      addToast({ title: "Error", description: "Invalid Quiz", color: "danger" });
      return;
    }
    const quizResult = await submitQuiz({ ids: { itemId: id, attemptId: quizAttempt?.id, ...item }, form });
    console.log("quiz result: ", quizResult);
    if (quizResult) setQuizResult(quizResult);
    if (showResult) setIsQuizFinished(true);
  };

  const handleFinishedQuiz = () => {
    console.log("on finished quiz result ", quizResult);
    if (quizResult) return setIsQuizFinished(true);
    else setIsQuizStarted(false);
    addToast({ title: "Error", description: "Get Quiz Result errror", color: "danger" });
  };

  const handleCloseQuizResult = () => {
    setQuizResult(null);
    setIsQuizStarted(false);
    setIsQuizFinished(false);
  };

  const handleShowHistoryDetail = async (attemptId: number) => {
    const res = await qc.fetchQuery(
      learnQueries.options.getQuizAttemptHistoryDetail({ attemptId, itemId: id, ...item }),
    );
    // console.log(res.data);
    setQuizResult(res.data);
    setIsQuizFinished(true);
  };

  const handleCancelQuiz = (resetTimer: () => void) => {
    setIsQuizStarted(false);
  };

  useQueryError({ isError: isError ?? isErrorGetAttemptHistory, error: error ?? errorGetAttemptHistory });
  useNProgress(isLoadingGetAttemptHistory || isLoading || isPendingStartQuiz || isPendingSubmitQuiz);

  return {
    data,
    attemptHistory: attemptHistory?.pages.flatMap(page => page.attempts) ?? [],
    isLoading,
    isQuizStarted,
    isQuizFinished,
    handleFinishedQuiz,
    handleStartQuiz,
    additionalData,
    quizAttempt,
    submitQuizHandler,
    quizResult,
    fetchNextPageAttemptHistory,
    hasNextPageAttemptHistory,
    handleCloseQuizResult,
    handleShowHistoryDetail,
    handleCancelQuiz,
  };
}
