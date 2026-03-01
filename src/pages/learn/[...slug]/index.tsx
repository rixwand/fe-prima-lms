import NotFound from "@/components/commons/NotFound";
import LearnLayout from "@/components/layouts/LearnLayout";
import LearnCourse from "@/components/views/Dashboard/Course/LearnCourse";
import { LearnCourseIntro } from "@/components/views/Dashboard/Course/LearnCourse/LearnCourse";
import LearnCourseNav from "@/components/views/Dashboard/Course/LearnCourse/LearnCourseNav";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import learnQueries from "@/queries/learn-queries";
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async ctx => {
  const slugs = ctx.query.slug as string[] | undefined;
  if (!slugs || slugs.length == 0) return { notFound: true };
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(learnQueries.options.getLearningCurriculum(slugs[0]));
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
  const { data, isLoading, isError, error } = useQuery(learnQueries.options.getLearningCurriculum(activeCourseSlug));

  useNProgress(isLoading);
  useQueryError({ isError, error });
  if (isLoading) return null;
  if (!data) return <NotFound error={error} />;

  let sectionId: number | null = null;
  let lessonId: number | null = null;

  let flatLessons: {
    sectionId: number;
    lessonId: number;
    slug: string;
    title: string;
  }[] = [];

  for (const section of data.sections) {
    for (const lesson of section.lessons) {
      flatLessons.push({
        sectionId: section.id,
        lessonId: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
      });
    }
  }

  let currentIndex = -1;

  if (activeLesson) {
    currentIndex = flatLessons.findIndex(l => l.slug === activeLesson);

    if (currentIndex !== -1) {
      sectionId = flatLessons[currentIndex].sectionId;
      lessonId = flatLessons[currentIndex].lessonId;
    }
  }

  const previousLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;

  const nextLesson = !activeLesson
    ? flatLessons[0]
    : currentIndex !== -1 && currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;
  if (activeLesson && (!lessonId || !sectionId)) return <NotFound />;

  return (
    <LearnLayout title="Prima | Kursus">
      <LearnCourseNav
        {...{
          activeLesson,
          data,
          activeCourseSlug,
          previousLesson,
          nextLesson,
          currentLesson: flatLessons[currentIndex],
        }}>
        {activeLesson && lessonId && sectionId ? (
          <LearnCourse {...{ slug: activeCourseSlug, lessonId, sectionId }} />
        ) : (
          <LearnCourseIntro />
        )}
      </LearnCourseNav>
    </LearnLayout>
  );
}
