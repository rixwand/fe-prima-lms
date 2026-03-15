import CustomNav from "@/components/commons/CustomNav";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import ReviewChanges from "@/components/views/Instructor/Course/ReviewChanges";
import { GetServerSideProps } from "next";

export const getServerSideProps = (async ctx => {
  const courseId = Number(ctx.params?.id);
  return {
    props: {
      courseId,
    },
  };
}) satisfies GetServerSideProps<{ courseId: number }>;

export default function ReviewPage({ courseId }: { courseId: number }) {
  return (
    <InstructorLayout active="My Courses" customNav={<CustomNav title="Review Course Change" />}>
      <ReviewChanges courseId={courseId} />
    </InstructorLayout>
  );
}
