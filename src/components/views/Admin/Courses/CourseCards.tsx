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
import { Fragment } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  LuCircleX,
  LuClockAlert,
  LuEye,
  LuFileCheck2,
  LuFileText,
  LuGlobeLock,
  LuSquareArrowOutUpRight,
  LuStar,
  LuUsers,
} from "react-icons/lu";
import { confirmDialog } from "../../../commons/Dialog/confirmDialog";

export function CourseCardGrid({
  data,
  onPublish,
  onUnpublish,
  onDelete,
  isLoading,
}: {
  data: QueryPublishCourse;
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
        router.push(`/admin/dashboard/course/${data.courseId}`);
      }}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}
      className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-100">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={data.course.coverImage}
          // src={
          //   "https://vcbkvjjzhpzahozzdtap.storage.supabase.co/storage/v1/object/public/public-img-prima/courses/test_course.png"
          // }
          alt={data.course.title}
          fill
          // objectFit="cover"
          className="group-hover:scale-105 transition object-cover"
        />
        <Chip
          startContent={<LuClockAlert size={16} />}
          classNames={{
            content: "px-1 font-medium",
          }}
          className="absolute left-3 top-3 text-xs shadow-sm tracking-wider text-white"
          color={data.status == "PENDING" ? "warning" : data.status == "APPROVED" ? "success" : "danger"}
          // color="warning"
          variant={"solid"}>
          {data.status == "APPROVED" ? "PUBLISHED" : data.status}
        </Chip>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold flex-1 leading-snug text-start">{data.course.title}</h3>
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
                {data.status == "PENDING" ? (
                  <Fragment>
                    <ListboxItem onPress={e => {}} startContent={<LuFileCheck2 />} key="approve">
                      Approve
                    </ListboxItem>
                    <ListboxItem onPress={e => {}} startContent={<LuFileText />} key="notes">
                      Notes
                    </ListboxItem>
                    <ListboxItem
                      className="text-danger-400"
                      color="danger"
                      onPress={e => {}}
                      startContent={<LuCircleX />}
                      key="decline">
                      Decline
                    </ListboxItem>
                  </Fragment>
                ) : (
                  <ListboxItem
                    className="text-danger-400"
                    color="danger"
                    onPress={e => {}}
                    startContent={<LuGlobeLock />}
                    key="new">
                    Unpublish
                  </ListboxItem>
                )}
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
            avatar={<Avatar name="JW" src={data.course.owner.profilePict} />}
            variant="light"
            endContent={
              <LuSquareArrowOutUpRight
                className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500"
                size={12}
              />
            }>
            <span className="group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500">
              {data.course.owner.fullName}
            </span>
          </Chip>
        </div>
        <div className="flex items-center gap-5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <LuUsers className="w-4 h-4" /> --
            {/* {data.students || 0} */}
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" /> --
            {/* {data.rating || "0.0"} */}
          </span>
        </div>
        <div className="flex items-center gap-4 text-medium text-slate-800 font-medium">
          <span className="inline-flex items-center gap-1">
            {/* <LuTags size={20} />{" "} */}
            {(data.course.discount && data.course.discount.length > 0
              ? finalPrice(data.course.priceAmount, data.course.discount[0].value, data.course.discount[0].type)
              : data.course.priceAmount
            ).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          {/* TODO: change to updated_at */}
          <span>
            {data.status == "PENDING" ? "Submitted " : data.status == "APPROVED" ? "Published " : "Declined "}{" "}
            {formatDate(data.createdAt)}
          </span>
          <span className="mx-2">•</span>
          <button className="inline-flex items-center gap-1 hover:text-slate-700">
            <LuEye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>
    </Card>
  );
}

export function CourseCardList({
  data,
  onPublish,
  onUnpublish,
  onDelete,
  isLoading,
}: {
  data: QueryPublishCourse;
  isLoading: boolean;
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  const qc = useQueryClient();
  const router = useRouter();
  const prefetch = () =>
    qc.prefetchQuery({ queryKey: ["coursePreview", data.id], queryFn: () => courseService.get(data.id) });
  return (
    <Card
      isPressable
      className="grid grid-cols-12 gap-y-3 gap-x-2 p-4 bg-white items-center border-1 shadow-slate-100 rounded-2xl border-slate-200 shadow-lg relative w-full overflow-visible"
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}>
      <span className="absolute -left-1.5 -top-1.5 bg-warning p-1 text-white rounded-full">
        <LuClockAlert size={14} />
      </span>
      <div className="col-span-12 @xl:col-span-6 @5xl:col-span-5 flex items-center gap-3">
        <Image
          src={data.course.coverImage}
          width={96}
          height={56}
          className="object-cover rounded-lg shrink-0"
          alt="course thumnail"
        />
        <div className="flex-1 min-w-0 text-start">
          <p className="font-medium truncate">Lorem ipsum dolor sit amet</p>
          {/* TODO: Change to updated at */}
          <p className="text-xs text-slate-500">
            {data.status == "PENDING" ? "Submitted " : data.status == "APPROVED" ? "Published " : "Declined "}{" "}
            {formatDate(data.createdAt)}
          </p>
        </div>
      </div>
      <div className="col-span-12 @xl:col-span-3 @5xl:col-span-2 flex items-center gap-1 text-slate-600">
        <Chip
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="-ml-1 group/chip"
          avatar={<Avatar name="JW" src={data.course.owner.profilePict} />}
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
      <div className="col-span-6 @xl:col-span-3 @4xl:col-span-2 @5xl:col-span-2 @3xl:justify-center flex items-center text-medium text-slate-800 font-medium @xl:justify-end justify-start">
        {(data.course.discount && data.course.discount.length > 0
          ? finalPrice(data.course.priceAmount, data.course.discount[0].value, data.course.discount[0].type)
          : data.course.priceAmount
        ).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        })}
      </div>
      <div className="@5xl:hidden items-center justify-end absolute top-1.5 right-2">
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
      <div className="hidden @5xl:col-span-3 @5xl:flex justify-end gap-3">
        <Button variant="flat" color="success" radius="sm" isIconOnly className="reset-button px-3 py-2 ">
          <LuFileCheck2 size={16} className="mr-1" />
          Approve
        </Button>
        <Button
          onPress={e => {
            router.push(`/instructor/dashboard/edit-course/${data.id}`);
          }}
          variant="flat"
          color="primary"
          radius="sm"
          isIconOnly
          className="reset-button px-3 py-2">
          <LuFileText size={14} className="mr-1" />
          Notes
        </Button>
        <Button
          onPress={e => {
            confirmDialog({
              title: "Delete Course",
              desc: `This Action is gonna delete course "${data.course.title}"`,
              onConfirmed: () => onDelete(data.id),
              isLoading,
            });
          }}
          variant="flat"
          color="danger"
          radius="sm"
          isIconOnly
          className="reset-button px-3 py-2">
          <LuCircleX size={16} className="mr-1" />
          Decline
        </Button>
      </div>
    </Card>
  );
}

export function CourseCardGridSkeleton() {
  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
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

export function CourseCardListSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white">
      <div className="col-span-12 @xl:col-span-5 flex items-center gap-3">
        <Skeleton className="w-24 h-14 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="col-span-4 @xl:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-4 @xl:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-4 @xl:col-span-2 flex items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
      </div>
      <div className="col-span-12 @xl:col-span-1 flex @xl:justify-end gap-2">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}
