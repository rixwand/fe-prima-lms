import ContentEditor from "@/components/views/Instructor/Course/EditCourse/ContentEditor";
import courseQueries from "@/queries/course-queries";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";

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

  await queryClient.prefetchQuery(courseQueries.options.getCourse(courseId));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: courseId,
    },
    revalidate: 60,
  };
};

export default function CurriculumPage({ id }: { id: number }) {
  return <ContentEditor id={id} />;
}
