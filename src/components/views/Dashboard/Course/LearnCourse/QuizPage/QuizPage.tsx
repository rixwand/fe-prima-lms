import useDump from "@/hooks/use-dump";
import QuizContent from "./QuizContent";
import QuizResult from "./QuizResult";
import StartQuiz from "./StartQuiz";
import useQuizPage from "./useQuizPage";

export default function QuizPage({ title, id, ...item }: CourseSectionsItem) {
  const {
    additionalData,
    data,
    handleFinishedQuiz,
    handleStartQuiz,
    isLoading,
    isQuizFinished,
    isQuizStarted,
    quizAttempt,
    submitQuizHandler,
    quizResult,
    attemptHistory,
    fetchNextPageAttemptHistory,
    hasNextPageAttemptHistory,
    handleCloseQuizResult,
    handleShowHistoryDetail,
    handleCancelQuiz,
  } = useQuizPage({ title, id, ...item });
  useDump({ attemptHistory });

  if (isLoading) return null;
  if (!data) return <h1 className="w-full text-center">Coming soon...</h1>;

  if (isQuizFinished && quizResult) {
    return <QuizResult onClose={handleCloseQuizResult} {...{ quizResult, quizTitle: title, topics: data.topics }} />;
  }

  if (!isQuizStarted) {
    return (
      <QuizContent
        {...{
          ...data,
          ...additionalData,
          title,
          quizAttemptsHistory: attemptHistory,
          fetchNextPageAttemptHistory,
          hasNextPageAttemptHistory,
          handleShowHistoryDetail,
        }}
        onStart={handleStartQuiz}
      />
    );
  }
  return (
    <StartQuiz
      {...{
        ...quizAttempt?.quizSnapshot.data!,
        ...additionalData,
        title,
        quizStartAt: quizAttempt?.startedAt!,
        handleFinishedQuiz,
        submitQuizHandler,
        handleCancelQuiz,
      }}
    />
  );
}
