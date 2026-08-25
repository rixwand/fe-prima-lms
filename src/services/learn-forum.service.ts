import { CreateThreadPayload, ReplyThreadPayload } from "@/components/views/Forum/forum.type";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

type URL_PARAMS = { slug: string; sectionId: number; itemId: number };
const getURL = ({ slug, sectionId, itemId }: URL_PARAMS) => `${endpoint.LEARN}/${slug}/${sectionId}/${itemId}/forum`;

const learnForumService = {
  getForumThreads: (params: URL_PARAMS) => api.get(getURL(params)),
  getThreadsReplies: ({ threadId, ...ids }: URL_PARAMS & { threadId: number }) =>
    api.get(getURL(ids) + `/thread/${threadId}/replies`),
  createThread: ({ payload, ...ids }: URL_PARAMS & { payload: CreateThreadPayload }) =>
    api.post(getURL(ids) + "/thread", payload),
  replyThread: ({ payload, threadId, ...ids }: URL_PARAMS & { payload: ReplyThreadPayload; threadId: number }) =>
    api.post(getURL(ids) + `/thread/${threadId}/reply`, payload),
};

export default learnForumService;
