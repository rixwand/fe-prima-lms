import { timeAgo } from "@/libs/utils/moment";
import { Avatar, Button, Chip } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LuClock, LuMessageCircle } from "react-icons/lu";
const ForumThreadItem = ({
  updatedAt,
  author: { fullName, profilePict },
  content: { message, images },
  title,
  _count: { replies },
  slug,
  onPress,
}: Thread & { onPress: () => void }) => {
  const router = useRouter();
  return (
    <Button
      disableRipple
      isIconOnly
      className="group rounded-xl border border-default-200 bg-content1 py-3.5 px-[1.125rem] text-left transition-all hover:bg-default-100 hover:border-default-300 cursor-pointer data-[pressed=true]:scale-[0.99] w-full h-fit justify-start"
      onPress={onPress}>
      <div className="flex gap-x-4 items-center w-full justify-between ">
        <div className="flex-1 text-start flex flex-col gap-y-1.5">
          <h3 className="font-semibold text-base text-slate-800 line-clamp-2">{title}</h3>
          <div className="items-start w-full flex">
            <Chip className="-ml-1 " avatar={<Avatar name="JW" src={profilePict} />} variant="light">
              <span className=" ml-0.5 text-slate-600">{fullName}</span>
            </Chip>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-default-500">
            <LuMessageCircle />
            <span>{replies} replies</span>
            <LuClock />
            <span>Updated {timeAgo(updatedAt)}</span>
          </div>
        </div>

        {images?.[0] && (
          <div className="aspect-square size-20 overflow-hidden rounded-sm relative shrink-0 mr-auto">
            <Image
              alt="thread image"
              className="object-cover"
              //  src={"/images/tiptap-ui-placeholder-image.jpg"}
              src={images[0]}
              fill
            />
          </div>
        )}
      </div>
    </Button>
  );
};

export default ForumThreadItem;
