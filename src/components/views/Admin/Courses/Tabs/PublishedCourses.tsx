import useCourses from "../../../../../hooks/course/useListPublishRequest";
import NoResult from "../../../../commons/NoResult/NoResult";
import CoursesList from "../CoursesList";

export default function PublishedCourses() {
  const { queryCourses, isQueryLoading } = useCourses({ queryParams: { status: "APPROVED", limit: 12, page: 1 } });
  return (
    <CoursesList
      {...{
        isLoading: isQueryLoading,
        courses: queryCourses?.courses || [],
      }}
      notFound={
        <NoResult
          title="No Courses Found"
          description="No courses are currently published. Some courses may still be pending review or approval."
        />
      }
    />
  );
}
