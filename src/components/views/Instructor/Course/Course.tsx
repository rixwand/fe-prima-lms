import {
  CourseCardGrid,
  CourseCardGridSkeleton,
  CourseCardList,
  CourseCardListSkeleton,
} from "@/components/commons/Cards/CourseCard3";
import StatCard from "@/components/commons/Cards/StatsCard";
import { formatRupiah } from "@/libs/utils/currency";
import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { LuBookOpen, LuFilter, LuLayoutGrid, LuPlus, LuSearch, LuStar, LuUsers } from "react-icons/lu";
import { PiMoneyWavy } from "react-icons/pi";
import useCourse from "./useCourse";

export default function InstructorCourse({ onCreate }: { onCreate: () => void }) {
  const { courses, isLoading, pendingDelete, deleteCourse } = useCourse();

  const [query, setQuery] = useState("");
  // const [status, setStatus] = useState<"all" | TCourseStatus>("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // const filtered = useMemo(() => {
  //   return courses
  //     .filter(c => (status === "all" ? true : c.status === status))
  //     .filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
  // }, [courses, status, query]);

  // const publish = (id: string) =>
  //   setCourses(prev => prev.map(c => (c.id === id ? { ...c, status: "published" as const } : c)));
  // const unpublish = (id: string) =>
  //   setCourses(prev => prev.map(c => (c.id === id ? { ...c, status: "draft" as const } : c)));
  // const remove = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  const publish = (id: number) => {};
  const unpublish = (id: number) => {};

  const totalStudents = 21000;
  const totalRevenue = 1_300_000;
  useEffect(() => {
    console.log(courses);
  }, [courses]);

  return (
    <section className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-slate-600 text-sm">Manage, publish and track the performance of your courses.</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700">
          <LuPlus size={20} /> New Course
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<LuUsers className="w-5 h-5" />}
          label="Total Students"
          value={totalStudents.toLocaleString("id-ID")}
        />
        <StatCard icon={<LuStar className="w-5 h-5" />} label="Avg. Rating" value={"4.7"} />
        {/* <StatCard icon={<LuStar className="w-5 h-5" />} label="Avg. Rating" value={avgRating(filtered)} /> */}
        <StatCard icon={<PiMoneyWavy size={24} />} label="Revenue" value={formatRupiah(totalRevenue)} />
        <StatCard icon={<LuBookOpen className="w-5 h-5" />} label="Courses" value={courses?.length.toString() || "0"} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 relative">
          <LuSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full pl-9 pr-3 h-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-44 flex items-center gap-2">
            <span className="text-sm text-slate-600">Status:</span>
            <Select
              aria-label="Select course type"
              classNames={{
                // helperWrapper: "border border-red-200",
                trigger: "bg-transparent shadow-none border border-slate-200 hover:bg-slate-50",
              }}
              defaultSelectedKeys={["all"]}
              className="max-w-xs">
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="draft">Draft</SelectItem>
              <SelectItem key="published">Published</SelectItem>
              <SelectItem key="archived">Archived</SelectItem>
            </Select>
          </div>
          <button className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 text-sm hover:bg-slate-50">
            <LuFilter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => setLayout(l => (l === "grid" ? "list" : "grid"))}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 text-sm hover:bg-slate-50">
            <LuLayoutGrid className="w-4 h-4" />
            View
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCardGridSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCardListSkeleton key={i} />
            ))}
          </div>
        )
      ) : courses?.length === 0 ? (
        <EmptyCourses onCreate={() => {}} />
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses?.map(c => (
            <CourseCardGrid
              key={c.id}
              data={c}
              onPublish={publish}
              onUnpublish={unpublish}
              onDelete={deleteCourse}
              isLoading={pendingDelete}
            />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
          {courses?.map(c => (
            <CourseCardList
              key={c.id}
              data={c}
              onPublish={publish}
              onUnpublish={unpublish}
              onDelete={deleteCourse}
              isLoading={pendingDelete}
            />
          ))}
        </div>
      )}

      {/* {filtered.length === 0 ? (
        <EmptyCourses onCreate={() => {}} />
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(c => (
            <CourseCardGrid key={c.id} data={c} onPublish={publish} onUnpublish={unpublish} onDelete={remove} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
          {filtered.map(c => (
            <CourseCardList key={c.id} data={c} onPublish={publish} onUnpublish={unpublish} onDelete={remove} />
          ))}
        </div>
      )} */}
    </section>
  );
}

function EmptyCourses({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 grid place-items-center bg-white text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto">
          <LuBookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold">You have no courses (yet)</h3>
        <p className="text-slate-600 text-sm">
          Start by creating your first course. You can save it as a draft and publish later when it’s ready.
        </p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700">
          <LuPlus className="w-4 h-4" /> Create Course
        </button>
      </div>
    </div>
  );
}
