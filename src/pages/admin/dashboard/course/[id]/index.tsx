import NotFound from "@/components/commons/NotFound";
import AdminCourseInfo from "@/components/views/Admin/Courses/CourseInfo";
import { useNProgress } from "@/hooks/use-nProgress";
import courseQueries from "@/queries/course-queries";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery(courseQueries.options.getCourse(Number(params.id)));
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60,
  };
}

export default function CoursePage({ id }: { id: number }) {
  const { data, isPending, isError, error } = useQuery(courseQueries.options.getCourse(id));

  useNProgress(isPending);

  if (isError) {
    return <NotFound error={error} />;
  }
  if (data) {
    return <AdminCourseInfo course={data} />;
  }

  return <NotFound error={error} />;
}
