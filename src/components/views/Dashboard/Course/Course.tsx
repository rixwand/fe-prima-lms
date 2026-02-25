import CourseCardProgress, { LearningCardSkeleton } from "@/components/commons/Cards/CourseCardProgress";
import NoResult from "@/components/commons/NoResult";
import useEnrollments from "@/hooks/course/useEnrollments";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function CourseSection() {
  const { push } = useRouter();
  const { courses, isLoading } = useEnrollments();
  return (
    <section className="@container space-y-5 my-2">
      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm w-6/12"
          type="text"
          placeholder="Cari kursus"
          size="md"
          radius="md"
          startContent={
            <span className="text-gray-500">
              <IoSearch size={20} />
            </span>
          }
        />
        <Button onPress={() => push("/course")} className="bg-prime text-white">
          <FaShoppingCart />
          <span>Beli kursus</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 @3xl:gap-6 @md:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4">
        {isLoading ? (
          <Fragment>
            <LearningCardSkeleton />
            <LearningCardSkeleton />
            <LearningCardSkeleton />
          </Fragment>
        ) : !courses || courses.length == 0 ? (
          <NoResult
            className="col-span-12"
            title="Kursus tidak ditemukan"
            description="tidak ada kursus yang berjalan"
          />
        ) : (
          <Fragment>
            {courses.map(c => (
              <CourseCardProgress slug={c.slug} key={c.id} meta={c.metaApproved} />
            ))}
          </Fragment>
        )}
      </div>
    </section>
  );
}
