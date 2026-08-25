import { timeAgo } from "@/libs/utils/moment";
import { Button, Divider, Input, Select, SelectItem } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaChevronRight } from "react-icons/fa6";
import { LuArrowUpDown, LuClock, LuMessageCircle, LuMessagesSquare, LuSearch } from "react-icons/lu";
import { courseForumList } from "./dummy";
import useForum, { sortingType } from "./useForum";

export default function () {
  const { setSortBy, sortBy } = useForum();
  return (
    <div className="space-y-4 text-slate-700">
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
      <Divider />
      <div className="space-y-3">
        {courseForumList.map((course, i) => (
          <CourseForumItem key={i} {...course} />
        ))}
      </div>
    </div>
  );
}

const CourseForumItem = ({ courseTitle, forum, image, threads, updatedAt }: CourseForumListItem) => {
  const router = useRouter();
  return (
    <Button
      disableRipple
      isIconOnly
      className="group rounded-xl border border-default-200 bg-content1 pr-5 py-2 pl-3 text-left transition-all hover:bg-default-100 hover:border-default-300 cursor-pointer data-[pressed=true]:scale-[0.99] w-full h-fit justify-start"
      onPress={() => router.push(`/instructor/dashboard/forum/${courseTitle.toLowerCase().replaceAll(" ", "-")}`)}>
      <div className="flex gap-x-4 items-center w-full">
        <div className="relative aspect-video h-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={"/images/tiptap-ui-placeholder-image.jpg"}
            fill
            className="object-cover group-hover:scale-110"
            alt="course thumbnail"
          />
        </div>
        <div className="flex-1 text-start flex flex-col py-2">
          <h3 className="truncate text-base font-semibold">{courseTitle}</h3>
          {/* <p className="text-sm text-slate-500 mb-1 italic">New threads 7 min ago</p> */}
          {/* <div className="flex  items-center gap-x-7 text-sm text-slate-600">
            <Chip variant="solid" color="primary" classNames={{ content: "flex gap-2 items-center" }}>
              <LuMessagesSquare size={16} />
              <span>{forum} Forum</span>
            </Chip>
            <Chip variant="solid" color="secondary" classNames={{ content: "flex gap-2 items-center" }}>
              <LuMessageCircle size={16} />
              <span>{threads} Threads</span>
            </Chip>
          </div> */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-default-500">
            <LuMessagesSquare />
            <span>{forum} forum</span>
            <LuMessageCircle />
            <span>{threads} threads</span>
            <LuClock />
            <span>Updated {timeAgo(updatedAt)}</span>
          </div>
        </div>
        <span className="ml-auto">
          <FaChevronRight size={14} className="mt-1 text-default-400 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Button>
  );
};
