import Navbar from "@/components/commons/Navbar";
import NotFound from "@/components/commons/NotFound";
import MainLayout from "@/components/layouts/MainLayout";
import CourseInfo from "@/components/views/Course/CourseInfo/CourseInfo.preview";
import { useRouter } from "next/router";

export default function CourseInfoPage() {
  const router = useRouter();
  if (!router.isReady) return null;
  const { slug } = router.query;
  if (!slug || slug.length == 0) return <NotFound />;
  return (
    <MainLayout title="Prima | Kursus">
      <Navbar />
      <CourseInfo slug={Array.isArray(slug) ? slug[0] : slug} />
    </MainLayout>
  );
}
