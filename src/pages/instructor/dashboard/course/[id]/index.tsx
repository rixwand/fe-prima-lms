import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import VisibilitySwitch from "@/components/commons/Switch/VisibilitySwitch";
import CoursePreview from "@/components/views/Instructor/Course/CoursePreview";
import { useNProgress } from "@/hooks/use-nProgress";
import courseQueries from "@/queries/course-queries";
import courseService from "@/services/course.service";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["coursePreview", Number(params.id)],
    queryFn: () => courseService.get(Number(params.id)).then(res => res.data),
  });
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function CoursePage({ id }: { id: number }) {
  const [showPublished, setShowPublished] = useState(false);
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.getCourse(id));

  useNProgress(isPending);

  if (isFetching || isPending) return null;

  if (isError) {
    return <NotFound error={error} />;
  }
  if (data) {
    return (
      <Fragment>
        <PageHead title={data.metaDraft.title} />
        <CustomNav
          title="Course Preview"
          endContent={<VisibilitySwitch {...{ setShowPublished, showPublished, disabled: data.publishedAt == null }} />}
        />
        <CoursePreview {...{ data, showPublished }} />
      </Fragment>
    );
  }

  return <NotFound error={error} />;
}
