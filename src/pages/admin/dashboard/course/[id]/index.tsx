import NotFound from "@/components/commons/NotFound";
import AdminCourseInfo from "@/components/views/Admin/Courses/CourseInfo";
import useDump from "@/hooks/use-dump";
import { useNProgress } from "@/hooks/use-nProgress";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export async function getStaticProps({ params }: { params: { id: string } }) {
  // const qc = new QueryClient();
  // await qc.prefetchQuery(courseQueries.options.getCourse(Number(params.id)));
  // return {
  //   props: { dehydratedState: dehydrate(qc), id: params.id },
  //   revalidate: 60,
  // };
  return {
    props: { id: params.id },
  };
}

export default function CoursePage({ id }: { id: string }) {
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.getCourse(Number(id)));
  useDump(data, "course");
  useNProgress(isPending || isFetching);

  if (isPending || isFetching) return null;

  if (isError) {
    return <NotFound error={error} />;
  }
  if (data) {
    return <AdminCourseInfo course={data} />;
  }

  return <NotFound error={error} />;
}
