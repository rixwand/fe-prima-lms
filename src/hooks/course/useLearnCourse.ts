import { getErrorMessage } from "@/libs/axios/error";
import { voidFn } from "@/libs/utils/function";
import learnService from "@/services/learn.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

const useLearnCourse = ({ onLessonComplete = voidFn }: { onLessonComplete?: VoidFn }) => {
  const { mutate: completeLesson, isPending: isPendingCompleteLesson } = useMutation({
    mutationFn: learnService.lessonComplete,
    onError(error) {
      addToast({
        title: "Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onLessonComplete();
    },
  });

  const { mutateAsync: startQuiz, isPending: isPendingStartQuiz } = useMutation({
    mutationFn: (props: { slug: string; sectionId: number; itemId: number }) =>
      learnService.startQuiz(props).then(res => res.data),
    onError(error) {
      addToast({
        title: "Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
  });

  const { mutateAsync: submitQuiz, isPending: isPendingSubmitQuiz } = useMutation({
    mutationFn: ({
      ids,
      form,
    }: {
      ids: { attemptId: number; slug: string; sectionId: number; itemId: number };
      form: QuizSubmissionForm;
    }) => learnService.submitQuiz({ ids, answers: form.answers }).then(res => res.data),
    onError(error) {
      addToast({
        title: "Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
  });

  return {
    completeLesson,
    startQuiz,
    submitQuiz,
    isLoading: {
      isPendingCompleteLesson,
      isPendingStartQuiz,
      isPendingSubmitQuiz,
    },
  };
};
export default useLearnCourse;
