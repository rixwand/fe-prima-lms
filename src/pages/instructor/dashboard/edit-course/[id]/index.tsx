import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import EditCourse from "@/components/views/Instructor/Course/EditCourse";
import NProgress from "@/libs/loader/nprogress-setup";
import courseService from "@/services/course.service";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useEffect } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["coursePreview", params.id],
    queryFn: () => courseService.PUBLIC.get(params.id).then(res => res.data),
  });
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function EditCoursePage({ id }: { id: number }) {
  const {
    data: res,
    isPending,
    refetch,
  } = useQuery<AxiosResponse<Course>>({
    queryKey: ["coursePreview", id],
    queryFn: () => courseService.get(id),
  });

  useEffect(() => {
    if (isPending) NProgress.start();
    else NProgress.done();
  }, [isPending]);

  if (!res?.data && !isPending) return <NotFound />;
  if (res && res.data) {
    return (
      <InstructorLayout customNav={<CustomNav title="Edit Course" />} active="MyCourses">
        <EditCourse data={res.data} refetch={refetch} />
      </InstructorLayout>
    );
  }
}
