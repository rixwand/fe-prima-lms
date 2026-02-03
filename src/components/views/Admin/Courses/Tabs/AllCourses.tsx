import usePublishCourses from "../../../../../hooks/course/useListPublishRequest";
import CoursesList from "../CoursesList";

export default function AllCourses() {
  const { queryCourses, isQueryLoading } = usePublishCourses({ queryParams: { limit: 12, page: 1 } });
  return <CoursesList {...{ isLoading: isQueryLoading, courses: queryCourses?.courses || [] }} />;
}
