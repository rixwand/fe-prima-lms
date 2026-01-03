import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import CoursesList from "../CoursesList";
import useCourses from "../useCourses";

export default function AllCourses() {
  const { queryCourses, isLoading, refetch } = useCourses({ limit: 12, page: 1 });
  useNProgress(hasTrue(isLoading));
  return <CoursesList {...{ isLoading: isLoading.isLoading, courses: queryCourses?.courses || [] }} />;
}
