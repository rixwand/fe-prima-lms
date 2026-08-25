import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { getErrorMessage } from "@/libs/axios/error";
import { useLearningPathsContext } from "@/libs/context/LearningPathsContext";
import { hasTrue } from "@/libs/utils/boolean";
import forumQueries from "@/queries/forum-queries";
import courseDiscussionService from "@/services/course-discussion.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateThreadPayload, ReplyThreadPayload } from "../../components/views/Forum/forum.type";

const useForumDiscussion = (threadId?: number) => {
  const qc = useQueryClient();
  const { paths } = useLearningPathsContext();
  const {
    data: forumThreads,
    isError,
    error,
    isFetching,
  } = useQuery(forumQueries.options.getForumThreadsBySlug(paths!));
  useQueryError({ isError, error });

  const { data: replies, isFetching: isPendingGetReplies } = useQuery(
    forumQueries.options.getThreadsRepliesBySlug(paths && threadId ? { ...paths, threadId } : undefined),
  );
  const { mutate: replyThread, isPending: isPendingReplyThread } = useMutation({
    mutationFn: ({ payload, threadId }: { payload: ReplyThreadPayload; threadId: number }) =>
      courseDiscussionService.replyThread({ payload, threadId, ...paths! }),
    onError: error => {
      addToast({
        title: "Reply Thread Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess({ data }) {
      console.log(data);
      qc.invalidateQueries({
        queryKey: forumQueries.keys.getThreadsRepliesBySlug(paths && threadId ? { ...paths, threadId } : undefined),
      });
    },
  });

  const { mutate: createNewThread, isPending: isPendingCreateNewThread } = useMutation({
    mutationFn: (payload: CreateThreadPayload) => courseDiscussionService.createThread({ payload, ...paths! }),
    onError: error => {
      addToast({
        title: "Create New Thread Error",
        color: "danger",
        description: getErrorMessage(error as AppAxiosError),
      });
    },
    onSuccess() {
      addToast({ color: "success", title: "Success", description: "New Thread Created" });
      qc.invalidateQueries({ queryKey: forumQueries.keys.getForumThreadsBySlug(paths!) });
    },
  });

  const isPending = hasTrue({ isFetching, isPendingCreateNewThread, isPendingGetReplies, isPendingReplyThread });
  useNProgress(isPending);

  return {
    replies,
    replyThread,
    forumThreads,
    createNewThread,
    isPendingCreateNewThread,
    isPendingReplyThread,
  };
};

export default useForumDiscussion;
