import { aVoidFn } from "@/libs/utils/function";
import { useState } from "react";
import { PendingCourseCardGrid, PendingCourseCardList } from "./Cards/PendingCourseCard";
import {
  PublishedCourseCardGrid,
  PublishedCourseCardGridSkeleton,
  PublishedCourseCardList,
  PublishedCourseCardListSkeleton,
} from "./Cards/PublishedCourseCard";
import NoResult from "./NoResult";
import Toolbar from "./Toolbar";

export default function AllCourses({
  courses,
  isLoading,
}: // layout,
{
  courses: ICourseListItem[];

  // layout: Layout;
  isLoading: boolean;
}) {
  const [layout, setLayout] = useState<Layout>("grid");
  return (
    <div className="pt-5 border-t border-slate-200">
      <Toolbar setLayout={setLayout} handleSearch={() => {}} />
      <div className="overflow-x-auto">
        {isLoading ? (
          layout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <PublishedCourseCardGridSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <PublishedCourseCardListSkeleton key={i} />
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
            {courses?.map(c => {
              console.log(c.title, " = ", c.status);
              return c.status === "PENDING" ? (
                <PendingCourseCardGrid
                  key={c.id}
                  data={c}
                  onPublish={aVoidFn}
                  onUnpublish={aVoidFn}
                  onDelete={aVoidFn}
                  isLoading={false}
                />
              ) : (
                <PublishedCourseCardGrid
                  key={c.id}
                  data={c}
                  onPublish={aVoidFn}
                  onUnpublish={aVoidFn}
                  onDelete={aVoidFn}
                  isLoading={false}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {courses?.map(c =>
              c.status == "PUBLISHED" ? (
                <PublishedCourseCardList
                  key={c.id}
                  data={c}
                  onPublish={aVoidFn}
                  onUnpublish={aVoidFn}
                  onDelete={aVoidFn}
                  isLoading={false}
                />
              ) : (
                <PendingCourseCardList
                  key={c.id}
                  data={c}
                  onPublish={aVoidFn}
                  onUnpublish={aVoidFn}
                  onDelete={aVoidFn}
                  isLoading={false}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
