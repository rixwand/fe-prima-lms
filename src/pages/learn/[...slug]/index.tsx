import NotFound from "@/components/commons/NotFound";
import LearnLayout from "@/components/layouts/LearnLayout";
import LearnCourse from "@/components/views/Dashboard/Course/LearnCourse";
import LearnCourseNav from "@/components/views/Dashboard/Course/LearnCourse/LearnCourseNav";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import courseQueries from "@/queries/course-queries";
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async ctx => {
  const slugs = ctx.query.slug as string[] | undefined;
  if (!slugs || slugs.length == 0) return { notFound: true };
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(courseQueries.options.getLearningCurriculum(slugs[0]));
  } catch {
    return { notFound: true };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      activeCourseSlug: slugs[0],
      activeLesson: slugs[1] ?? null,
    },
  };
}) satisfies GetServerSideProps<{
  dehydratedState: DehydratedState;
  activeCourseSlug: string;
  activeLesson: string | null;
}>;

export default function LearnCoursePage({
  dehydratedState,
  activeCourseSlug,
  activeLesson,
}: {
  dehydratedState: DehydratedState;
  activeCourseSlug: string;
  activeLesson: string | null;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <LearnCoursePageContent activeCourseSlug={activeCourseSlug} activeLesson={activeLesson} />
    </HydrationBoundary>
  );
}

function LearnCoursePageContent({
  activeCourseSlug,
  activeLesson,
}: {
  activeCourseSlug: string;
  activeLesson: string | null;
}) {
  const { data, isLoading, isError, error } = useQuery(courseQueries.options.getLearningCurriculum(activeCourseSlug));

  useNProgress(isLoading);
  useQueryError({ isError, error });
  if (isLoading) return null;
  if (!data)
    return (
      <NotFound
        code={isAxiosError(error) ? error.status : undefined}
        message={isAxiosError(error) ? error.message : undefined}
      />
    );

  let sectionId: number | null = null;
  let lessonId: number | null = null;

  if (activeLesson) {
    for (const section of data.sections) {
      for (const lesson of section.lessons) {
        if (lesson.slug === activeLesson) {
          sectionId = section.id;
          lessonId = lesson.id;
          break;
        }
      }

      if (lessonId !== null) break;
    }
  }

  return (
    <LearnLayout title="Prima | Kursus">
      <LearnCourseNav data={data} activeCourseSlug={activeCourseSlug}>
        <LearnCourse>{`${sectionId ?? "section"}-${lessonId ?? "lesson"}`}</LearnCourse>
      </LearnCourseNav>
    </LearnLayout>
  );
}
