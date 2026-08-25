import { CreateThreadPayload, ReplyThreadPayload } from "@/components/views/Forum/forum.type";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

export type CoursePathWithItemId = {
  slug: string;
  sectionId: number;
  itemId: number;
};

export type PathsWithThreadId = CoursePathWithItemId & {
  threadId: number;
};

const getForumURL = ({ slug, sectionId, itemId }: CoursePathWithItemId) =>
  `${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/forum`;

export default {
  getForumThreads: (ids: CoursePathWithItemId) => api.get(getForumURL(ids)),
  getThreadsReplies: ({ threadId, ...ids }: PathsWithThreadId) =>
    api.get(getForumURL(ids) + `/thread/${threadId}/replies`),
  createThread: ({ payload, ...ids }: CoursePathWithItemId & { payload: CreateThreadPayload }) =>
    api.post(getForumURL(ids) + "/thread", payload),
  replyThread: ({
    payload,
    threadId,
    ...ids
  }: CoursePathWithItemId & { payload: ReplyThreadPayload; threadId: number }) =>
    api.post(getForumURL(ids) + `/thread/${threadId}/reply`, payload),
};
