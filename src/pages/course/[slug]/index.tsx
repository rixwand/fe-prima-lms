import Navbar from "@/components/commons/Navbar";
import MainLayout from "@/components/layouts/MainLayout";
import CourseInfo from "@/components/views/Course/CourseInfo";
import { useRouter } from "next/router";

export default function CourseInfoPage() {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <MainLayout title="Prima | Kursus">
      <Navbar />
      <CourseInfo />
    </MainLayout>
  );
}
