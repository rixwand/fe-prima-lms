import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { getErrorMessage } from "@/libs/axios/error";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { hasTrue } from "@/libs/utils/boolean";
import forumQueries from "@/queries/forum-queries";
import courseForumService from "@/services/course-forum.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateThreadPayload } from "../../components/views/Forum/forum.type";

const useEditForum = () => {
  const { ids } = useLessonEditorContext();
  const qc = useQueryClient();
  const { data: forumThreads, isError, error, isFetching } = useQuery(forumQueries.options.getForumThreads(ids!));
  useQueryError({ isError, error });

  const { mutate: createNewThread, isPending: isPendingCreateNewThread } = useMutation({
    mutationFn: (payload: CreateThreadPayload) => courseForumService.createThread({ payload, ...ids! }),
    onError: error => {
      addToast({
        title: "Create New Thread Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      addToast({ color: "success", title: "Success", description: "New Thread Created" });
      qc.invalidateQueries({ queryKey: forumQueries.keys.getForumThreads(ids!) });
    },
  });

  const { mutate: releaseForum, isPending: isPendingReleaseForum } = useMutation({
    mutationFn: () => courseForumService.publish(ids!),
    onError: error => {
      addToast({
        title: "Release Forum Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      addToast({ color: "success", title: "Success", description: "Release forum success" });
      qc.invalidateQueries({ queryKey: forumQueries.keys.getForumThreads(ids!) });
    },
  });

  const isPending = hasTrue({ isFetching, isPendingCreateNewThread, isPendingReleaseForum });
  useNProgress(isPending);

  return {
    forumThreads,
    createNewThread,
    isPendingCreateNewThread,
    releaseForum,
  };
};

export default useEditForum;
