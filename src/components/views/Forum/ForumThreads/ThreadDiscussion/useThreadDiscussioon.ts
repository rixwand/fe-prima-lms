import { ROLE_LECTURER } from "@/config/env";
import useEditThread from "@/hooks/course/useEditThread";
import useForumDiscussion from "@/hooks/course/useForumDiscussion";
import useUploadFile from "@/hooks/use-uploadFile";
import { addToast } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ReplyThreadForm } from "../../forum.type";

export default function (threadId?: number) {
  const { data } = useSession();
  const methods = useForm<ReplyThreadForm>();
  const {
    control,
    getValues,
    formState: { isValid },
  } = methods;
  const [replyingTo, setReplyingTo] = useState<Reply | null>(null);
  const [...liveImagesUrl] = useWatch({ control, name: "images" }) ?? [];
  const { replyThread, isPendingReplyThread, replies } =
    data?.user.role == ROLE_LECTURER ? useEditThread(threadId) : useForumDiscussion(threadId);
  const { uploadImages, isUploadImagesPending } = useUploadFile();
  const handleReplyThread = async () => {
    if (!threadId) {
      addToast({ title: "Invalid thread", color: "danger" });
      return;
    }
    if (!isValid) return;
    const { images, message } = getValues();
    let imageUrls: string[] | undefined = undefined;
    if (images && images.length > 0) {
      imageUrls = await uploadImages({ files: images, prefix: "forum" });
    }
    return replyThread({
      payload: { ...(replyingTo && { repliedToId: replyingTo.id }), content: { images: imageUrls, message } },
      threadId,
    });
  };
  const handleRepliedTo = (reply: Reply | null) => setReplyingTo(reply);
  return {
    methods,
    liveImagesUrl,
    handleReplyThread,
    isPendingReplyThread,
    isUploadImagesPending,
    isValid,
    replies,
    replyingTo,
    handleRepliedTo,
  };
}

// export function buildReplyTree(replies: Reply[]): ReplyTree[] {
//   const map = new Map<number, ReplyTree>();

//   replies.forEach(reply => {
//     map.set(reply.id, {
//       ...reply,
//       children: [],
//     });
//   });

//   const roots: ReplyTree[] = [];

//   replies.forEach(reply => {
//     const node = map.get(reply.id)!;

//     if (reply.parentId) {
//       map.get(reply.parentId)?.children.push({ ...node, replyTo: map.get(reply.parentId) });
//     } else {
//       roots.push(node);
//     }
//   });

//   return roots;
// }

// export function flattenTree(replies: ReplyTree[], maxDepth = 1): ReplyTree[] {
//   return replies.map(reply => flattenNode(reply, 0, maxDepth));
// }

// function flattenNode(node: ReplyTree, depth: number, maxDepth: number): ReplyTree {
//   if (depth >= maxDepth) {
//     return {
//       ...node,
//       children: [],
//     };
//   }

//   const promotedChildren: ReplyTree[] = [];

//   node.children.forEach(child => {
//     if (depth + 1 >= maxDepth) {
//       promotedChildren.push(child);
//       promotedChildren.push(...child.children);
//     } else {
//       promotedChildren.push(flattenNode(child, depth + 1, maxDepth));
//     }
//   });

//   return {
//     ...node,
//     children: promotedChildren,
//   };
// }

export function buildReplyTree(replies: Reply[]): ReplyTree[] {
  const map = new Map<number, ReplyTree>();

  replies.forEach(reply => {
    map.set(reply.id, {
      ...reply,
      children: [],
    });
  });

  const roots: ReplyTree[] = [];

  replies.forEach(reply => {
    const node = map.get(reply.id)!;

    if (!reply.parentId) {
      roots.push(node);
      return;
    }

    let rootParent = reply.parentId;
    let parent = map.get(rootParent);

    while (parent?.parentId) {
      rootParent = parent.parentId;
      parent = map.get(rootParent);
    }

    map.get(rootParent)?.children.push({
      ...node,
      replyTo: map.get(reply.parentId),
    });
  });

  return roots;
}
