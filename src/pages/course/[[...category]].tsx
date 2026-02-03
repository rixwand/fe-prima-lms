import Navbar from "@/components/commons/Navbar";
import MainLayout from "@/components/layouts/MainLayout";
import Course from "@/components/views/Course";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = (async context => {
  const { params } = context;
  const category = params?.category;
  return {
    props: {
      category: category && category.length > 0 ? category[0] : null,
    },
  };
}) satisfies GetServerSideProps<{ category: string | null }>;

export default function CoursePage({ category }: { category: string | null }) {
  const router = useRouter();
  if (!router.isReady) return null;
  return (
    <MainLayout title="Prima | Kursus">
      <Navbar showSearch={false} />
      <Course {...(category && { category })} />
    </MainLayout>
  );
}
