import ForumThreadItem from "@/components/commons/ForumThreadItem";
import { Button, Select, SelectItem } from "@heroui/react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowUpDown, LuCloudUpload } from "react-icons/lu";
import { CreateThreadForm } from "../forum.type";
import useForum, { sortingType } from "../useForum";
import CreateOrSearchThread from "./CreateOrSearchThread";
import ThreadDrawer from "./ThreadDiscussion";
import useForumThread from "./useForumThread";
export default function () {
  const methods = useForm<CreateThreadForm>();
  const { setSortBy, sortBy, handleReleaseForum } = useForum();
  const { threadList, drawerDisclosure, handleOnClickThread, selectedThread, forumThreads } = useForumThread({
    methods,
  });
  return (
    <FormProvider {...methods}>
      <div className="space-y-5 text-slate-700">
        {/* <Button
          onPress={drawerDisclosure.onOpen}
          isIconOnly
          className="reset-button mb-5 data-[hover=true]:bg-transparent font-medium ml-1.5"
          color="primary"
          variant="light"
          disableRipple
          startContent={<LuArrowLeft className="mr-3.5" size={18} />}>
          Back to Course List
        </Button> */}
        {!forumThreads?.publishedAt && (
          <Button
            className="text-white reset-button px-3 py-2 rounded-lg"
            radius="none"
            isIconOnly
            onPress={handleReleaseForum}
            startContent={<LuCloudUpload className="mr-1.5" size={18} />}
            color="success">
            Release Forum
          </Button>
        )}
        <CreateOrSearchThread />
        <div className="flex items-center gap-x-3">
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
        <div className="space-y-3">
          {threadList.map(thread => (
            <ForumThreadItem key={thread.id} {...thread} onPress={() => handleOnClickThread(thread)} />
          ))}
        </div>
      </div>
      <ThreadDrawer {...drawerDisclosure} thread={selectedThread} />
    </FormProvider>
  );
}
