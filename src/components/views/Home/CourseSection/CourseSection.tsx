import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Avatar, Button, Card, CardBody, CardFooter } from "@heroui/react";
import Image from "next/image";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { Rating } from "react-simple-star-rating";

export default function CourseSection() {
  return (
    <section className={cn([inter.className, "bg-[#1E40AF] "])}>
      <div className="py-16 flex flex-col items-center container mx-auto lg:px-16">
        <h2 className="font-bold text-2xl text-white">Pilihan Kursus</h2>
        <p className="text-white pt-2">Pilih Kursus yang kamu inginkan</p>
        <div className="flex lg:gap-y-12 gap-5 lg:justify-evenly lg:w-full justify-center mt-12 flex-wrap">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
        <Button className="mt-8 lg:ml-auto mr-2 bg-white text-prime font-semibold rounded-md">
          Lihat lebih <FaChevronRight />
        </Button>
      </div>
    </section>
  );
}

const CourseCard = () => {
  return (
    <Card
      className="rounded-xl w-[12rem] h-[16.5rem] lg:w-[16rem] lg:h-[20.5rem] "
      isPressable>
      <CardBody>
        <Image
          fill
          className="object-cover rounded-t-md"
          src={"/images/course-img.png"}
          alt="Course Image"
        />
      </CardBody>
      <CardFooter className="flex-col gap-y-0.5 lg:gap-y-2 items-start p-4 overflow-hidden">
        <h3 className="line-clamp-1 font-bold lg:text-sm text-[12px] text-start">
          Menjadi Admin Profesional : Microsoft Office Word
        </h3>
        <div className="flex gap-x-3 lg:mt-1">
          <Avatar
            src="/images/lecturer's-photo.jpg"
            className="hidden lg:flex"
            size="sm"
          />
          <div className="">
            <p className="text-xs font-semibold text-default-500">
              Muhammad Fuad Abdullah
            </p>
            <p className="text-xs text-start text-default-400">
              Wordpress Designer
            </p>
          </div>
        </div>
        <div className="lg:flex hidden gap-3 justify-center items-center flex-row">
          <Rating
            size={24}
            iconsCount={5}
            allowFraction
            readonly
            initialValue={4.5}
          />
          <p className="text-lg font-bold mt-1">4.5</p>
        </div>
        <div className="flex lg:hidden items-center -ml-0.5 justify-start flex-row">
          <Rating
            size={18}
            iconsCount={5}
            allowFraction
            readonly
            initialValue={4.5}
          />
          <p className="text-sm font-semibold ml-2 mt-1.5">4.5</p>
        </div>
        <p className="font-bold lg:text-lg text-sm ">Rp500.000</p>
      </CardFooter>
    </Card>
  );
};
