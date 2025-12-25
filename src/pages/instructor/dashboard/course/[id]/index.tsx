import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import CourseInfo from "@/components/views/Instructor/Course/CourseInfo";
import { getErrorMessage } from "@/libs/axios/error";
import NProgress from "@/libs/loader/nprogress-setup";
import courseService from "@/services/course.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { AxiosResponse, isAxiosError } from "axios";
import { useEffect } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["coursePreview", params.id],
    queryFn: () => courseService.PUBLIC.get(params.id).then((res) => res.data),
  });
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function CoursePage({ id }: { id: number }) {
  const { data: res, isPending, isError, error } = useQuery<AxiosResponse<Course>>({
    queryKey: ["coursePreview", id],
    queryFn: () => courseService.get(id),
    placeholderData: keepPreviousData,
  });

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

  if (!res?.data && !isPending) return <NotFound />;
  if (res && res.data) {
    return (
      <InstructorLayout customNav={<CustomNav title="Course Preview" />} active="MyCourses">
        <CourseInfo data={res.data} />
      </InstructorLayout>
    );
  }
}
