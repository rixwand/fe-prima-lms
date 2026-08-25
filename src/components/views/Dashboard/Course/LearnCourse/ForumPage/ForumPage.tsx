import ForumThreadItem from "@/components/commons/ForumThreadItem";
import CreateOrSearchThread from "@/components/views/Forum/ForumThreads/CreateOrSearchThread";
import ThreadDrawer from "@/components/views/Forum/ForumThreads/ThreadDiscussion/ThreadDiscussion";
import useForumThread from "@/components/views/Forum/ForumThreads/useForumThread";
import { CreateThreadForm } from "@/components/views/Forum/forum.type";
import { sortingType } from "@/components/views/Forum/useForum";
import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowUpDown } from "react-icons/lu";

export default function ForumPage({ title, id, ...item }: CourseSectionsItem) {
  const [sortBy, setSortBy] = useState("DATE");
  const methods = useForm<CreateThreadForm>();
  const { threadList, drawerDisclosure, handleOnClickThread, selectedThread } = useForumThread({
    methods,
  });
  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-[75%]">
        <CreateOrSearchThread />
        <div className="flex items-center gap-x-3 mt-2.5">
          <p>Sort By </p>
          <Select
            aria-label="Select Item type"
            className="max-w-[8.9rem]"
            size="sm"
            items={sortingType}
            selectedKeys={sortBy ? [sortBy] : undefined}
            onSelectionChange={keys => {
              const val = Array.from(keys)[0] as SortingType;
              if (!val) return;
              setSortBy(val);
            }}
            startContent={<LuArrowUpDown size={20} />}
            classNames={{
              // selectorIcon: "-mr-1.5",
              trigger: "focus-within:ring-blue-500 focus-within:ring-1 rounded-full p-3.5",
              popoverContent: "rounded-lg p-0",
            }}>
            {({ key, label }) => (
              <SelectItem aria-label={label} key={key}>
                <span className="flex items-center gap-x-1">{label}</span>
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="space-y-2 mt-3">
          {threadList.map(thread => (
            <ForumThreadItem key={thread.id} {...thread} onPress={() => handleOnClickThread(thread)} />
          ))}
        </div>
      </div>
      <ThreadDrawer {...drawerDisclosure} thread={selectedThread} />
    </FormProvider>
  );
}
