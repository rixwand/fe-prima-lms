import UserCourseCard, { UserCourseCardSkeleton } from "@/components/commons/Cards/UserCourseCard";
import usePublicCourse from "@/hooks/course/usePublicCourse";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Button } from "@heroui/react";
import { FaChevronRight } from "react-icons/fa6";

export default function CourseSection() {
  const { courses, loadings } = usePublicCourse({ limit: 4 });
  return (
    <section className={cn([inter.className, "bg-[#1E40AF] "])}>
      <div className="py-16 flex flex-col items-center container mx-auto lg:px-16">
        <h2 className="font-bold text-2xl text-white">Pilihan Kursus</h2>
        <p className="text-white pt-2">Pilih Kursus yang kamu inginkan</p>
        <div className="mt-6 lg:mt-9 mx-8 xl:mx-4 grid grid-cols-1 xl:gap-6 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loadings.isQueryLoading ? (
            Array.from({ length: 4 }).map((_, i) => <UserCourseCardSkeleton key={i} className="min-w-xs" />)
          ) : courses ? (
            courses.map(({ metaApproved, ...course }) => (
              <UserCourseCard
                className="min-w-xs"
                course={{ metaApproved: metaApproved!, ...course }}
                key={course.id}
              />
            ))
          ) : (
            <div className="text-white pt-2 col-span-12 text-center">Coming Soon ...</div>
          )}
        </div>
        <Button className="mt-8 lg:ml-auto mr-2 bg-white text-prime font-semibold rounded-md">
          Lihat lebih <FaChevronRight />
        </Button>
      </div>
    </section>
  );
}
