import useCourses from "../../../../../hooks/course/useListPublishRequest";
import NoResult from "../../../../commons/NoResult/NoResult";
import CoursesList from "../CoursesList";

export default function PendingCourses() {
  const { isQueryLoading, queryCourses } = useCourses({ queryParams: { status: "PENDING", limit: 12, page: 1 } });
  return (
    <CoursesList
      {...{ isLoading: isQueryLoading, courses: queryCourses?.courses || [] }}
      notFound={
        <NoResult
          title="No Pending Courses"
          description="There are no courses currently awaiting review or approval."
        />
      }
    />
  );
}
