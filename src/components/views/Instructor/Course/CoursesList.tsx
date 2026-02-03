import { CourseCard } from "@/components/commons/Cards/CourseCard";
import CoursesCardLoading from "@/components/commons/Cards/CoursesCardLoading";
import NoResult from "@/components/commons/NoResult";
import Toolbar from "@/components/commons/Toolbar";
import { useNProgress } from "@/hooks/use-nProgress";
import cn from "@/libs/utils/cn";
import { getCourseStatus } from "@/libs/utils/course";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import InstructorListBoxAction from "./InstructorListBoxAction";

export default function CoursesList({
  courses,
  isLoading,
  notFound = <NoResult title="No Courses Found" description="No courses available." />,
}: {
  courses?: CourseListItem[];
  isLoading: boolean;
  notFound?: ReactNode;
}) {
  const [layout, setLayout] = useState<Layout>("grid");
  useNProgress(isLoading);
  const router = useRouter();
  return (
    <div className="border-t border-slate-200 pt-5">
      <Toolbar handleSearch={() => {}} setLayout={setLayout} />
      {isLoading ? (
        <CoursesCardLoading layout={layout} />
      ) : !courses || courses?.length === 0 ? (
        notFound
      ) : (
        <div
          className={cn(
            layout == "grid" ? "grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4" : "space-y-2",
          )}>
          {courses?.map(({ metaDraft, ...c }) => (
            <CourseCard
              layout={layout}
              key={c.id}
              data={{
                ...{ ...c, ...metaDraft },
                status: getCourseStatus({ ...c, metaDraft }),
                publishedRequestStatus: c.publishRequest?.status,
              }}
              onPress={e => {
                router.push(`/instructor/dashboard/course/${c.id}`);
              }}
              LisBoxActions={
                <InstructorListBoxAction courseId={c.id} courseStatus={getCourseStatus({ ...c, metaDraft })} />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
