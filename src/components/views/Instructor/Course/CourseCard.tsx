import { cn } from "@/lib/tiptap-utils";
import { finalPrice, formatRupiah } from "@/libs/utils/currency";
import { formatDate } from "@/libs/utils/string";
import courseService from "@/services/course.service";
import { Button, Card, Chip, Skeleton } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuEye, LuGlobe, LuPencil, LuStar, LuTrash2, LuUsers } from "react-icons/lu";
import { PiMoneyWavyLight } from "react-icons/pi";
import { confirmDialog } from "../../../commons/Dialog/confirmDialog";

export function CourseCardGrid({
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
      className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-100">
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
        <span
          className={cn(
            "absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full backdrop-blur",
            data.status === "PUBLISHED"
              ? "bg-emerald-600/90 text-white"
              : data.status === "DRAFT"
              ? "bg-amber-500/90 text-white"
              : "bg-slate-500/90 text-white"
          )}>
          {data.status}
        </span>
        <Chip
          className="absolute left-3 top-3 text-xs shadow-sm text-white tracking-wider"
          color="warning"
          variant="shadow">
          DRAFT
        </Chip>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold flex-1 leading-snug text-start">{data.title}</h3>
          <button
            onClick={e => {
              e.preventDefault();
            }}
            className="ml-auto p-1.5 rounded-lg hover:bg-slate-100">
            <FiMoreHorizontal className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <LuUsers className="w-4 h-4" /> {data.students || 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" /> {data.rating || "0.0"}
          </span>
          <span className="inline-flex items-center gap-1">
            <PiMoneyWavyLight size={20} />{" "}
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
          <span>Updated {formatDate(data.createdAt)}</span>
          <span className="mx-2">•</span>
          <button className="inline-flex items-center gap-1 hover:text-slate-700">
            <LuEye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
        <div className="flex items-center gap-2 pt-2 pb-1">
          {data.status !== "PUBLISHED" ? (
            <Button variant="flat" color="secondary" radius="sm" isIconOnly className="reset-button px-3 py-2 ">
              <LuGlobe size={16} className="mr-1" />
              Publish
            </Button>
          ) : (
            <button
              onClick={e => {
                e.preventDefault();
                onUnpublish(data.id);
              }}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600">
              Unpublish
            </button>
          )}
          <Button
            onPress={e => {
              router.push(`/instructor/dashboard/edit-course/${data.id}`);
            }}
            variant="flat"
            color="primary"
            radius="sm"
            isIconOnly
            className="reset-button px-3 py-2">
            <LuPencil size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            onPress={e => {
              confirmDialog({
                title: "Delete Course",
                desc: `This Action is gonna delete course "${data.title}"`,
                onConfirmed: () => onDelete(data.id),
                isLoading,
              });
            }}
            variant="flat"
            color="danger"
            radius="sm"
            isIconOnly
            className="reset-button px-3 py-2 ml-auto">
            <LuTrash2 size={16} className="mr-1" />
            Delete
          </Button>
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
  data: ICourseListItem;
  isLoading: boolean;
  onPublish: (id: number) => void;
  onUnpublish: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const qc = useQueryClient();
  const prefetch = () =>
    qc.prefetchQuery({ queryKey: ["coursePreview", data.id], queryFn: () => courseService.get(data.id) });
  return (
    <section
      className="grid grid-cols-12 gap-4 p-4 bg-white items-center border-1 shadow-slate-100 rounded-2xl border-slate-200 shadow-lg"
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={prefetch}>
      <div className="col-span-12 md:col-span-5 flex items-center gap-3">
        <img src={data.coverImage} alt={data.title} className="w-24 h-14 rounded-lg object-cover" />
        <div>
          <p className="font-medium">{data.title}</p>
          {/* TODO: Change to updated at */}
          <p className="text-xs text-slate-500">Updated {formatDate(data.createdAt)}</p>
        </div>
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1 text-slate-600">
        <LuUsers className="w-4 h-4" /> {data.students || 0}
      </div>
      <div className="col-span-4 md:col-span-1 flex items-center gap-1 text-slate-600">
        <LuStar className="w-4 h-4" /> {data.rating || 0}
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1 text-slate-600">
        <PiMoneyWavyLight size={20} /> {formatRupiah(data.priceAmount)}
      </div>
      <div className="col-span-12 md:col-span-2 flex md:justify-end gap-3">
        {data.status !== "PUBLISHED" ? (
          <Button variant="flat" color="secondary" radius="sm" isIconOnly className="reset-button px-3 py-2">
            <LuGlobe size={16} className="mr-1" />
            Publish
          </Button>
        ) : (
          // <button onClick={() => onPublish(data.id)} className="px-3 h-9 rounded-lg bg-blue-600 text-white text-sm">
          //   Publish
          // </button>
          <Link
            href={`/instructor/dashboard/course/${data.id}`}
            className="px-3 h-9 rounded-lg bg-amber-500 text-white text-sm">
            Preview
          </Link>
        )}
        <Button variant="flat" color="primary" radius="sm" isIconOnly className="reset-button px-3 py-2">
          <LuPencil size={14} className="mr-1" />
          Edit
        </Button>
        <Button variant="flat" color="danger" radius="sm" isIconOnly className="reset-button px-3 py-2">
          <LuTrash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </section>
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
