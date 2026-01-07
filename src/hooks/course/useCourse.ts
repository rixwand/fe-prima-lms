import { hasTrue } from "@/libs/utils/boolean";
import courseQueries from "@/queries/course-queries";
import courseService from "@/services/course.service";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

const useCourse = (id: number) => {
  const qc = useQueryClient();
  const invalidateCourse = () =>
    qc.invalidateQueries({
      queryKey: courseQueries.keys.getCourse(id),
    });
  const { data: course, isError, isPending, error } = useQuery(courseQueries.options.getCourse(id));
  useQueryError({ isError, error });
  const { mutate: updateCourse, isPending: isPendingUpdate } = useMutation({
    mutationFn: courseService.update,
    onError: e => {
      console.log(e);
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      invalidateCourse();
    },
  });

  const { mutate: updateTags, isPending: isPendingTags } = useMutation({
    mutationFn: courseService.updateTags,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      invalidateCourse();
    },
  });
  const {
    mutate: deleteDiscount,
    isPending: isPendingDeleteDiscount,
    isSuccess: isSuccessDeleteDiscount,
  } = useMutation({
    mutationFn: courseService.deleteDiscount,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success remove discount", color: "success" });
      invalidateCourse();
    },
  });

  const hasPending = hasTrue({
    isPending,
    isPendingUpdate,
    isPendingTags,
    isPendingDeleteDiscount,
  });

  useNProgress(hasPending);
  return {
    hasPending,
    updateCourse,
    course,
    updateTags,
    deleteDiscount,
    isSuccessDeleteDiscount,
  };
};
export default useCourse;
