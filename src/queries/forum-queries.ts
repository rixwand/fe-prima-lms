import courseDiscussionService, { CoursePathWithItemId, PathsWithThreadId } from "@/services/course-discussion.service";
import courseForumService, { IdsWithThreadId } from "@/services/course-forum.service";
import { queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
const forumQueries = {
  keys: {
    getForumThreads: (ids: IdsWithItemId) => ["forum-threads", ids],
    getForumThreadsBySlug: (paths: CoursePathWithItemId) => ["forum-threads", paths],
    getThreadsReplies: (ids?: IdsWithThreadId) => ["threads-replies", ids],
    getThreadsRepliesBySlug: (paths?: PathsWithThreadId) => ["threads-replies", paths],
  },
  options: {
    getForumThreadsBySlug: (paths: CoursePathWithItemId) =>
      queryOptions<ForumThreadResponse>({
        queryFn: () =>
          courseDiscussionService
            .getForumThreads(paths)
            .then(res => res.data)
            .catch(error => {
              console.log("query forum thread error: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw error;
            }),
        queryKey: forumQueries.keys.getForumThreadsBySlug(paths),
      }),
    getForumThreads: (ids: IdsWithItemId) =>
      queryOptions<ForumThreadResponse>({
        queryFn: () =>
          courseForumService
            .getForumThreads(ids)
            .then(res => res.data)
            .catch(error => {
              console.log("query forum thread error: ", error);
              if (isAxiosError(error) && error.status == 404) return { courses: [], meta: null };
              else throw error;
            }),
        queryKey: forumQueries.keys.getForumThreads(ids),
      }),
    getThreadsRepliesBySlug: (paths?: PathsWithThreadId) =>
      queryOptions<Reply[]>({
        queryKey: forumQueries.keys.getThreadsRepliesBySlug(paths),
        queryFn: () =>
          courseDiscussionService
            .getThreadsReplies(paths!)
            .then(res => res.data)
            .catch(error => {
              console.log("query thread's replies error: ", error);
              if (isAxiosError(error) && error.status == 404) return [];
              else throw error;
            }),
        enabled: !!paths,
      }),
    getThreadsReplies: (ids?: IdsWithThreadId) =>
      queryOptions<Reply[]>({
        queryKey: forumQueries.keys.getThreadsReplies(ids),
        queryFn: () =>
          courseForumService
            .getThreadsReplies(ids!)
            .then(res => res.data)
            .catch(error => {
              console.log("query thread's replies error: ", error);
              if (isAxiosError(error) && error.status == 404) return [];
              else throw error;
            }),
        enabled: !!ids,
      }),
  },
};

export default forumQueries;
