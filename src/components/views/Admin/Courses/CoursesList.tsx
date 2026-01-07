import { CourseCardGrid, CourseCardList } from "@/components/commons/Cards/CourseCards";
import { useNProgress } from "@/hooks/use-nProgress";
import { aVoidFn } from "@/libs/utils/function";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import CoursesLoading from "../../../commons/Cards/CoursesCardLoading";
import Toolbar from "../../../commons/Toolbar";
import AdminListBoxAction from "./AdminListBoxActions";
import NoResult from "./NoResult";

export default function CoursesList({
  courses,
  isLoading,
  notFound = <NoResult title="No Courses Found" description="No courses available." />,
}: {
  courses: QueryPublishCourse[];
  isLoading: boolean;
  notFound?: ReactNode;
}) {
  const [layout, setLayout] = useState<Layout>("grid");
  // const { queryCourses, isLoading: queryLoading } = useCourses();
  useNProgress(isLoading);
  const router = useRouter();
  return (
    <div className="pt-5 border-t border-slate-200">
      <Toolbar setLayout={setLayout} handleSearch={() => {}} />
      <div className="overflow-x-auto">
        {isLoading ? (
          <CoursesLoading layout={layout} />
        ) : courses.length == 0 ? (
          notFound
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 @lg:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
            {courses?.map(c => (
              <CourseCardGrid
                key={c.id}
                data={{
                  ...c.course,
                  id: c.id,
                  createdAt: c.createdAt,
                  status: c.status,
                }}
                onPress={() => {
                  router.push(`/admin/dashboard/course/${c.id}`);
                }}
                PopoverContentAction={<AdminListBoxAction courseId={c.id} courseStatus={c.status} />}
                owner={c.course.owner}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {courses?.map(c => (
              <CourseCardList
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
