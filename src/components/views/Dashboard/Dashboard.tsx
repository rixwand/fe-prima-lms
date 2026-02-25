import CourseCardProgress, { LearningCardSkeleton } from "@/components/commons/Cards/CourseCardProgress";
import StatusCard from "@/components/commons/Cards/StatusCard";
import UpcomingList from "@/components/commons/List/UpcomingList";
import NoResult from "@/components/commons/NoResult";
import useEnrollments from "@/hooks/course/useEnrollments";
import { Button, Card, CardBody, CardHeader, Divider, Progress, Skeleton, Tab, Tabs } from "@heroui/react";
import { Fragment } from "react";
import { BsBook } from "react-icons/bs";
import { FaBook, FaClipboardCheck, FaLightbulb, FaPlay } from "react-icons/fa6";
import { TbChecklist, TbClipboardCheck, TbNotebook } from "react-icons/tb";

const incomingCourse = [
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
  const { courses, isLoading } = useEnrollments();
  return (
    <section className="flex flex-wrap gap-4 2xl:gap-6 @container text-sm 2xl:text-base pb-3">
      <div className="@6xl:max-w-8/12 w-full">
        <Card className="text-gray-500 flex shadow-none border border-gray-300 @lg:flex-nowrap flex-row flex-wrap gap-4 p-4 items-center">
          {/* <div className="flex gap-4 max-w-full"> */}
          <span className="bg-prime hidden @lg:flex text-white px-2 py-1.5 rounded-lg ">
            <BsBook size={24} />
          </span>
          <span className="@lg:w-[30%] @2xl:w-5/12 w-full space-y-2">
            <p className="line-clamp-1">Menjadi Admin Profesional : Microsoft Office Word</p>
            <Progress aria-label="Progress" size="sm" value={30} />
          </span>
          {/* </div> */}
          <Divider orientation="vertical" className="hidden @lg:block h-10" />
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
          <Button className="ml-auto h-fit py-2 rounded-lg text-white bg-prime" radius="none">
            <FaPlay />
            <p className="font-semibold">Lanjutkan</p>
          </Button>
        </Card>
        <div className="@2xl:px-6 @xl:pb-6 pb-3 pt-3 mt-6 shadow-none border border-gray-300 rounded-xl bg-white">
          <h3 className="mb-3 @2xl:px-0 px-5 text-xl 2xl:text-2xl font-semibold text-gray-500">Status</h3>
          <div className="flex px-4 @sm:pb-2 @sm:px-5 @2xl:px-0 mt-3 gap-3 @2xl:mt-0 @4xl:justify-between @4xl:flex-nowrap flex-wrap">
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
          <h3 className="mb-3 ml-2 text-xl 2xl:text-2xl font-semibold text-gray-500">Kursus</h3>
          <Tabs
            className="w-full border-0 -mt-12 pr-2 flex justify-end"
            aria-label="Options"
            color="default"
            classNames={{
              cursor: ["bg-white shadow-none"],
              tabList: "bg-gray-100 p-1.5 gap-0 shadow-none",
            }}
            radius="sm"
            size="md"
            variant="solid">
            <Tab key="ongoing" title="Berjalan">
              <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
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
                      <CourseCardProgress key={c.id} meta={c.metaApproved} slug={c.slug} />
                    ))}
                  </Fragment>
                )}
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
      <Card className="@xl:flex-1 h-fit flex-auto border border-gray-300 px-2 py-1 shadow-none">
        <CardHeader>
          <h3 className="2xl:text-xl text-lg font-semibold text-gray-500">Segera Hadir</h3>
        </CardHeader>
        <CardBody>
          <ul className="pl-2 space-y-4 mb-3">
            {incomingCourse.map((course, i) => (
              <>
                <li>
                  <UpcomingList key={i} {...course} />
                </li>
                <Divider />
              </>
            ))}
            <li>
              <div className="flex gap-4 w-full items-center">
                <Skeleton className="flex rounded-xl h-12 w-12 2xl:w-14 2xl:h-14" />
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
