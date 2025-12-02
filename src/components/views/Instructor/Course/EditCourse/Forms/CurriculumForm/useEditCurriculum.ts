import courseSectionService from "@/services/course-section.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function useEditCurriculum({
  onCreateSectionSuccess = () => {},
  onRemoveSectionSuccess = () => {},
  onReorderSectionSuccess = () => {},
  onRenameSectionSuccess = () => {},
  courseId,
}: {
  courseId: number;
  onCreateSectionSuccess?: () => void;
  onRemoveSectionSuccess?: () => void;
  onReorderSectionSuccess?: () => void;
  onRenameSectionSuccess?: () => void;
}) {
  const {
    data: querySections,
    refetch,
    isLoading: refetchPending,
  } = useQuery<{ courseTitle: string; sections: CourseSection[] }>({
    queryKey: ["courseSections", courseId],
    queryFn: () =>
      courseSectionService.list(courseId).then(res => {
        return res.data;
      }),
    enabled: false,
  });

  const { mutate: createSection, isPending: createSectionPendig } = useMutation({
    mutationFn: courseSectionService.create,
    onError(error) {
      const axiosErr = error as AppAxiosError;
      console.log(axiosErr.response?.data);
      addToast({ color: "danger", title: "Add section Error", description: error.message });
    },
    onSuccess() {
      onCreateSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success create new section" });
      refetch();
    },
  });

  const { mutate: removeSection, isPending: removeSectionPending } = useMutation({
    mutationFn: courseSectionService.delete,
    onError(error) {
      const axiosErr = error as AppAxiosError;
      console.log(axiosErr.response?.data);
      addToast({ color: "danger", title: "Remove section Error", description: error.message });
    },
    onSuccess() {
      onRemoveSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success remove section" });
      refetch();
    },
  });

  const { mutate: reorderSection, isPending: reorderSectionPending } = useMutation({
    mutationFn: courseSectionService.reorder,
    onError(error) {
      const axiosErr = error as AppAxiosError;
      console.log(axiosErr.response?.data);
      addToast({ color: "danger", title: "Reorder section Error", description: error.message });
    },
    onSuccess() {
      onReorderSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success reorder section" });
      refetch();
    },
  });

  const { mutate: renameSection, isPending: renameSectionPending } = useMutation({
    mutationFn: courseSectionService.rename,
    onError(error) {
      const axiosErr = error as AppAxiosError;
      console.log(axiosErr.response?.data);
      addToast({ color: "danger", title: "Rename section Error", description: error.message });
    },
    onSuccess() {
      onRenameSectionSuccess();
      addToast({ color: "success", title: "Success", description: "Success rename section" });
      refetch();
    },
  });

  return {
    createSection,
    refetch,
    querySections,
    removeSection,
    reorderSection,
    renameSection,
    isPending: {
      createSectionPendig,
      refetchPending,
      removeSectionPending,
      reorderSectionPending,
      renameSectionPending,
    },
  };
}
