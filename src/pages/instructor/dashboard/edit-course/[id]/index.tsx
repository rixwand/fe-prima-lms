import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import EditCourse, { EditCourseTabsType } from "@/components/views/Instructor/Course/EditCourse/EditCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { getErrorMessage } from "@/libs/axios/error";
import courseQueries from "@/queries/course-queries";
import { addToast } from "@heroui/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery(courseQueries.options.getCourse(Number(params.id)));
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function EditCoursePage({ id }: { id: number }) {
  const { data, isPending, refetch, isError, error } = useQuery(courseQueries.options.getCourse(id));

  const router = useRouter();
  const tabsState = useState<EditCourseTabsType>("basic");

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
  }, [isError, error]);

  useEffect(() => {
    const tabs = router.query.tabs as EditCourseTabsType;
    const validTabs: EditCourseTabsType[] = ["basic", "tags", "media", "pricing", "curriculum"];
    if (tabs && validTabs.includes(tabs)) {
      tabsState[1](tabs);
    }
  }, [router.query.tabs]);

  useNProgress(isPending);

  if (!data && !isPending) return <NotFound />;
  if (data) {
    return (
      <InstructorLayout customNav={<CustomNav title="Edit Course" />} active="MyCourses">
        <EditCourse data={data} refetch={refetch} tabsState={tabsState} />
      </InstructorLayout>
    );
  }
}
