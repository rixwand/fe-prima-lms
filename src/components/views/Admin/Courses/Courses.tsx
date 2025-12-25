import StatCard from "@/components/commons/Cards/StatsCard";
import { pendingCourses, publishedCourses } from "@/libs/dummy-data/courses";
import { Tab, Tabs } from "@heroui/react";
import { useEffect } from "react";
import { LuBookOpen, LuClock } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import PendingCourses from "./PendingCourses";
import PublishedCourses from "./PublishedCourses";
import useCourses from "./useCourses";

export default function Courses() {
  const { queryCourses, isLoading } = useCourses();

  useEffect(() => {
    console.log(queryCourses);
  }, [queryCourses]);
  const handleSearch = () => {};

  return (
    <section className="@container">
      <header className="mb-6 flex items-center gap-3">
        <div className="inline-grid place-items-center rounded p-3 bg-white ring-1 ring-slate-300">
          <span className="text-3xl font-semibold text-slate-600">
            <MdOutlineAdminPanelSettings />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Course Management</h1>
          <p className="text-sm text-slate-500">Approve, publish, and manage all courses.</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          icon={<LuBookOpen className="w-5 h-5" />}
          label="Total Courses"
          value={publishedCourses.length.toLocaleString("id-ID")}
        />
        <StatCard
          icon={<LuClock className="w-5 h-5" />}
          label="Pending Approval"
          value={pendingCourses.length.toLocaleString("id-ID")}
        />
      </div>
      {/* <div className="flex justify-between items-center mb-6"> */}
      <div className="relative">
        {/* <Tabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
        <Tabs variant="underlined" className="flex">
          {/* <Tab title="All" key={"all"}>
            <AllCourses {...{ isLoading: isLoading.isLoading, courses: [...pendingCourses, ...publishedCourses] }} />
          </Tab> */}
          <Tab title="Published" key={"published"}>
            <PublishedCourses {...{ isLoading: isLoading.isLoading, courses: publishedCourses }} />
          </Tab>
          <Tab title="Pending" key={"pending"}>
            <PendingCourses {...{ isLoading: isLoading.isLoading, courses: pendingCourses }} />
          </Tab>
        </Tabs>
      </div>

      {/* {isPending ? (
        <div className="text-center py-12">
          <LuLoaderCircle className="animate-spin text-4xl text-primary-500 mx-auto" />
        </div>
      ) : (
        <>
          {activeTab === "pending" && <PendingCourses courses={filteredPendingCourses} />}
          {activeTab === "published" && <PublishedCourses courses={filteredPublishedCourses} />}
        </>
      )} */}
    </section>
  );
}
