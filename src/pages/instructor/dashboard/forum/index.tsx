import InstructorLayout from "@/components/layouts/InstructorLayout";
import Forum from "@/components/views/Forum";

export default function () {
  return (
    <InstructorLayout active="Forums" navTitle="Course Forum List">
      <Forum />
    </InstructorLayout>
  );
}
