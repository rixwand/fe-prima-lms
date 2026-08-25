import { ReplyThreadPayload } from "@/components/views/Forum/forum.type";
import { getErrorMessage } from "@/libs/axios/error";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { hasTrue } from "@/libs/utils/boolean";
import forumQueries from "@/queries/forum-queries";
import courseForumService from "@/services/course-forum.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";

export default function (threadId?: number) {
  const qc = useQueryClient();
  const { ids } = useLessonEditorContext();
  const { data: replies, isFetching: isPendingGetReplies } = useQuery(
    forumQueries.options.getThreadsReplies(ids && threadId ? { ...ids, threadId } : undefined),
  );
  const { mutate: replyThread, isPending: isPendingReplyThread } = useMutation({
    mutationFn: ({ payload, threadId }: { payload: ReplyThreadPayload; threadId: number }) =>
      courseForumService.replyThread({ payload, threadId, ...ids! }),
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
        queryKey: forumQueries.keys.getThreadsReplies(ids && threadId ? { ...ids, threadId } : undefined),
      });
    },
  });
  const isPending = hasTrue({ isPendingReplyThread, isPendingGetReplies });
  useNProgress(isPending);
  return {
    replyThread,
    isPendingReplyThread,
    replies,
  };
}
