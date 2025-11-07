import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import SimpleEditorLayout from "@/components/layouts/SimpleEditorLayout";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import NProgress from "@/libs/loader/nprogress-setup";
import courseService from "@/services/course.service";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";
import { Fragment, useEffect, useState } from "react";

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

  await queryClient.prefetchQuery({
    queryKey: ["courseSections", courseId],
    queryFn: () => courseService.listCourseSections(courseId).then(res => res.data),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: courseId,
    },
    revalidate: 60,
  };
};

export default function CurriculumPage({ id }: { id: number }) {
  const lessonState = useState<Lesson | null>(null);
  const { data, isPending } = useQuery<{ courseTitle: string; sections: CourseSection[] }>({
    queryKey: ["courseSections", id],
    queryFn: () =>
      courseService.listCourseSections(id).then(res => {
        console.log(res);
        return res.data;
      }),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (isPending) NProgress.start();
    else NProgress.done();
  }, [isPending]);

  if (!data && !isPending) return <NotFound message="Course Not Found." />;
  if (data && data.courseTitle)
    return (
      <Fragment>
        <PageHead title="Edit Course" />
        <SimpleEditorLayout courseTitle={data.courseTitle} lessonState={lessonState} structure={data.sections}>
          <SimpleEditor />
        </SimpleEditorLayout>
      </Fragment>
    );
}
