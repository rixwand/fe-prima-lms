import InstructorLayout from "@/components/layouts/InstructorLayout";
import InstructorOverview from "@/components/views/Instructor/Overview";

export default function InstructorDashboard() {
  return (
    <InstructorLayout navTitle="Overview" active="Overview">
      <InstructorOverview />
    </InstructorLayout>
  );
}
