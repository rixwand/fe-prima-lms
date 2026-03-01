import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import SimpleEditorLayout from "@/components/layouts/SimpleEditorLayout";
import LessonEditor from "@/components/views/Instructor/Course/EditCourse/LessonEditor/LessonEditor";
import NoLessonMessage from "@/components/views/Instructor/Course/EditCourse/NoLessonMessage";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { LessonEditorContext } from "@/libs/context/LessonEditorContext";
import courseQueries from "@/queries/course-queries";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";

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

export default function CurriculumPage({ id }: { id: number }) {
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.getCourse(id));
  const lessonState = useState<Lesson | null>(null);
  const [activeLesson] = lessonState;
  const currentDirtyState = useState(false);

  const contextValue = useMemo(() => {
    if (activeLesson) {
      return {
        ids: {
          courseId: id,
          sectionId: activeLesson.sectionId,
          lessonId: activeLesson.id,
        },
        activeLesson,
      };
    }
    return undefined;
  }, [activeLesson, id]);

  useNProgress(isPending);
  useQueryError({ isError, error });
  useEffect(() => {
    console.log(data);
  }, [data]);
  if (!data && !isPending && !isFetching) {
    return <NotFound error={error} />;
  }

  if (!data) {
    return null;
  }
  const hasNoContent =
    !data.sections || data.sections.length === 0 || data.sections.every(s => !s.lessons || s.lessons.length === 0);

  if (data && !isPending && !isFetching && hasNoContent) {
    return (
      <>
        <PageHead title="Edit Course" />
        <SimpleEditorLayout courseTitle={data.metaDraft.title} lessonState={[null, () => {}]} structure={[]}>
          <NoLessonMessage courseId={id} />
        </SimpleEditorLayout>
      </>
    );
  }

  return (
    <LessonEditorContext.Provider value={{ ...contextValue, currentDirtyState, courseId: id }}>
      <PageHead title="Edit Course" />
      <SimpleEditorLayout
        courseTitle={data.metaDraft.title || ""}
        lessonState={lessonState}
        structure={data.sections || []}>
        {activeLesson ? (
          <LessonEditor lessonState={lessonState} />
        ) : (
          <NoLessonMessage title="No Lesson Selected" desc="Select a lesson to start editing" />
        )}
      </SimpleEditorLayout>
    </LessonEditorContext.Provider>
  );
}
