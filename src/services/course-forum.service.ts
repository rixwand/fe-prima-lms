import { CreateThreadPayload, ReplyThreadPayload } from "@/components/views/Forum/forum.type";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export type IdsWithThreadId = IdsWithItemId & {
  threadId: number;
};

const getForumURL = ({ courseId, sectionId, itemId }: IdsWithItemId) =>
  `${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}/items/${itemId}/forum`;

export default {
  getForumThreads: (ids: IdsWithItemId) => api.get(getForumURL(ids)),
  getThreadsReplies: ({ threadId, ...ids }: IdsWithThreadId) =>
    api.get(getForumURL(ids) + `/thread/${threadId}/replies`),
  createThread: ({ payload, ...ids }: IdsWithItemId & { payload: CreateThreadPayload }) =>
    api.post(getForumURL(ids) + "/thread", payload),
  replyThread: ({ payload, threadId, ...ids }: IdsWithItemId & { payload: ReplyThreadPayload; threadId: number }) =>
    api.post(getForumURL(ids) + `/thread/${threadId}/reply`, payload),
  publish: (ids: IdsWithItemId) => api.post(getForumURL(ids) + "/publish"),
};
