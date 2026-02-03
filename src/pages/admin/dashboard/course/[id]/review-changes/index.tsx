import CustomNav from "@/components/commons/CustomNav";
import AdminLayout from "@/components/layouts/AdminLayout";
import ReviewChanges from "@/components/views/Admin/Courses/ReviewChanges";
import courseQueries from "@/queries/course-queries";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async ctx => {
  const courseId = Number(ctx.params?.id);
  const qc = new QueryClient();
  await qc.prefetchQuery(courseQueries.options.getCourse(courseId));
  return {
    props: {
      dehydratedState: dehydrate(qc),
      courseId,
    },
  };
}) satisfies GetServerSideProps<{ dehydratedState: DehydratedState; courseId: number }>;

export default function ReviewPage({ courseId }: { courseId: number }) {
  return (
    <AdminLayout active="Courses" customNav={<CustomNav title="Publish Changes Request" />}>
      <ReviewChanges courseId={courseId} />
    </AdminLayout>
  );
}
