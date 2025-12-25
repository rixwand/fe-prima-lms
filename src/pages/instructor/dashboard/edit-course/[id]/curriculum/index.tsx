import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import SimpleEditorLayout from "@/components/layouts/SimpleEditorLayout";
import LessonEditor from "@/components/views/Instructor/Course/EditCourse/LessonEditor/LessonEditor";
import NoLessonMessage from "@/components/views/Instructor/Course/EditCourse/NoLessonMessage";
import { getErrorMessage } from "@/libs/axios/error";
import { LessonEditorContext } from "@/libs/context/LessonEditorContext";
import NProgress from "@/libs/loader/nprogress-setup";
import courseSectionService from "@/services/course-section.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";

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
    queryFn: () => courseSectionService.list(courseId).then((res) => res.data),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: courseId,
    },
    revalidate: 60,
  };
};

export default function CurriculumPage({ id }: { id: number }) {
  const { data, isPending, isFetching, isError, error } = useQuery<{
    courseTitle: string;
    sections: CourseSection[];
  }>({
    queryKey: ["courseSections", id],
    queryFn: () => courseSectionService.list(id).then((res) => res.data),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });

  const lessonState = useState<Lesson | null>(null);
  const [activeLesson] = lessonState;

  const contextValue = useMemo(() => {
    if (activeLesson) {
      return {
        ids: {
          courseId: id,
          sectionId: activeLesson.sectionId,
          lessonId: activeLesson.id,
        },
      };
    }
    return undefined;
  }, [activeLesson, id]);

  useEffect(() => {
    if (isPending) NProgress.start();
    else NProgress.done();
  }, [isPending]);

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  if (!data && !isPending && !isFetching) {
    return <NotFound message="Course Not Found." />;
  }

  if (!data) {
    return null;
  }

  const hasNoContent =
    !data.sections || data.sections.length === 0 || data.sections.every((s) => !s.lessons || s.lessons.length === 0);

  if (data && !isPending && !isFetching && hasNoContent) {
    return (
      <>
        <PageHead title="Edit Course" />
        <SimpleEditorLayout courseTitle={data.courseTitle || ""} lessonState={[null, () => {}]} structure={[]}>
          <NoLessonMessage courseId={id} />
        </SimpleEditorLayout>
      </>
    );
  }

  return (
    <LessonEditorContext.Provider value={contextValue}>
      <PageHead title="Edit Course" />
      <SimpleEditorLayout
        courseTitle={data.courseTitle || ""}
        lessonState={lessonState}
        structure={data.sections || []}
      >
        {activeLesson ? <LessonEditor lessonState={lessonState} /> : <div>Select a lesson to start editing</div>}
      </SimpleEditorLayout>
    </LessonEditorContext.Provider>
  );
}

