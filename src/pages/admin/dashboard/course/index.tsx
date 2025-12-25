import AdminLayout from "@/components/layouts/AdminLayout";
import Courses from "@/components/views/Admin/Courses";

export default function CoursesPage() {
  return (
    <AdminLayout active="Courses">
      <Courses />
    </AdminLayout>
  );
}
