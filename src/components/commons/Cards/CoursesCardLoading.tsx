import { Skeleton } from "@heroui/react";

export function CourseCardGridSkeleton() {
  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <span className="absolute left-3 top-3 text-xs px-6 py-2 rounded-full">
          <Skeleton className="h-4 w-16 rounded-full" />
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <Skeleton className="h-5 w-2/3 rounded-xl" />
          <Skeleton className="h-5 w-10 rounded-xl ml-auto" />
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-3/5 rounded-xl" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-14 rounded-xl" />
          <Skeleton className="h-5 w-14 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-1/2 rounded-full" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-3 w-2/3 rounded-full" />
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
export default function CoursesCardLoading({ layout }: { layout: Layout }) {
  return layout === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CourseCardGridSkeleton key={i} />
      ))}
    </div>
  ) : (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <CourseCardListSkeleton key={i} />
      ))}
    </div>
  );
}
