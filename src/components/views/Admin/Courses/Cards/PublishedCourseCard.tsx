import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { formatDate } from "@/libs/utils/string";
import courseService from "@/services/course.service";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuEye, LuGlobe, LuGlobeLock, LuSquareArrowOutUpRight, LuStar, LuUsers } from "react-icons/lu";

export function PublishedCourseCardGrid({
  data,
  onPublish,
  onUnpublish,
  onDelete,
  isLoading,
}: {
  data: ICourseListItem;
  isLoading: boolean;
  onPublish: (id: number) => Promise<void>;
  onUnpublish: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  const qc = useQueryClient();
  const prefetch = () =>
    qc.prefetchQuery({ queryKey: ["coursePreview", data.id], queryFn: () => courseService.get(data.id) });
  const router = useRouter();
  return (
    <Card
      isPressable
      onPress={e => {
        router.push(`/instructor/dashboard/course/${data.id}`);
      }}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}
      className={cn([
        "group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-100",
        "has-[*[data-pressed=true]]:scale-100",
      ])}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={data.coverImage}
          // src={
          //   "https://vcbkvjjzhpzahozzdtap.storage.supabase.co/storage/v1/object/public/public-img-prima/courses/test_course.png"
          // }
          alt={data.title}
          fill
          // objectFit="cover"
          className="group-hover:scale-105 transition object-cover"
        />
        {/* <span
          className={cn(
            "absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full backdrop-blur",
            data.status === "PUBLISHED"
              ? "bg-emerald-600/90 text-white"
              : data.status === "DRAFT"
              ? "bg-amber-500/90 text-white"
              : "bg-slate-500/90 text-white"
          )}>
          {data.status}
        </span> */}
        <Chip
          startContent={<LuGlobe size={16} />}
          classNames={{
            content: "px-1 font-medium",
          }}
          className="absolute left-3 top-3 text-xs shadow-sm tracking-wider text-white"
          // color={data.status == "DRAFT" ? "warning" : data.status == "PUBLISHED" ? "success" : "default"}
          color="success"
          variant={"solid"}>
          {/* {data.status} */}
          PUBLISHED
        </Chip>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-center items-start gap-2">
          <h3 className="font-semibold flex-1 leading-snug text-start">{data.title}</h3>
          <Popover state={menuState} triggerType="listbox" placement="bottom-end" radius="sm">
            <PopoverTrigger>
              <Button
                isIconOnly
                onPress={e => {}}
                variant="light"
                className="ml-auto reset-button py-0.5 px-1 rounded-lg hover:bg-slate-100">
                <FiMoreHorizontal size={20} className="text-slate-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-44">
              <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
                <ListboxItem
                  className="text-danger-400"
                  color="danger"
                  onPress={e => {}}
                  startContent={<LuGlobeLock />}
                  key="new">
                  Unpublish
                </ListboxItem>
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
        <div className="items-start w-full flex">
          <Chip
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="-ml-1 group/chip"
            avatar={<Avatar name="JW" src="https://i.pravatar.cc/300?u=a042581f4e29026709d" />}
            variant="light"
            endContent={
              <LuSquareArrowOutUpRight
                className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500"
                size={12}
              />
            }>
            <span className="group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500">
              Instructor name
            </span>
          </Chip>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <LuUsers className="w-4 h-4" /> {data.students || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" /> {data.rating || "0.0"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-medium text-slate-800 font-medium">
          <span className="inline-flex items-center gap-1">
            {/* <LuTags size={20} />{" "} */}
            {(data.discount && data.discount.length > 0
              ? finalPrice(data.priceAmount, data.discount[0].value, data.discount[0].type)
              : data.priceAmount
            ).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          {/* TODO: change to updated_at */}
          <span>Published {formatDate(data.createdAt)}</span>
          <span className="mx-2">•</span>
          <button className="inline-flex items-center cursor-pointer gap-1 hover:text-blue-500">
            <LuEye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>
    </Card>
  );
}

export function PublishedCourseCardList({
  data,
  onPublish,
  onUnpublish,
  onDelete,
  isLoading,
}: {
  data: ICourseListItem;
  isLoading: boolean;
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  const qc = useQueryClient();
  const prefetch = () =>
    qc.prefetchQuery({ queryKey: ["coursePreview", data.id], queryFn: () => courseService.get(data.id) });
  return (
    <Card
      className="grid grid-cols-12 gap-4 p-4 bg-white items-center border-1 shadow-slate-100 @4xl:rounded-2xl  rounded-xl border-slate-200 shadow-lg relative w-full overflow-visible"
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}>
      <span className="absolute -left-1.5 -top-1.5 bg-success p-1 text-white rounded-full">
        <LuGlobe size={14} />
      </span>
      <div className="col-span-12 @3xl:col-span-5 flex items-center gap-3">
        <Image
          src={data.coverImage}
          width={96}
          height={56}
          className="object-cover rounded-lg shrink-0"
          alt="course thumnail"
        />
        <div className="w-2/3">
          <p className="font-medium w-full truncate">{data.title}</p>
          {/* TODO: Change to updated at */}
          <p className="text-xs text-slate-500">Updated {formatDate(data.createdAt)}</p>
        </div>
      </div>
      <div className="@md:col-span-5 col-span-12 @3xl:col-span-3 flex items-center gap-1 text-slate-600 min-w-0">
        <Chip
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          classNames={{
            content: "flex-1 min-w-0",
          }}
          className="-ml-1 group/chip w-full min-w-0"
          avatar={<Avatar name="JW" src="https://i.pravatar.cc/300?u=a042581f4e29026709d" />}
          variant="light"
          endContent={
            <LuSquareArrowOutUpRight
              className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500 shrink-0 text-inherit"
              size={12}
            />
          }>
          <span className="block group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500 truncate min-w-0 w-full">
            Instructor name three words
          </span>
        </Chip>
      </div>
      <div className="@md:col-span-2 col-span-4 @3xl:col-span-1 flex items-center gap-1 text-slate-600">
        <LuUsers className="w-4 h-4" /> {data.students || 0}
      </div>
      <div className="@md:col-span-2 @3xl:col-span-1 col-span-4 flex items-center gap-1 text-slate-600">
        <LuStar className="w-4 h-4" /> {data.rating || 0}
      </div>
      <div className="@md:col-span-3 @3xl:col-span-2 col-span-4 @4xl:col-span-1 flex items-center gap-1 text-medium text-slate-800 font-medium justify-end @4xl:justify-center">
        {(data.discount && data.discount.length > 0
          ? finalPrice(data.priceAmount, data.discount[0].value, data.discount[0].type)
          : data.priceAmount
        ).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        })}
      </div>
      <div className="@4xl:col-span-1 flex items-center justify-end @4xl:static absolute top-1 right-1.5">
        <Popover state={menuState} triggerType="listbox" placement="bottom-end" radius="sm">
          <PopoverTrigger>
            <Button
              isIconOnly
              onPress={e => {}}
              variant="light"
              className="reset-button py-0.5 px-1 rounded-lg hover:bg-slate-100">
              <FiMoreHorizontal size={20} className="text-slate-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 w-44">
            <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
              <ListboxItem
                className="text-danger-400"
                color="danger"
                onPress={e => {}}
                startContent={<LuGlobeLock />}
                key="new">
                Unpublish
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
}

export function PublishedCourseCardGridSkeleton() {
  return (
    <div className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <span className="absolute left-3 top-3 text-xs px-6 py-2 rounded-full">
          <Skeleton className="h-4 w-16 rounded-full" />
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Skeleton className="h-5 w-2/3 rounded" />
          <Skeleton className="h-5 w-6 rounded ml-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-14 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function PublishedCourseCardListSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white">
      <div className="col-span-12 md:col-span-5 flex items-center gap-3">
        <Skeleton className="w-24 h-14 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-12 md:col-span-1 flex md:justify-end gap-2">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}
