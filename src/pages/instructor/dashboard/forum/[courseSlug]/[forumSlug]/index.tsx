import InstructorLayout from "@/components/layouts/InstructorLayout";
import ForumThreadList from "@/components/views/Forum/ForumThreads/ForumThreads";

export default function () {
  return (
    <InstructorLayout active="Forums" navTitle="Course Forum Threads List">
      <ForumThreadList />
    </InstructorLayout>
  );
}
