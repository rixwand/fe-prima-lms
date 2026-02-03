import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { formatDate } from "@/libs/utils/string";
import courseService from "@/services/course.service";
import { Avatar, Button, Card, Chip, Popover, PopoverContent, PopoverTrigger, PressEvent } from "@heroui/react";
import { OverlayTriggerState, useOverlayTriggerState } from "@react-stately/overlays";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ComponentType, ReactNode } from "react";
import { IconType } from "react-icons";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  LuBookmark,
  LuClockAlert,
  LuEye,
  LuGlobe,
  LuGlobeLock,
  LuSquareArrowOutUpRight,
  LuStar,
  LuUsers,
} from "react-icons/lu";

type AdminListBoxActionProps = {
  courseStatus: string;
  courseId: number;
  menuState: OverlayTriggerState;
};

export type LisBoxActionsType = ComponentType<AdminListBoxActionProps>;

type CourseCardData = {
  id: number;
  title: string;
  status: string;
  coverImage: string;
  priceAmount: number;
  // isFree: boolean;
  createdAt: string;
  discount?: Discount[] | undefined;
  draftDiscounts?: Discount[] | undefined;
  students?: number;
  rating?: number;
  canApplyTierB?: boolean;
  requiresApproval?: boolean;
  requestType?: "NEW" | "UPDATE";
  publishedAt?: string;
  publishedRequestStatus?: CourseStatus;
};

type CourseStatus = "PENDING" | "APPROVED" | "PUBLISHED" | "DRAFT" | "REJECTED";

const STATUS_CONFIG: Record<
  CourseStatus,
  {
    icon: IconType;
    color: "warning" | "success" | "primary" | "danger";
    label?: string;
  }
> = {
  PENDING: {
    icon: LuClockAlert,
    color: "warning",
  },
  APPROVED: {
    icon: LuGlobe,
    color: "success",
    label: "PUBLISHED",
  },
  PUBLISHED: {
    icon: LuGlobe,
    color: "success",
  },
  DRAFT: {
    icon: LuBookmark,
    color: "primary",
  },
  REJECTED: {
    icon: LuGlobeLock,
    color: "danger",
  },
};

