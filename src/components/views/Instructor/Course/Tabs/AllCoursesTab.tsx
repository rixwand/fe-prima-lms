"use client";
import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import useListCourse from "../../../../../hooks/course/useListCourses";
import CoursesList from "../CoursesList";
import EmptyCourses from "../EmptyCourse";

type Props = {
  onCreate: VoidFn;
};
export default function AllCoursesTab({ onCreate }: Props) {
  const { isLoading, courses } = useListCourse({ limit: 12 });
  useNProgress(hasTrue(isLoading));
  return (
    <CoursesList {...{ courses, isLoading: isLoading.queryLoading }} notFound={<EmptyCourses onCreate={onCreate} />} />
  );
}
