import NotFound from "@/components/commons/NotFound";
import LearnLayout from "@/components/layouts/LearnLayout";
import CurriculumNav from "@/components/views/Admin/Courses/CurriculumView/CurriculumNav";
import Lessonview from "@/components/views/Admin/Courses/CurriculumView/LessonView";
import NoLessonMessage from "@/components/views/Instructor/Course/EditCourse/NoLessonMessage";
import { useNProgress } from "@/hooks/use-nProgress";
import { CurriculumViewContext, LessonPathIds } from "@/libs/context/CurriculumViewContext";
import { findFirstSelectableLesson } from "@/libs/utils/course";
import courseQueries from "@/queries/course-queries";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
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

  await queryClient.prefetchQuery(courseQueries.options.listSections(courseId));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: courseId,
    },
    revalidate: 60,
  };
};

export default function CurriculumPagePreview({ id }: { id: number }) {
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.listSections(id));
  const hasNoContent = !data || data.length === 0 || data.every(s => !s.lessons || s.lessons.length === 0);
  const [activeLesson, setActiveLesson] = useState<LessonPathIds | null>(null);
  const onSelect = (section: CourseSection, lesson: Lesson) => {
    setActiveLesson({ sectionId: section.id!, lessonId: lesson.id!, courseId: id });
  };

  useNProgress(isPending);
  // useQueryError({ isError, error });
  useEffect(() => {
    if (!data?.length) return;
    const active = findFirstSelectableLesson(data);
    if (!active) return;
    setActiveLesson({
      courseId: id,
      sectionId: active.section.id,
      lessonId: active.lesson.id,
    });
  }, [data, id]);
  if (isFetching || isPending) return null;
  if (isError) {
    return <NotFound error={error} />;
  }

  if (hasNoContent) {
    return <NoLessonMessage />;
  }

  return (
    <LearnLayout title="Preview Kursus">
      <CurriculumViewContext.Provider value={{ activeLesson, setActiveLesson, onSelect }}>
        <CurriculumNav courseId={id} sections={data}>
          {activeLesson != null ? <Lessonview activeLesson={activeLesson} /> : <p>Select a lesson</p>}
        </CurriculumNav>
      </CurriculumViewContext.Provider>
    </LearnLayout>
  );
}