export function CourseCard({
  data,
  LisBoxActions,
  onPress,
  owner,
  layout = "grid",
  unPressable,
}: {
  layout?: "grid" | "list";
  data: CourseCardData;
  LisBoxActions: ReactNode;
  onPress: (e: PressEvent) => void;
  owner?: { fullName: string; profilePict: string };
  unPressable?: boolean;
}) {
  const qc = useQueryClient();
  const prefetch = () =>
    qc.prefetchQuery({ queryKey: ["coursePreview", data.id], queryFn: () => courseService.get(data.id) });
  const status = data.status as CourseStatus;
  const { icon: Icon, color, label } = STATUS_CONFIG[status];
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  if (layout == "grid")
    return (
      <Card
        as={"div"}
        isPressable={!unPressable}
        onPress={onPress}
        onFocus={prefetch}
        onClick={prefetch}
        className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-100 justify-between max-h-fit">
        <div>
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
            <Chip
              startContent={<Icon size={16} />}
              classNames={{ content: "px-1 font-medium" }}
              className="absolute left-3 top-3 text-xs shadow-sm tracking-wider text-white"
              color={color}
              variant="solid">
              {label ?? status}
            </Chip>
          </div>
          <div className="flex items-start gap-2 px-4 mt-4 mb-2">
            <h3 className="font-semibold flex-1 leading-snug text-start">{data.title}</h3>
            <Popover state={menuState} triggerType="listbox" placement="bottom-end" radius="sm">
              <PopoverTrigger>
                <Button
                  disabled={unPressable}
                  isIconOnly
                  variant="light"
                  className="ml-auto reset-button py-0.5 px-1 rounded-lg hover:bg-slate-100">
                  <FiMoreHorizontal size={20} className="text-slate-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-44">{LisBoxActions}</PopoverContent>
            </Popover>
          </div>
        </div>
        {data.canApplyTierB && (
          <div className="px-4 flex gap-x-2 mb-2 text-xs items-center">
            <span className="w-2.5 h-2.5 bg-warning rounded-full"></span>
            <span>[Major Change] Action required</span>
          </div>
        )}
        {data.requiresApproval && (
          <div className="px-4 flex gap-x-2 mb-2 text-xs items-center">
            <span className="w-2.5 h-2.5 bg-danger rounded-full"></span>
            <span>
              [Critical Change]{" "}
              {data.publishedRequestStatus == "PENDING" && data.publishedAt
                ? "Pending Approval"
                : data.publishedRequestStatus == "REJECTED" && data.publishedAt
                  ? "Update Rejected"
                  : "Requires Approval"}
            </span>
          </div>
        )}
        {data.status == "PENDING" && data.requestType == "NEW" ? (
          <div className="px-4 flex gap-x-2 mb-2 text-sm items-center">
            <span className="w-2.5 h-2.5 bg-success rounded-full"></span>
            <span>[New Course] Requires approval</span>
          </div>
        ) : data.status == "PENDING" && data.requestType == "UPDATE" ? (
          <div className="px-4 flex gap-x-2 mb-2 text-sm items-center">
            <span className="w-2.5 h-2.5 bg-danger rounded-full"></span>
            <span>[Course Update] Requires approval</span>
          </div>
        ) : null}
        <div className="px-4 pb-4 space-y-2">
          {/* <div className="flex items-start gap-2">
            <h3 className="font-semibold flex-1 leading-snug text-start">{data.title}</h3>
            <Popover state={menuState} triggerType="listbox" placement="bottom-end" radius="sm">
              <PopoverTrigger>
                <Button
                  disabled={unPressable}
                  isIconOnly
                  variant="light"
                  className="ml-auto reset-button py-0.5 px-1 rounded-lg hover:bg-slate-100">
                  <FiMoreHorizontal size={20} className="text-slate-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-44">{LisBoxActions}</PopoverContent>
            </Popover>
          </div> */}
          {owner && (
            <div className="items-start w-full flex">
              <Chip
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="-ml-1 group/chip"
                avatar={<Avatar name="JW" src={owner.profilePict} />}
                variant="light"
                endContent={
                  <LuSquareArrowOutUpRight
                    className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500"
                    size={12}
                  />
                }>
                <span className="group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500">
                  {owner.fullName}
                </span>
              </Chip>
            </div>
          )}
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <LuUsers className="w-4 h-4" />
              {data.students || "--"}
            </span>
            <span className="inline-flex items-center gap-1">
              <LuStar className="w-4 h-4" />
              {data.rating || "--"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-medium text-slate-800 font-medium">
            <span className="inline-flex items-center gap-1">
              {(data.draftDiscounts && data.draftDiscounts.length > 0
                ? finalPrice(data.priceAmount, data.draftDiscounts[0].value, data.draftDiscounts[0].type)
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
            <span>
              {status == "PENDING"
                ? "Submitted "
                : status == "APPROVED" || status == "PUBLISHED"
                  ? "Published "
                  : status == "DRAFT"
                    ? "Updated "
                    : "Declined "}
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
  else
    return (
      <Card
        disableRipple
        isPressable
        as={"div"}
        className="grid @2xl:grid-cols-12 gap-y-3 gap-x-2 p-4 bg-white items-center border-1 shadow-slate-100 rounded-2xl border-slate-200 shadow-lg relative w-full overflow-visible"
        onClick={prefetch}>
        <span className={cn("absolute -left-1.5 -top-1.5  p-1 text-white rounded-full", `bg-${color}`)}>
          <Icon size={14} />
        </span>
        <div className={cn("col-span-12 @5xl:col-span-4 flex items-center gap-3", !owner && "@2xl:col-span-6")}>
          <div className="relative w-24 h-14 shrink-0">
            <Image src={data.coverImage} fill className="object-cover rounded-lg" alt="course thumbnail" />
          </div>
          <div className="flex-1 min-w-0 text-start">
            <p className="font-medium truncate">{data.title}</p>
            {/* TODO: Change to updated at */}
            <p className="text-xs text-slate-500">
              {data.status == "PENDING" ? "Submitted " : data.status == "APPROVED" ? "Published " : "Declined "}
              {formatDate(data.createdAt)}
            </p>
          </div>
        </div>
        {owner ? (
          <div className="col-span-12 @2xl:col-span-6 @5xl:col-span-3 flex items-center gap-1 text-slate-600 min-w-0 flex-1">
            <Chip
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              classNames={{
                content: "group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500 truncate",
              }}
              className="-ml-1 group/chip w-full overflow-hidden min-w-0"
              avatar={<Avatar name="JW" src={owner.profilePict} />}
              variant="light"
              endContent={
                <LuSquareArrowOutUpRight
                  className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500 shrink-0"
                  size={12}
                />
              }>
              {/* {owner.fullName} */}
              Mr. Really long name
            </Chip>
          </div>
        ) : (
          <div className="hidden @5xl:flex @5xl:col-span-3 items-center gap-1 text-slate-600 min-w-0 flex-1"></div>
        )}
        <div className="flex @2xl:col-span-3 @5xl:col-span-2 col-span-6 items-center gap-x-7 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <LuUsers className="w-4 h-4" />
            {data.students || "--"}
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" />
            {data.rating || "--"}
          </span>
        </div>
        <div className="col-span-6 @2xl:col-span-3 @5xl:col-span-2 @3xl:justify-center flex items-center text-medium text-slate-800 font-medium justify-self-end justify-end">
          {(data.draftDiscounts && data.draftDiscounts.length > 0
            ? finalPrice(data.priceAmount, data.draftDiscounts[0].value, data.draftDiscounts[0].type)
            : data.priceAmount
          ).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          })}
        </div>
        <div
          className={cn(
            "items-center justify-end flex absolute @5xl:relative @5xl:col-span-1 @5xl:justify-self-end top-1.5 right-2 @5xl:top-0 @5xl:right-0",
            // "items-center",
            // "justify-end",
            // "flex",
            // "absolute",
            // "@5xl:relative",
            // "@5xl:col-span-1",
            // "@5xl:justify-self-end",
            // "top-1.5",
            // "right-2",

            // "justify-self-end col-span-1"
          )}>
          <Popover state={menuState} triggerType="listbox" placement="bottom-end" radius="sm">
            <PopoverTrigger>
              <Button isIconOnly variant="light" className="reset-button py-0.5 px-1 rounded-lg hover:bg-slate-100">
                <FiMoreHorizontal size={20} className="text-slate-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-44">
              {/* <PopoverContext.Provider value={{ menuState }}>{LisBoxActions}</PopoverContext.Provider> */}
              {LisBoxActions}
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    );
}
