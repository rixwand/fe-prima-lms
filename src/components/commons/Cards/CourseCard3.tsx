import cn from "@/libs/utils/cn";
import { formatRupiah } from "@/libs/utils/currency";
import { formatDate } from "@/libs/utils/string";
import { FiMoreHorizontal } from "react-icons/fi";
import { LuEye, LuPencilLine, LuStar, LuTrash2, LuUsers } from "react-icons/lu";
import { PiMoneyWavyLight } from "react-icons/pi";

export type TCourseStatus = "draft" | "published" | "archived";
export type TCourseCard = {
  id: string;
  title: string;
  cover: string;
  students: number;
  rating: number;
  revenue: number;
  updatedAt: string;
  status: TCourseStatus;
};
export function CourseCardGrid({
  data,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  data: TCourseCard;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={data.cover}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <span
          className={cn(
            "absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full backdrop-blur",
            data.status === "published"
              ? "bg-emerald-600/90 text-white"
              : data.status === "draft"
              ? "bg-amber-500/90 text-white"
              : "bg-slate-500/90 text-white"
          )}>
          {data.status}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold flex-1 leading-snug">{data.title}</h3>
          <button className="ml-auto p-1.5 rounded-lg hover:bg-slate-100">
            <FiMoreHorizontal className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <LuUsers className="w-4 h-4" /> {data.students}
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" /> {data.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <PiMoneyWavyLight size={20} /> {formatRupiah(data.revenue)}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          <span>Updated {formatDate(data.updatedAt)}</span>
          <span className="mx-2">•</span>
          <button className="inline-flex items-center gap-1 hover:text-slate-700">
            <LuEye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
        <div className="flex items-center gap-2 pt-2">
          {data.status !== "published" ? (
            <button
              onClick={() => onPublish(data.id)}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              Publish
            </button>
          ) : (
            <button
              onClick={() => onUnpublish(data.id)}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600">
              Unpublish
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">
            <LuPencilLine className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="ml-auto inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-rose-200 text-rose-600 text-sm hover:bg-rose-50">
            <LuTrash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function CourseCardList({
  data,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  data: TCourseCard;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white">
      <div className="col-span-12 md:col-span-5 flex items-center gap-3">
        <img src={data.cover} alt={data.title} className="w-24 h-14 rounded-lg object-cover" />
        <div>
          <p className="font-medium">{data.title}</p>
          <p className="text-xs text-slate-500">Updated {formatDate(data.updatedAt)}</p>
        </div>
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1 text-slate-600">
        <LuUsers className="w-4 h-4" /> {data.students}
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1 text-slate-600">
        <LuStar className="w-4 h-4" /> {data.rating}
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center gap-1 text-slate-600">
        <PiMoneyWavyLight size={20} /> {formatRupiah(data.revenue)}
      </div>
      <div className="col-span-12 md:col-span-1 flex md:justify-end gap-2">
        {data.status !== "published" ? (
          <button onClick={() => onPublish(data.id)} className="px-3 h-9 rounded-lg bg-blue-600 text-white text-sm">
            Publish
          </button>
        ) : (
          <button onClick={() => onUnpublish(data.id)} className="px-3 h-9 rounded-lg bg-amber-500 text-white text-sm">
            Unpublish
          </button>
        )}
        <button className="px-3 h-9 rounded-lg border border-slate-200 text-sm">Edit</button>
        <button
          onClick={() => onDelete(data.id)}
          className="px-3 h-9 rounded-lg border border-rose-200 text-rose-600 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}
