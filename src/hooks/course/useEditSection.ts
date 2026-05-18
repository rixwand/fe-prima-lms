import { getErrorMessage, getUnknownErrorMessage } from "@/libs/axios/error";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import courseQueries from "@/queries/course-queries";
import courseSectionService from "@/services/course-section.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useEditSection({
  onCreateSectionSuccess = () => {},
  onRemoveSectionSuccess = () => {},
  onReorderSectionSuccess = () => {},
  onRenameSectionSuccess = () => {},
  onRemoveManySectionsSuccess = () => {},
  immediatlyFetch = false,
}: {
  onCreateSectionSuccess?: () => void;
  onRemoveSectionSuccess?: () => void;
  onReorderSectionSuccess?: () => void;
  onRenameSectionSuccess?: (variables: { courseId: number; sectionId: number; title: string }) => void;
  onRemoveManySectionsSuccess?: () => void;
  immediatlyFetch?: boolean;
}) {
  const { courseId } = useEditCourseContext();
  const qc = useQueryClient();
  const invalidateQueries = () => {
    qc.invalidateQueries({
      queryKey: courseQueries.keys.listSections(courseId),
    });
    qc.invalidateQueries({
      queryKey: courseQueries.keys.getCourse(courseId),
    });
  };
  const {
    data: querySections,
    refetch,
    isLoading: refetchPending,
    isError,
    error,
  } = useQuery({ ...courseQueries.options.listSections(courseId), enabled: immediatlyFetch });

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: getUnknownErrorMessage(error),
      });
  }, [isError, error]);

  const { mutate: createSection, mutateAsync: createSectionAsync, isPending: createSectionPendig } = useMutation({
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

  const { mutate: removeSection, mutateAsync: removeSectionAsync, isPending: removeSectionPending } = useMutation({
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

  const { mutate: reorderSection, mutateAsync: reorderSectionAsync, isPending: reorderSectionPending } = useMutation({
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

  const { mutate: renameSection, mutateAsync: renameSectionAsync, isPending: renameSectionPending } = useMutation({
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

  const {
    mutate: removeManySections,
    mutateAsync: removeManySectionsAsync,
    isPending: removeManySectionsPending,
  } = useMutation({
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
    createSectionAsync,
    refetch,
    querySections,
    removeSection,
    removeSectionAsync,
    reorderSection,
    reorderSectionAsync,
    renameSection,
    renameSectionAsync,
    removeManySections,
    removeManySectionsAsync,
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
