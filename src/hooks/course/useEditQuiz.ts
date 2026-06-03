import { IUpdateQuiz } from "@/components/views/Instructor/Course/EditCourse/QuizEditor/QuizEditor.types";
import { getErrorMessage } from "@/libs/axios/error";
import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import courseQuizService from "@/services/course-quiz.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

type Props = {
  idsPath: Ids & { itemId: number };
};
const useEditQuiz = ({ idsPath }: Props) => {
  const qc = useQueryClient();
  const {
    data: quizContent,
    isError,
    isLoading,
    isFetching,
    error,
  } = useQuery(courseQueries.options.getQuizContent(idsPath));
  useQueryError({ isError, error });

  const { mutate: updateQuiz, isPending: isPendingUpdateQuiz } = useMutation({
    mutationFn: (quiz: IUpdateQuiz) => courseQuizService.update({ ...idsPath, quiz }),
    onError: error => {
      addToast({
        title: "Update Quiz Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      addToast({ color: "success", title: "Success", description: "Success update Quiz" });
      qc.invalidateQueries({ queryKey: courseQueries.keys.getQuizContent(idsPath) });
    },
  });

  const { mutate: publishQuiz, isPending: isPendingPublisQuiz } = useMutation({
    mutationFn: (quiz?: IUpdateQuiz | undefined) => courseQuizService.publish({ ...idsPath, quiz }),
    onError: error => {
      addToast({
        title: "Publish Quiz Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({ data }) {
      addToast({
        color: "success",
        title: "Success",
        description: data.message ?? "Success publish draft content lessons",
      });
      qc.invalidateQueries({ queryKey: courseQueries.keys.getQuizContent(idsPath) });
    },
  });

  const { mutate: deleteQuestion, isPending: isPendingDeleteQuestion } = useMutation({
    mutationFn: (questionId: number) => courseQuizService.deleteQuestion({ ...idsPath, questionId }),
    onError: error => {
      addToast({
        title: "Remove Question Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({ data }) {
      addToast({
        color: "success",
        title: "Success",
        description: data.message ?? "Success remove 1 question",
      });
      qc.invalidateQueries({ queryKey: courseQueries.keys.getQuizContent(idsPath) });
    },
  });

  const { mutate: deleteManyQuestion, isPending: isPendingDeleteManyQuestion } = useMutation({
    mutationFn: (questionIds: number[]) => courseQuizService.deleteManyQuestion({ ...idsPath, questionIds }),
    onError: error => {
      addToast({
        title: "Remove Question Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({ data }) {
      addToast({
        color: "success",
        title: "Success",
        description: data.message ?? "Success remove batch question",
      });
      qc.invalidateQueries({ queryKey: courseQueries.keys.getQuizContent(idsPath) });
    },
  });

  const pending = {
    isPendingUpdateQuiz,
    isPendingPublisQuiz,
    isPendingDeleteQuestion,
    isPendingDeleteManyQuestion,
    isLoading,
    isFetching,
  };

  useNProgress(hasTrue(pending));

  return {
    updateQuiz,
    quizContent,
    publishQuiz,
    deleteQuestion,
    deleteManyQuestion,
  };
};

export default useEditQuiz;
