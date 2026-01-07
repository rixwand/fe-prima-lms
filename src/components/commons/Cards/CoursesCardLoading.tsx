import { CourseCardGridSkeleton, CourseCardListSkeleton } from "./CourseCards";

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
