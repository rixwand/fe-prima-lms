type SortingType = "DATE" | "ACTIVITY";
type CourseForumListItem = {
  id: number;
  courseSlug: string;
  courseTitle: string;
  image: string;
  forum: number;
  threads: number;
  updatedAt: string;
  createdAt: string;
};

type ForumListItem = {
  id: number;
  forumTitle: string;
  threads: number;
  unansweredThread: number;
  updatedAt: string;
  createdAt: string;
};

// type ThreadListItem = {
//   id: number;
//   threadTitle: string;
//   image: string;
//   firstMessage: {
//     fullName: string;
//     message: string;
//   };
//   messageTotal: number;
//   updatedAt: string;
//   createdAt: string;
// };

interface ForumThreadResponse {
  id: number;
  sectionItemId: number;
  threads: Thread[];
  publishedAt: string | null;
}

interface Thread {
  id: number;
  title: string;
  slug: string;
  content: ThreadContent;
  forumId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  _count: { replies: number };
}

interface ThreadContent {
  message?: string;
  images?: string[];
}

interface Author {
  username: string;
  fullName: string;
  profilePict: string;
}

interface Reply {
  id: number;
  content: {
    message?: string;
    images?: string[];
  };
  authorId: number;
  author: {
    fullName: string;
    profilePict: string;
  };
  threadId: number;

  parentId: number | null;

  replyToId: number | null;
  replyTo?: Reply;

  deletedAt: string | null;
  deletedById: number | null;

  createdAt: string;
  updatedAt: string;
}

interface ReplyTree extends Reply {
  children: ReplyTree[];
}
