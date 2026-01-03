import NotFound from "@/components/commons/NotFound";
import CurriculumNav from "@/components/views/Admin/Courses/CurriculumView/CurriculumNav";
import Lessonview from "@/components/views/Admin/Courses/CurriculumView/LessonView";
import NoLessonMessage from "@/components/views/Instructor/Course/EditCourse/NoLessonMessage";
import { useNProgress } from "@/hooks/use-nProgress";
import { CurriculumViewContext, LessonPathIds } from "@/libs/context/CurriculumViewContext";
import courseSectionService from "@/services/course-section.service";
import { QueryClient, dehydrate, keepPreviousData, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const idParam = params?.id;
  const courseId = Number(Array.isArray(idParam) ? idParam[0] : idParam);

  if (!Number.isFinite(courseId) || courseId <= 0) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courseSections", courseId],
    queryFn: () => courseSectionService.list(courseId).then(res => res.data),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: courseId,
    },
    revalidate: 60,
  };
};

export default function CurriculumPagePreview({ id }: { id: number }) {
  const { data, isPending, isFetching, isError, error } = useQuery<{
    courseTitle: string;
    sections: CourseSection[];
  }>({
    queryKey: ["courseSections", id],
    queryFn: () => courseSectionService.list(id).then(res => res.data),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
  const hasNoContent =
    data &&
    (!data.sections || data.sections.length === 0 || data.sections.every(s => !s.lessons || s.lessons.length === 0));
  const [activeLesson, setActiveLesson] = useState<LessonPathIds | null>(null);
  const onSelect = (section: CourseSection, lesson: Lesson) => {
    setActiveLesson({ sectionId: section.id!, lessonId: lesson.id!, courseId: id });
  };

  useNProgress(isPending);
  // useQueryError({ isError, error });
  useEffect(() => {
    if (data && data.sections && data.sections.length > 0) {
      setActiveLesson({
        courseId: id,
        lessonId: data.sections[0].lessons[0].id,
        sectionId: data.sections[0].id,
      });
    }
  }, [data?.sections]);

  if (!data && !isPending && !isFetching) {
    return isAxiosError(error) ? (
      <NotFound code={error.status} message={error.response?.statusText} />
    ) : (
      <NotFound message="Course Not Found." />
    );
  }

  if (!data) {
    return null;
  }

  if (data && !isPending && !isFetching && hasNoContent) {
    return <NoLessonMessage />;
  }

  return (
    <CurriculumViewContext.Provider value={{ activeLesson, setActiveLesson, onSelect }}>
      <CurriculumNav courseTitle={data.courseTitle} sections={data.sections}>
        {activeLesson != null ? <Lessonview activeLesson={activeLesson} /> : <p>Select a lesson</p>}
      </CurriculumNav>
    </CurriculumViewContext.Provider>
  );
}
