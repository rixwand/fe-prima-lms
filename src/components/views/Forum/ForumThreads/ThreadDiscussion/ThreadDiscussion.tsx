import useDump from "@/hooks/use-dump";
import { previewImage } from "@/libs/utils/image-preview";
import { timeAgo } from "@/libs/utils/moment";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Image,
  Input,
  Spinner,
  Textarea,
  UseDisclosureProps,
} from "@heroui/react";
import NextImage from "next/image";
import { Controller } from "react-hook-form";
import { LuClock3, LuImagePlus, LuMessageSquare, LuSendHorizontal, LuX } from "react-icons/lu";
import ThreadReply from "./ThreadReply";
import useThreadDiscussioon, { buildReplyTree } from "./useThreadDiscussioon";

export default function ThreadDrawer({
  onOpen,
  isOpen,
  onClose,
  thread,
}: UseDisclosureProps & { thread?: Thread | null }) {
  const {
    methods: { control, getValues, setValue },
    liveImagesUrl,
    handleReplyThread,
    isValid,
    isPendingReplyThread,
    isUploadImagesPending,
    replies,
    handleRepliedTo,
    replyingTo,
  } = useThreadDiscussioon(thread?.id);
  const replyTrees = buildReplyTree(replies ?? []);
  useDump({ replyTrees });
  return (
    <Drawer onClose={onClose} isOpen={isOpen} onOpenChange={onOpen} size="2xl" placement="right" hideCloseButton>
      <DrawerContent>
        {onClose => (
          <>
            <DrawerHeader className="border-divider flex items-start justify-between border-b">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">How do I handle nested replies in Prisma?</h2>

                  <div className="text-default-500 mt-1 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 font-medium">
                      <LuMessageSquare />
                      <span>{thread?._count.replies || 0} replies</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium">
                      <LuClock3 />
                      <span>{thread && timeAgo(thread?.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button isIconOnly variant="light" onPress={onClose}>
                <LuX size={18} />
              </Button>
            </DrawerHeader>

            <DrawerBody className="p-0 overflow-y-auto scrollbar-hide">
              <div className="flex h-full flex-col">
                {/* Thread Content */}
                <div className="border-divider border-b-5 px-5 py-3 space-y-2">
                  <div className="flex gap-3">
                    <Avatar
                      size="sm"
                      name={thread?.author.username ?? ""}
                      src={thread?.author.profilePict ?? "/images/user.jpg"}
                    />

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{thread?.author.fullName ?? ""}</span>
                        <span className="text-default-400 text-xs">
                          {thread?.createdAt && timeAgo(thread.createdAt)}
                        </span>
                      </div>

                      <div className="flex gap-1 max-w-full flex-wrap">
                        {thread?.content.images?.map((img, i) => (
                          <Image
                            key={i}
                            onClick={() => previewImage({ src: img, alt: `${thread.title}_${i} image` })}
                            classNames={{
                              img: "h-48! w-auto! relative!",
                            }}
                            fill
                            src={img}
                            alt={`${thread.title}_${i} image`}
                            as={NextImage}
                          />
                        ))}
                      </div>
                      <p className="text-default-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {thread?.content.message ?? ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <div className="flex-1 space-y-4 p-5">
                  {replyTrees?.map(reply => (
                    <ThreadReply
                      key={reply.id}
                      reply={reply}
                      focus={replyingTo?.id == reply.id}
                      onReply={handleRepliedTo}
                      replyingTo={replyingTo}
                    />
                  ))}
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="border-divider border-t px-0 pt-0 flex-col overflow-visible">
              {replyingTo && (
                <div className="py-2.5 px-4 text-sm border-b border-divider bg-gray-50 text-gray-600 flex justify-between items-center">
                  <p>
                    Replying to <span className="font-semibold">{replyingTo.author.fullName}</span>
                  </p>
                  <Button
                    onPress={() => handleRepliedTo(null)}
                    isIconOnly
                    className="reset-button p-0.5 bg-gray-400 text-white"
                    size="sm"
                    radius="full"
                    disableRipple
                    variant="light">
                    <LuX size={12} />
                  </Button>
                </div>
              )}
              {liveImagesUrl.length > 0 && (
                <div className="flex gap-2 overflow-auto relative pt-3 -mb-0.5 scrollbar-hide px-3.5">
                  {liveImagesUrl.map((src, index) => (
                    <div className="cursor-pointer relative group/image shrink-0 rounded-md">
                      <Button
                        onPress={() =>
                          setValue(
                            "images",
                            liveImagesUrl.filter((f, idx) => index != idx),
                            { shouldValidate: true },
                          )
                        }
                        isIconOnly
                        disableRipple
                        variant="solid"
                        color="danger"
                        radius="full"
                        size="sm"
                        className="reset-button absolute z-50 p-0.5 -top-1 -right-1 hidden group-hover/image:flex">
                        <LuX />
                      </Button>
                      <NextImage
                        onClick={() =>
                          previewImage({
                            src: URL.createObjectURL(src),
                            alt: `Image ${index + 1}`,
                          })
                        }
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md"
                        src={URL.createObjectURL(src)}
                        alt={`Image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex w-full gap-1 items-end px-3.5 mt-3">
                <label className="p-2.5 text-primary bg-primary-100 rounded-full hover:bg-primary hover:text-white bouncy-button cursor-pointer active:bg-primary-600">
                  <Controller
                    control={control}
                    name="images"
                    rules={{
                      validate: files => {
                        const message = getValues("message");
                        return (
                          !!message?.trim() || (files?.length ?? 0) > 0 || "Provide a message or at least one image"
                        );
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        accept="image/*"
                        className="hidden"
                        type="file"
                        multiple
                        onChange={e => {
                          const newFiles = Array.from(e.target.files ?? []);
                          onChange([...(value ?? []), ...newFiles]);
                          e.target.value = "";
                        }}
                      />
                    )}
                  />
                  <LuImagePlus size={18} />
                </label>
                <Controller
                  control={control}
                  name="message"
                  rules={{
                    validate: value => {
                      const images = getValues("images");

                      return !!value?.trim() || (images?.length ?? 0) > 0 || "Provide a message or at least one image";
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="font-medium"
                      minRows={1}
                      radius="full"
                      name="reply"
                      placeholder="Write a reply..."
                    />
                  )}
                />
                <Button
                  onPress={handleReplyThread}
                  isDisabled={!isValid || isPendingReplyThread || isUploadImagesPending}
                  isIconOnly
                  className="reset-button p-2.5"
                  color="primary"
                  radius="full"
                  disableRipple
                  variant="solid">
                  {isPendingReplyThread || isUploadImagesPending ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    <LuSendHorizontal size={18} />
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
