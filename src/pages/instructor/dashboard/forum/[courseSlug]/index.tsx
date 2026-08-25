import InstructorLayout from "@/components/layouts/InstructorLayout";
import ForumList from "@/components/views/Forum/ForumList";

export default function () {
  return (
    <InstructorLayout active="Forums" navTitle="Course Forum List">
      <ForumList />
    </InstructorLayout>
  );
}
