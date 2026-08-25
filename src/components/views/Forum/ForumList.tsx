import { timeAgo } from "@/libs/utils/moment";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { LuArrowLeft, LuArrowUpDown, LuClock, LuMessageCircle, LuSearch } from "react-icons/lu";
import { forumList } from "./dummy";
import { sortingType } from "./useForum";

export default function () {
  const [sortBy, setSortBy] = useState<SortingType>("DATE");
  const router = useRouter();
  return (
    <div className="space-y-4 text-slate-700">
      <Button
        isIconOnly
        className="reset-button mb-5 data-[hover=true]:bg-transparent font-medium ml-1.5"
        color="primary"
        variant="light"
        disableRipple
        onPress={() => router.push("/instructor/dashboard/forum")}
        startContent={<LuArrowLeft className="mr-3.5" size={18} />}>
        Back to Course List
      </Button>
      <div className="flex bg-default-100 items-center rounded-xl p-1">
        <LuSearch size={20} className="ml-1.5" />
        <Input
          variant="flat"
          classNames={{
            inputWrapper:
              "!bg-transparent !shadow-none !border-none hover:!bg-transparent group-data-[focus=true]:!bg-transparent",
          }}
          className="w-10/12"
          placeholder="Search for thread"
        />
        <Button color="primary" className="ml-auto" startContent={<LuMessageCircle size={18} />}>
          New Thread
        </Button>
      </div>
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
      <div className="space-y-3 w-full">
        {forumList.map(forum => (
          <ForumListItem key={forum.id} {...forum} />
        ))}
      </div>
    </div>
  );
}

const ForumListItem = ({ forumTitle, createdAt, threads, unansweredThread, updatedAt }: ForumListItem) => {
  const router = useRouter();
  return (
    <Button
      disableRipple
      isIconOnly
      className="group rounded-xl border border-default-200 bg-content1 py-3.5 px-[1.125rem] text-left transition-all hover:bg-default-100 hover:border-default-300 cursor-pointer data-[pressed=true]:scale-[0.99] w-full h-fit justify-start"
      onPress={() => router.push(router.pathname + `/${forumTitle.toLowerCase().replaceAll(" ", "-")}`)}>
      <div className="flex items-center gap-4 w-full">
        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <HiOutlineChatBubbleLeftRight size={24} className="text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="truncate text-base font-semibold">{forumTitle}</h3>

            {unansweredThread > 0 && (
              <span
                className="
                      rounded-full
                      bg-danger/10
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-danger
                    ">
                {unansweredThread} unanswered
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-default-500">
            <LuMessageCircle />
            <span>{threads} threads</span>

            <LuClock />

            <span>Updated {timeAgo(updatedAt)}</span>
          </div>
        </div>

        <FaChevronRight
          size={14}
          className="mt-1 text-default-400 transition-transform group-hover:translate-x-1 mr-auto"
        />
      </div>
    </Button>
  );
};
