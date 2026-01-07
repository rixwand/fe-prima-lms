import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import usePublishCourses from "../../../../../hooks/course/usePublishCourses";
import CoursesList from "../CoursesList";

export default function AllCourses() {
  const { queryCourses, isLoading, refetch } = usePublishCourses({ limit: 12, page: 1 });
  useNProgress(hasTrue(isLoading));
  return <CoursesList {...{ isLoading: isLoading.isLoading, courses: queryCourses?.courses || [] }} />;
}
