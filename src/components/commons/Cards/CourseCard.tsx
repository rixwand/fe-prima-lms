import { Card, CardFooter } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";

const CourseCard = ({ link = "/course/test" }: { link?: string }) => {
  return (
    <Link href={link}>
      <Card
        // className="rounded-xl w-[12rem] h-[16.5rem] lg:w-[16rem] lg:h-[20.5rem] "
        className="rounded-xl w-full"
        isPressable>
        <div className="max-w-72 relative w-full mt-auto h-fit bg-red-50 aspect-video">
          <Image
            fill
            objectFit="contain"
            className="object-cover rounded-t-md"
            src={"/images/course-img.png"}
            alt="Course Image"
          />
        </div>
        <CardFooter className="relative flex-col gap-y-0.5 lg:gap-y-2 items-start p-4 overflow-hidden">
          <h3 className="line-clamp-2 font-bold md:text-sm text-[12px] text-start">
            Menjadi Admin Profesional : Microsoft Office Word
          </h3>
          <div className="flex gap-x-3 mt-1">
            {/* <Avatar
              src="/images/lecturer's-photo.jpg"
              className="hidden md:flex"
              size="sm"
            /> */}
            <div className="items-start">
              <p className="text-xs text-start font-semibold text-default-500">
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
    </Link>
  );
};

export default CourseCard;
