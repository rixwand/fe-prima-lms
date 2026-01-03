import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import CourseInfo from "@/components/views/Instructor/Course/CourseInfo";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import courseService from "@/services/course.service";
import { dehydrate, keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
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
  const {
    data: res,
    isPending,
    isError,
    error,
  } = useQuery<AxiosResponse<Course>>({
    queryKey: ["coursePreview", id],
    queryFn: () => courseService.get(id),
    placeholderData: keepPreviousData,
  });

  useNProgress(isPending);

  useQueryError({ isError, error });

  if (!res?.data && !isPending) return <NotFound />;
  if (res && res.data) {
    return (
      <Fragment>
        <PageHead title={res.data.title} />
        <CustomNav title="Course Preview" />
        <CourseInfo data={res.data} />
      </Fragment>
    );
  }
}
