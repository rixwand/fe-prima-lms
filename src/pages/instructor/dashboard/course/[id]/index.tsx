import CourseInfo from "@/components/commons/CourseInfo";
import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import { useNProgress } from "@/hooks/use-nProgress";
import courseQueries from "@/queries/course-queries";
import courseService from "@/services/course.service";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Fragment } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["coursePreview", params.id],
    queryFn: () => courseService.get(Number(params.id)).then(res => res.data),
  });
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function CoursePage({ id }: { id: number }) {
  const { data, isPending, isError, error } = useQuery(courseQueries.options.getCourse(id));

  useNProgress(isPending);

  if (isError) {
    return isAxiosError(error) ? (
      <NotFound code={error.status} message={error.response?.statusText} />
    ) : (
      <NotFound message="Course Not Found." />
    );
  }
  if (data) {
    return (
      <Fragment>
        <PageHead title={data.title} />
        <CustomNav title="Course Preview" />
        <CourseInfo data={data} />
      </Fragment>
    );
  }
}
