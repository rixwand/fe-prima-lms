import StatusCard from "@/components/commons/Cards/StatusCard";
import UpcomingList from "@/components/commons/List/UpcomingList";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Progress,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import Image from "next/image";
import { BsBook } from "react-icons/bs";
import { FaBook, FaClipboardCheck, FaLightbulb, FaPlay } from "react-icons/fa6";
import { TbChecklist, TbClipboardCheck, TbNotebook } from "react-icons/tb";

const courses = [
  {
    title: "Dasar-dasar Desain Web: Belajar UI/UX untuk Pemula",
    tag: "Web Design",
    day: "17",
    month: "Sept",
  },
  {
    title: "Belajar Web Programming: HTML, CSS, dan JavaScript dari Nol",
    tag: "Web Programming",
  },
  {
    title: "Microsoft Excel: Kuasai Rumus, Grafik, dan Analisis Data",
    tag: "Microsoft Excel",
  },
];

export default function Dashboard() {
  return (
    <section className="flex flex-wrap gap-6">
      <div className="2xl:max-w-8/12 w-full">
        <Card className="text-gray-500 flex sm:flex-nowrap flex-row flex-wrap gap-4 p-4 items-center">
          {/* <div className="flex gap-4 max-w-full"> */}
          <span className="bg-prime hidden sm:flex text-white px-2 py-1.5 rounded-lg ">
            <BsBook size={24} />
          </span>
          <span className="sm:w-3/12 lg:w-5/12 w-full space-y-2">
            <p className="line-clamp-1">
              Menjadi Admin Profesional : Microsoft Office Word
            </p>
            <Progress aria-label="Progress" size="sm" value={30} />
          </span>
          {/* </div> */}
          <Divider orientation="vertical" className="hidden sm:block h-10" />
          <div className="flex items-center gap-3">
            <span className="flex items-center text-warning gap-0.5">
              <TbNotebook size={24} />
              <p className="text-sm font-semibold">20</p>
            </span>
            <span className="flex text-primary items-center gap-0.5">
              <TbChecklist size={24} />
              <p className="text-sm font-semibold">8</p>
            </span>
            <span className="flex text-success items-center gap-0.5">
              <TbClipboardCheck size={23} />
              <p className="text-sm font-semibold">5</p>
            </span>
          </div>
          <Button
            className="ml-auto rounded-md text-white bg-prime"
            radius="none">
            <FaPlay />
            <p>Lanjutkan</p>
          </Button>
        </Card>
        <div className="md:px-6 md:pb-6 pb-3 pt-3 mt-6 shadow-md border border-abu rounded-xl bg-white">
          <h3 className="mb-3 md:px-0 px-5 text-2xl font-semibold text-gray-500">
            Status
          </h3>
          <div className="flex px-3 md:px-0 mt-3 gap-3 md:mt-0 lg:justify-between lg:flex-nowrap flex-wrap">
            <StatusCard
              title="Kelas"
              key={"kelas"}
              Icon={FaBook}
              bgIcon="bg-prime/50"
              strokeColor="stroke-prime"
              bg="bg-blue-400"
              complete={2}
              total={5}
            />
            <StatusCard
              bgIcon="bg-warning-700/50"
              title="Pelajaran"
              key={"pelajaran"}
              Icon={FaLightbulb}
              strokeColor="stroke-warning-700"
              bg="bg-warning-500"
              complete={22}
              total={37}
            />
            <StatusCard
              title="Tes"
              key={"tes"}
              Icon={FaClipboardCheck}
              bgIcon="bg-success-700/50"
              strokeColor="stroke-success-700"
              bg="bg-success-400"
              complete={5}
              total={11}
            />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-3 ml-2 text-2xl font-semibold text-gray-500">
            Kursus
          </h3>
          <Tabs
            className="w-full -mt-12 pr-2 flex justify-end"
            aria-label="Options"
            color="primary"
            classNames={{
              cursor: ["bg-prime"],
            }}
            radius="sm"
            size="lg"
            variant="solid">
            <Tab key="ongoing" title="Berjalan">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <CourseCard />
                <CourseCard />
                <CourseCard />
              </div>
            </Tab>
            <Tab key="complete" title="Selesai">
              <div className="grid text-gray-500 place-items-center w-full min-h-48">
                <p>Belum ada kursus selesai</p>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Card className="md:flex-1 h-fit flex-auto border border-abu px-2 py-1 shadow-md">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-500">Segera Hadir</h3>
        </CardHeader>
        <CardBody>
          <ul className="pl-2 space-y-4 mb-3">
            {courses.map((course, i) => (
              <>
                <li>
                  <UpcomingList key={i} {...course} />
                </li>
                <Divider />
              </>
            ))}
            <li>
              <div className="flex gap-4 w-full items-center">
                <Skeleton className="flex rounded-xl w-14 h-14" />
                <div className="flex space-y-3 mb-1 flex-col">
                  <Skeleton className="h-3 w-56 rounded-lg" />
                  <Skeleton className="h-3 w-24 rounded-lg" />
                </div>
              </div>
            </li>
          </ul>
        </CardBody>
      </Card>
    </section>
  );
}

const CourseCard = () => {
  return (
    <Card className="p-3">
      <CardBody className="rounded-lg relative aspect-video">
        <Image
          src={"/images/course-img.png"}
          fill
          alt="course-image"
          objectFit="contain"
        />
      </CardBody>
      <CardFooter className="flex-col space-y-2 text-gray-500">
        <p className="font-semibold">
          Menjadi Admin Profesional : Microsoft Office Word
        </p>
        <span className="flex justify-between mt-2 w-full">
          <p>Progress</p>
          <p>30%</p>
        </span>
        <Progress aria-label="Progress" size="sm" value={30} />
      </CardFooter>
    </Card>
  );
};
