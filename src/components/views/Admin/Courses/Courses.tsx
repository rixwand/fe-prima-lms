import StatCard from "@/components/commons/Cards/StatsCard";
import Toolbar from "@/components/commons/Toolbar";
import usePublishCourses from "@/hooks/course/useListPublishRequest";
import { Tab, Tabs } from "@heroui/react";
import { Suspense, useState } from "react";
import { LuBookOpen, LuClock } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import CoursesLoading from "../../../commons/Cards/CoursesCardLoading";
import AllCourses from "./Tabs/AllCourses";
import PendingCourses from "./Tabs/PendingCourses";
import PublishedCourses from "./Tabs/PublishedCourses";
import RejectedCourses from "./Tabs/RejectedCourses";

type TabKeys = "all" | "published" | "pending";
export default function Courses() {
  const [activeTab, setActiveTab] = useState<TabKeys>("all");
  const { queryCourses } = usePublishCourses();
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
          value={queryCourses?.meta?.total.toString() || "0"}
        />
        <StatCard
          icon={<LuClock className="w-5 h-5" />}
          label="Pending Approval"
          value={queryCourses?.courses.filter(({ status }) => status == "PENDING").length.toString() || "0"}
        />
      </div>
      <div className="relative">
        <Tabs variant="underlined" className="flex" selectedKey={activeTab} onSelectionChange={setActiveTab as VoidFn}>
          <Tab title="All" key={"all"}>
            <AllCourses />
          </Tab>
          <Tab title="Pending" key={"pending"}>
            <Suspense fallback={<Fallback />}>
              <PendingCourses />
            </Suspense>
          </Tab>
          <Tab title="Published" key={"published"}>
            <Suspense fallback={<Fallback />}>
              <PublishedCourses />
            </Suspense>
          </Tab>
          <Tab title="Rejected" key={"rejected"}>
            <Suspense fallback={<Fallback />}>
              <RejectedCourses />
            </Suspense>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}

const Fallback = () => (
  <div className="pt-5 border-t border-slate-200">
    <Toolbar setLayout={() => {}} handleSearch={() => {}} />
    <CoursesLoading layout="grid" />
  </div>
);
