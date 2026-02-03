import useCourses from "../../../../../hooks/course/useListPublishRequest";
import NoResult from "../../../../commons/NoResult/NoResult";
import CoursesList from "../CoursesList";

export default function RejectedCourses() {
  const { isQueryLoading, queryCourses } = useCourses({ queryParams: { status: "REJECTED", limit: 12, page: 1 } });
  return (
    <CoursesList
      {...{ isLoading: isQueryLoading, courses: queryCourses?.courses || [] }}
      notFound={<NoResult title="No Rejected Courses" description="There are no courses that rejected for publish" />}
    />
  );
}
