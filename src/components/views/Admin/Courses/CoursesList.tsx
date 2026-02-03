import { CourseCard } from "@/components/commons/Cards/CourseCard";
import NoResult from "@/components/commons/NoResult";
import useDump from "@/hooks/use-dump";
import { useNProgress } from "@/hooks/use-nProgress";
import cn from "@/libs/utils/cn";
import { getCourseStatus } from "@/libs/utils/course";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import CoursesLoading from "../../../commons/Cards/CoursesCardLoading";
import Toolbar from "../../../commons/Toolbar";
import AdminListBoxAction from "./AdminListBoxActions";

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
  useNProgress(isLoading);
  const router = useRouter();
  useDump(courses);

  return (
    <div className="pt-5 border-t border-slate-200">
      <Toolbar setLayout={setLayout} handleSearch={() => {}} />
      <div className="">
        {isLoading ? (
          <CoursesLoading layout={layout} />
        ) : courses.length == 0 ? (
          notFound
        ) : (
          <div
            className={cn(
              layout == "grid"
                ? "grid grid-cols-1 @lg:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4"
                : "space-y-2",
            )}>
            {courses?.map(c => (
              <CourseCard
                layout={layout}
                key={c.id}
                data={{
                  ...c.course,
                  ...c.course.metaDraft,
                  id: c.courseId,
                  createdAt: c.createdAt,
                  status: getCourseStatus({ ...c.course, publishRequest: { id: c.id, notes: "", status: c.status } }),
                  requestType: c.type,
                  publishedRequestStatus: c.status,
                }}
                onPress={() => {
                  return c.type == "NEW"
                    ? router.push(`/admin/dashboard/course/${c.courseId}`)
                    : router.push(`/admin/dashboard/course/${c.courseId}/review-changes`);
                }}
                LisBoxActions={
                  <AdminListBoxAction
                    courseTitle={c.course.metaDraft.title}
                    courseStatus={c.status}
                    reqId={c.id}
                    courseId={c.courseId}
                  />
                }
                owner={c.course.owner}
                unPressable={c.status == "REJECTED"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
