import { getErrorMessage } from "@/libs/axios/error";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import courseSectionService from "@/services/course-section.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

export default function useEditSection({
  onCreateSectionSuccess = () => {},
  onRemoveSectionSuccess = () => {},
  onReorderSectionSuccess = () => {},
  onRenameSectionSuccess = () => {},
  onRemoveManySectionsSuccess = () => {},
}: {
  onCreateSectionSuccess?: () => void;
  onRemoveSectionSuccess?: () => void;
  onReorderSectionSuccess?: () => void;
  onRenameSectionSuccess?: (variables: { courseId: number; sectionId: number; title: string }) => void;
  onRemoveManySectionsSuccess?: () => void;
}) {
  const { courseId } = useEditCourseContext();
  const qc = useQueryClient();
  const invalidateQueries = () =>
    qc.invalidateQueries({
      queryKey: ["courseSections", courseId],
    });
  const {
    data: querySections,
    refetch,
    isLoading: refetchPending,
    isError,
    error,
  } = useQuery<{ courseTitle: string; sections: CourseSection[] }>({
    queryKey: ["courseSections", courseId],
    queryFn: () =>
      courseSectionService.list(courseId).then(res => {
        return res.data;
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  const { mutate: createSection, isPending: createSectionPendig } = useMutation({
    mutationFn: ({ courseId: id, sections }: { courseId?: number; sections: string[] }) =>
      courseSectionService.create({ courseId: id || courseId, sections }),
    onError: error => {
      addToast({
        title: "Add section Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onCreateSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success create new section" });
      invalidateQueries();
    },
  });

  const { mutate: removeSection, isPending: removeSectionPending } = useMutation({
    mutationFn: courseSectionService.delete,
    onError: error => {
      addToast({
        title: "Remove section Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onRemoveSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success remove section" });
      invalidateQueries();
    },
  });

  const { mutate: reorderSection, isPending: reorderSectionPending } = useMutation({
    mutationFn: courseSectionService.reorder,
    onError: error => {
      addToast({
        title: "Reorder section Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onReorderSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success reorder section" });
      invalidateQueries();
    },
  });

  const { mutate: renameSection, isPending: renameSectionPending } = useMutation({
    mutationFn: courseSectionService.rename,
    onError: error => {
      addToast({
        title: "Rename section Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({}, variable) {
      onRenameSectionSuccess(variable);
      addToast({ color: "success", title: "Success", description: "Success rename section" });
      invalidateQueries();
    },
  });

  const { mutate: removeManySections, isPending: removeManySectionsPending } = useMutation({
    mutationFn: courseSectionService.deleteMany,
    onError: error => {
      addToast({
        title: "Remove sections Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onRemoveManySectionsSuccess();
      addToast({ color: "success", title: "Success", description: "Success remove many sections" });
      invalidateQueries();
    },
  });

  return {
    createSection,
    refetch,
    querySections,
    removeSection,
    reorderSection,
    renameSection,
    removeManySections,
    isPending: {
      createSectionPendig,
      refetchPending,
      removeSectionPending,
      reorderSectionPending,
      renameSectionPending,
      removeManySectionsPending,
    },
  };
}
