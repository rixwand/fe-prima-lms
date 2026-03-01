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
  return {
    completeLesson,
    isLoading: {
      isPendingCompleteLesson,
    },
  };
};
export default useLearnCourse;
