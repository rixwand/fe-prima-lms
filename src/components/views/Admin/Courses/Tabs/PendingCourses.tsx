import useCourses from "../../../../../hooks/course/usePublishCourses";
import CoursesList from "../CoursesList";
import NoResult from "../NoResult";

export default function PendingCourses() {
  const { isLoading, queryCourses } = useCourses({ status: "PENDING", limit: 12, page: 1 });
  return (
    <CoursesList
      {...{ isLoading: isLoading.isLoading, courses: queryCourses?.courses || [] }}
      notFound={
        <NoResult
          title="No Pending Courses"
          description="There are no courses currently awaiting review or approval."
        />
      }
    />
  );
}
