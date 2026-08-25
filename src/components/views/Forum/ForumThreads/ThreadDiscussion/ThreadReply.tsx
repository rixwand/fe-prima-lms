import cn from "@/libs/utils/cn";
import { previewImage } from "@/libs/utils/image-preview";
import { timeAgo } from "@/libs/utils/moment";
import { Avatar, Button, Chip, Image } from "@heroui/react";
import { useState } from "react";
import { LuCornerDownLeft, LuEyeOff, LuReply } from "react-icons/lu";

interface ThreadReplyProps {
  reply: ReplyTree;
  depth?: number;
  onReply?: (reply: ReplyTree) => void;
  showRepliedTo?: boolean;
  focus?: boolean;
  replyingTo: Reply | null;
}

export default function ThreadReply({
  reply,
  depth = 0,
  onReply,
  showRepliedTo = false,
  focus = false,
  replyingTo,
}: ThreadReplyProps) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <div className={"my-1.5 py-1.5"}>
      {showRepliedTo && (
        <div className="w-full flex pl-12 mb-1 items-center">
          <Chip
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="-ml-1 opacity-70"
            classNames={{ content: "px-1" }}
            avatar={<Avatar name="JW" src={reply.replyTo?.author.profilePict} />}
            variant="light">
            <span className="ml-0.5 text-slate-600 ">{reply.replyTo?.author.fullName}</span>
          </Chip>
          {reply.replyTo?.content.message && (
            <p className="text-default-700 text-sm">{reply.replyTo.content.message}</p>
          )}
        </div>
      )}
      <div className={cn("flex gap-3 relative rounded-sm py-1 group", focus ? "bg-gray-100" : "hover:bg-gray-100")}>
        {showRepliedTo && (
          <div className="w-[1.80rem] h-5 border-t-1.5 border-l-1.5 rounded-tl-xl border-divider absolute -top-5 left-4.5"></div>
        )}
        <Avatar size="md" name={reply.author.fullName} src={reply.author.profilePict} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{reply.author.fullName}</span>
            <span className="text-default-400 text-xs">{timeAgo(reply.createdAt)}</span>
            <Button
              onPress={() => onReply?.(reply)}
              isIconOnly
              variant="light"
              disableRipple
              className=" reset-button data-[hover=true]:bg-transparent text-default-500 text-xs ml-2 flex md:hidden group-hover:md:flex"
              startContent={<LuReply className="mr-1" />}>
              Reply
            </Button>
          </div>

          {reply.deletedAt ? (
            <p className="text-default-400 mt-1 text-sm italic">This reply has been deleted.</p>
          ) : (
            <>
              {reply.content.message && <p className="text-default-700 mt-1 text-sm">{reply.content.message}</p>}

              {reply.content.images?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {reply.content.images.map((image, i) => (
                    <Image
                      onClick={() =>
                        previewImage({
                          src: image,
                          alt: `Reply ${reply.author.fullName} image content`,
                        })
                      }
                      key={`${reply.id}_${i}`}
                      src={image}
                      alt={`Reply ${reply.author.fullName} image content`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md cursor-pointer"
                    />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className="ml-5">
        {showReplies && depth < 1 && reply.children.length > 0 && (
          <div className="border-divider py-1.5 border-l pl-5">
            {reply.children.map((child, i) => (
              <ThreadReply
                key={child.id}
                reply={child}
                depth={depth + 1}
                showRepliedTo={i > 0 && child.parentId != reply.id}
                onReply={onReply}
                focus={replyingTo?.id == child.id}
                replyingTo={replyingTo}
              />
            ))}
          </div>
        )}
        {reply.children.length > 0 && depth < 1 && (
          <Button
            disableRipple
            isIconOnly
            size="sm"
            variant="light"
            endContent={
              showReplies ? (
                <LuEyeOff size={12} className="ml-1.5" />
              ) : (
                <LuCornerDownLeft size={12} className="ml-1.5" />
              )
            }
            className="reset-button mt-2 ml-8 h-auto min-w-0 p-0 data-[hover=true]:bg-transparent text-slate-600"
            onPress={() => setShowReplies(v => !v)}>
            {showReplies ? "hide " : `show all ${reply.children.length} `}reply
          </Button>
        )}
      </div>
    </div>
  );
}
