import { ROLE_LECTURER } from "@/config/env";
import useEditForum from "@/hooks/course/useEditForum";
import useForumDiscussion from "@/hooks/course/useForumDiscussion";
import useUploadFile from "@/hooks/use-uploadFile";
import { getUnknownErrorMessage } from "@/libs/axios/error";
import { addToast, useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { CreateThreadForm } from "../forum.type";

export default function useForumThread({
  methods: { control, getValues, trigger, setValue, handleSubmit },
  methods,
}: {
  methods: UseFormReturn<CreateThreadForm>;
}) {
  const { data } = useSession();
  const { createNewThread, isPendingCreateNewThread, forumThreads } =
    data?.user.role == ROLE_LECTURER ? useEditForum() : useForumDiscussion();
  const [mode, setMode] = useState<"search" | "create">("search");
  const [search, setSearch] = useState("");
  const drawerDisclosure = useDisclosure({ defaultOpen: false });
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const inputTitleRef = useRef<HTMLInputElement>(null);
  const [...liveImagesUrl] = useWatch({ control, name: "images" }) ?? [];
  const { uploadImages, isUploadImagesPending } = useUploadFile();
  useEffect(() => {
    if (mode == "create") inputTitleRef.current?.focus();
  }, [mode]);

  const handleSubmitNewThread = async () => {
    try {
      const { title, images, message } = getValues();
      let imagesUrl: string[] | undefined;
      if (images?.length) {
        imagesUrl = await uploadImages({ files: images, prefix: "forum" });
      }

      if (images?.length !== imagesUrl?.length) {
        addToast({ title: "Error uploading image", color: "danger" });
        return;
      }
      return createNewThread({ content: { images: imagesUrl, message }, title });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error uploading image",
        description: getUnknownErrorMessage(error),
      });
      console.error(error);
    }
  };
  const handleSearchOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      setMode("create");
      setValue("title", search);
    }
  };
  const handleOnClickThread = (thread: Thread) => {
    setSelectedThread(thread);
  };
  useEffect(() => {
    if (selectedThread) drawerDisclosure.onOpen();
  }, [selectedThread]);

  useEffect(() => {
    if (!drawerDisclosure.isOpen) setSelectedThread(null);
  }, [drawerDisclosure.isOpen]);

  return {
    methods,
    handleSearchOnKeyDown,
    handleSubmitNewThread,
    mode,
    setMode,
    liveImagesUrl,
    search,
    setSearch,
    inputTitleRef,
    isPendingCreateNewThread,
    isUploadImagesPending,
    threadList: forumThreads?.threads ?? [],
    selectedThread,
    handleOnClickThread,
    drawerDisclosure,
    forumThreads,
  };
}
