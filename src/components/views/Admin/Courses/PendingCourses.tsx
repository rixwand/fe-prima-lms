import { aVoidFn } from "@/libs/utils/function";
import { useState } from "react";
import {
  PendingCourseCardGrid,
  PendingCourseCardGridSkeleton,
  PendingCourseCardList,
  PendingCourseCardListSkeleton,
} from "./Cards/PendingCourseCard";
import NoResult from "./NoResult";
import Toolbar from "./Toolbar";

export default function PendingCourses({ courses, isLoading }: { courses: ICourseListItem[]; isLoading: boolean }) {
  const [layout, setLayout] = useState<Layout>("grid");
  return (
    <div className="border-t border-slate-200 pt-5">
      <Toolbar handleSearch={() => {}} setLayout={setLayout} />
      <div className="">
        {isLoading ? (
          layout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PendingCourseCardGridSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
              {Array.from({ length: 4 }).map((_, i) => (
                <PendingCourseCardListSkeleton key={i} />
              ))}
            </div>
          )
        ) : courses.length == 0 ? (
          <NoResult
            title="No pending courses found"
            description="There are no pending courses matching your search query."
          />
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
            {courses?.map(c => (
              <PendingCourseCardGrid
                key={c.id}
                data={c}
                onPublish={aVoidFn}
                onUnpublish={aVoidFn}
                onDelete={aVoidFn}
                isLoading={false}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {courses?.map(c => (
              <PendingCourseCardList
                key={c.id}
                data={c}
                onPublish={aVoidFn}
                onUnpublish={aVoidFn}
                onDelete={aVoidFn}
                isLoading={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
