import { Card, CardBody, CardFooter, Progress } from "@heroui/react";
import Image from "next/image";

export default function CourseCard() {
  return (
    <Card className="p-3 text-sm 2xl:text-base shadow-none border border-gray-300" radius="md" isPressable>
      <CardBody className="rounded-lg relative aspect-video">
        <Image src={"/images/course-img.png"} fill alt="course-image" objectFit="contain" />
      </CardBody>
      <CardFooter className="flex-col space-y-2 text-gray-500">
        <p className="font-semibold text-start line-clamp-2">Menjadi Admin Profesional : Microsoft Office Word</p>
        <span className="flex justify-between mt-2 w-full">
          <p>Progress</p>
          <p>30%</p>
        </span>
        <Progress aria-label="Progress" size="sm" value={30} />
      </CardFooter>
    </Card>
  );
}
