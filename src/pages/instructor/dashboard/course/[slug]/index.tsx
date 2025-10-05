// pages/course/[slug].tsx
import InstructorLayout from "@/components/layouts/InstructorLayout";
import CourseInfo from "@/components/views/Instructor/Course/CourseInfo";
import courseService from "@/services/course.service";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LuArrowLeft } from "react-icons/lu";

export async function getStaticPaths() {
  // return popular slugs or []
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["coursePreview", params.slug],
    queryFn: () => courseService.PUBLIC.get(params.slug).then(res => res.data),
  });
  return {
    props: { dehydratedState: dehydrate(qc), slug: params.slug },
    revalidate: 60, // ISR
  };
}

export default function CoursePage({ slug }: { slug: string }) {
  const { data: res, isPending } = useQuery({
    queryKey: ["coursePreview", slug],
    queryFn: () => courseService.PUBLIC.get(slug),
  });
  return (
    <InstructorLayout customNav={<CustomNav />} active="MyCourses">
      <CourseInfo data={res?.data} isPending={isPending} />
    </InstructorLayout>
  );
}

const CustomNav = () => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="w-full px-5 bg-white/50 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer">
            <LuArrowLeft />
          </button>
          <div>
            <p className="font-semibold leading-tight">Course Preview</p>
          </div>
        </div>
      </div>
    </header>
  );
};
