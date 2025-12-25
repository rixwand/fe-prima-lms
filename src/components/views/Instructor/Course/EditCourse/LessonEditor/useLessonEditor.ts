import { getErrorMessage } from "@/libs/axios/error";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { voidFn } from "@/libs/utils/function";
import courseLessonBlockServices from "@/services/course-lesson-block.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

export default function useLessonEditor({ onCreateBlockSuccess = voidFn }: { onCreateBlockSuccess?: VoidFn }) {
  const { ids } = useLessonEditorContext();

  const { refetch, data: queryBlocks, isLoading, isError, error } = useQueryBlocks(ids);

  useEffect(() => {
    if (isError && error)
      addToast({
        title: "Get lesson block error",
        color: "danger",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  const { mutate: createBlock, isPending: createBlockPending } = useMutation({
    mutationFn: (data: BlockData) => courseLessonBlockServices.create({ data, ...ids }),
    onError: error => {
      addToast({
        title: "Add block Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onCreateBlockSuccess();
      addToast({ color: "success", title: "Success", description: "Success create new lesson block" });
      refetch();
    },
  });

  const { mutate: updateBlock, isPending: updateBlockPending } = useMutation({
    mutationFn: (props: { blockId: number; payload: AtLeastOne<BlockData> }) =>
      courseLessonBlockServices.update({ ...props, ...ids }),
    onError: error => {
      addToast({
        title: "Update block Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      onCreateBlockSuccess();
      addToast({ color: "success", title: "Success", description: "Success update lesson block" });
      refetch();
    },
  });

  return {
    isLoading: {
      isLoading,
      createBlockPending,
      updateBlockPending,
    },
    refetch,
    queryBlocks,
    createBlock,
    updateBlock,
  };
}

export const useQueryBlocks = (ids: { courseId: number; sectionId: number; lessonId: number } | undefined) =>
  useQuery<LessonBlockItem[]>({
    queryKey: ["BlockData", ids],
    queryFn: () =>
      courseLessonBlockServices
        .get(ids!)
        .then(res => res.data)
        .catch(err => {
          if (isAxiosError(err) && err.status == 404) return [];
          throw new Error(err.message);
        }),
    placeholderData: keepPreviousData,
    enabled: !!ids,
  });
