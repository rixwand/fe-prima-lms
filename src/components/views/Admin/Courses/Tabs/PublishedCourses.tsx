import useCourses from "../../../../../hooks/course/usePublishCourses";
import CoursesList from "../CoursesList";
import NoResult from "../NoResult";

export default function PublishedCourses() {
  const { queryCourses, isLoading } = useCourses({ status: "APPROVED", limit: 12, page: 1 });
  return (
    <CoursesList
      {...{
        isLoading: isLoading.isLoading,
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
