import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import VisibilitySwitch from "@/components/commons/Switch/VisibilitySwitch";
import CoursePreview from "@/components/views/Instructor/Course/CoursePreview";
import { useNProgress } from "@/hooks/use-nProgress";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const courseId = Number(params.id);
  if (!Number.isFinite(courseId) || courseId <= 0) {
    return { notFound: true };
  }
  return {
    props: { id: courseId },
  };
}

export default function CoursePage({ id }: { id: number }) {
  const [showPublished, setShowPublished] = useState(false);
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.getCourse(id));
  const router = useRouter();
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
          onClick={() => router.push("/instructor/dashboard/course")}
          title="Course Preview"
          endContent={<VisibilitySwitch {...{ setShowPublished, showPublished, disabled: data.publishedAt == null }} />}
        />
        <CoursePreview {...{ data, showPublished }} />
      </Fragment>
    );
  }

  return <NotFound error={error} />;
}
