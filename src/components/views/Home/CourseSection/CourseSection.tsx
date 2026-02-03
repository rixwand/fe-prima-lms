import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Button } from "@heroui/react";
import { FaChevronRight } from "react-icons/fa6";

export default function CourseSection() {
  return (
    <section className={cn([inter.className, "bg-[#1E40AF] "])}>
      <div className="py-16 flex flex-col items-center container mx-auto lg:px-16">
        <h2 className="font-bold text-2xl text-white">Pilihan Kursus</h2>
        <p className="text-white pt-2">Pilih Kursus yang kamu inginkan</p>
        <div className="mt-6 lg:mt-9 px-2 grid grid-cols-2 xl:gap-6 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {/* <UserCourseCard />
          <UserCourseCard />
          <UserCourseCard />
          <UserCourseCard />
          <UserCourseCard /> */}
        </div>
        <Button className="mt-8 lg:ml-auto mr-2 bg-white text-prime font-semibold rounded-md">
          Lihat lebih <FaChevronRight />
        </Button>
      </div>
    </section>
  );
}
