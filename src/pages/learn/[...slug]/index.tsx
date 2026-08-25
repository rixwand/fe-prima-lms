import NotFound from "@/components/commons/NotFound";
import LearnLayout from "@/components/layouts/LearnLayout";
import ForumPage from "@/components/views/Dashboard/Course/LearnCourse/ForumPage";
import LearnCourseNav from "@/components/views/Dashboard/Course/LearnCourse/LearnCourseNav";
import LessonContent, { LearnCourseIntro } from "@/components/views/Dashboard/Course/LearnCourse/LessonContent";
import QuizPage from "@/components/views/Dashboard/Course/LearnCourse/QuizPage";
import useDump from "@/hooks/use-dump";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { LearningPathsContext } from "@/libs/context/LearningPathsContext";
import learnQueries from "@/queries/learn-queries";
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async ctx => {
  const slugs = ctx.query.slug as string[] | undefined;
  if (!slugs || slugs.length == 0) return { notFound: true };
  ctx.res.setHeader("Cache-Control", "private, max-age=60, stale-while-revalidate=300");
  const queryClient = new QueryClient();
  const nextDataHeader = ctx.req.headers["x-nextjs-data"];
  const isNextDataRequest = nextDataHeader === "1" || (Array.isArray(nextDataHeader) && nextDataHeader.includes("1"));

  if (!isNextDataRequest) {
    try {
      await queryClient.prefetchQuery(learnQueries.options.getLearningCurriculum(slugs[0]));
    } catch {
      return { notFound: true };
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      activeCourseSlug: slugs[0],
      activeItem: slugs[1] ?? null,
    },
  };
}) satisfies GetServerSideProps<{
  dehydratedState: DehydratedState;
  activeCourseSlug: string;
  activeItem: string | null;
}>;

export default function LearnCoursePage({
  dehydratedState,
  activeCourseSlug,
  activeItem,
}: {
  dehydratedState: DehydratedState;
  activeCourseSlug: string;
  activeItem: string | null;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <LearnCoursePageContent activeCourseSlug={activeCourseSlug} activeItem={activeItem} />
    </HydrationBoundary>
  );
}

function LearnCoursePageContent({
  activeCourseSlug,
  activeItem,
}: {
  activeCourseSlug: string;
  activeItem: string | null;
}) {
  const { data, isLoading, isError, error } = useQuery(learnQueries.options.getLearningCurriculum(activeCourseSlug));
  useDump({ curriculum: data });
  useNProgress(isLoading);
  useQueryError({ isError, error });
  if (isLoading) return null;
  if (!data) return <NotFound error={error} />;

  let currentItem: CourseSectionsItem | null = null;

  let flatItem: CourseSectionsItem[] = [];

  for (const section of data.sections) {
    for (const item of section.items) {
      flatItem.push(item);
    }
  }

  let currentIndex = -1;

  if (activeItem) {
    currentIndex = flatItem.findIndex(l => l.slug === activeItem);

    if (currentIndex !== -1) {
      currentItem = flatItem[currentIndex];
    }
  }

  const previousItem = currentIndex > 0 ? flatItem[currentIndex - 1] : null;

  const nextItem = !activeItem
    ? flatItem[0]
    : currentIndex !== -1 && currentIndex < flatItem.length - 1
      ? flatItem[currentIndex + 1]
      : null;
  if (activeItem && !currentItem) return <NotFound />;

  return (
    <LearnLayout title="Prima | Kursus">
      <LearningPathsContext.Provider
        value={{
          paths: {
            slug: activeCourseSlug,
            itemId: currentItem?.id ?? flatItem[0].id,
            sectionId: currentItem?.sectionId ?? flatItem[0].sectionId,
          },
        }}>
        <LearnCourseNav
          {...{
            activeItem,
            data,
            activeCourseSlug,
            previousItem,
            nextItem,
            currentItem,
          }}>
          {activeItem && currentItem ? (
            currentItem.type == "LESSON" ? (
              <LessonContent {...{ ...currentItem, slug: activeCourseSlug }} />
            ) : currentItem.type == "QUIZ" ? (
              <QuizPage {...{ ...currentItem, slug: activeCourseSlug }} />
            ) : (
              <ForumPage {...{ ...currentItem, slug: activeCourseSlug }} />
            )
          ) : (
            <LearnCourseIntro />
          )}
        </LearnCourseNav>
      </LearningPathsContext.Provider>
      {/* <Code className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</Code> */}
    </LearnLayout>
  );
}
