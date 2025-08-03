import Navbar from "@/components/commons/Navbar";
import MainLayout from "@/components/layouts/MainLayout";
import Course from "@/components/views/Course";

export default function CoursePage() {
  return (
    <MainLayout title="Prima | Kursus">
      <Navbar />
      <Course />
    </MainLayout>
  );
}
