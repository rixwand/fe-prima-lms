import CustomNav from "@/components/commons/CustomNav";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import ReviewChanges from "@/components/views/Instructor/Course/ReviewChanges";
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
    <InstructorLayout active="My Courses" customNav={<CustomNav title="Review Course Change" />}>
      <ReviewChanges courseId={courseId} />
    </InstructorLayout>
  );
}
