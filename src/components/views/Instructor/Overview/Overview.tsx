import cn from "@/libs/utils/cn";
import { Avatar } from "@heroui/react";
import { Fragment } from "react";
import { GoMortarBoard } from "react-icons/go";
import {
  LuBookOpen,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
  LuDollarSign,
  LuMessageSquareText,
  LuPlus,
  LuStar,
  LuUsers,
} from "react-icons/lu";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const stats = [
  { label: "Active Students", value: "842", delta: "+2.4%", icon: LuUsers },
  { label: "Courses Taught", value: "7", delta: "+1", icon: LuBookOpen },
  { label: "Earnings (30d)", value: "Rp 89.420.000", delta: "+7.8%", icon: LuDollarSign },
  { label: "Pending Reviews", value: "5", delta: "awaiting", icon: LuClock },
];
const myCourses = [
  { title: "React Basics", students: 312, rating: 4.8, status: "Published", updated: "Today" },
  { title: "Tailwind UI", students: 201, rating: 4.6, status: "Published", updated: "Yesterday" },
  { title: "TypeScript Deep Dive", students: 127, rating: 4.4, status: "Draft", updated: "2d ago" },
];

const recentActivity = [
  { text: "New enrollment: @naya in React Basics", time: "3m ago" },
  { text: "Question posted in Tailwind UI course", time: "18m ago" },
  { text: "Payment processed: INV-2045", time: "1h ago" },
  { text: "Review received: 5★ for TS Deep Dive", time: "2h ago" },
];

const growthData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 180 },
  { month: "Mar", students: 250 },
  { month: "Apr", students: 300 },
  { month: "May", students: 370 },
  { month: "Jun", students: 450 },
  { month: "Jul", students: 520 },
  { month: "Aug", students: 610 },
  { month: "Sep", students: 700 },
  { month: "Oct", students: 780 },
  { month: "Nov", students: 820 },
  { month: "Dec", students: 900 },
];

const transactions = [
  { invoice: "INV-2045", user: "Naya", amount: "Rp 450.000", status: "Paid" },
  { invoice: "INV-2044", user: "Ivy", amount: "Rp 430.000", status: "Paid" },
  { invoice: "INV-2043", user: "John", amount: "Rp 350.000", status: "Paid" },
  { invoice: "INV-2042", user: "Noah", amount: "Rp 459.000", status: "Paid" },
];

export default function InstructorOverview() {
  return (
    <Fragment>
      <header className="mb-6 flex items-center gap-3">
        <div className="inline-grid place-items-center rounded p-3 bg-white ring-1 ring-slate-300">
          <span className="text-3xl font-semibold text-slate-600">
            <GoMortarBoard />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Instructor Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your courses, enrollments, and payouts</p>
        </div>
      </header>
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow ring-1 ring-slate-200 p-4 flex flex-col justify-center gap-4">
          <div className="flex items-center">
            <Avatar className="shrink-0" src="/images/user.jpg" classNames={{ base: "w-14 h-14" }} />
            <div className="ml-4">
              <h1 className="text-lg sm:text-xl font-semibold">Hi, Yoru!</h1>
              <p className="text-sm text-slate-500">You have 5 reviews awaiting response and 2 drafts to publish.</p>
            </div>
          </div>
          {/* Compact KPI chips */}
          <div className="flex flex-wrap gap-2">
            {stats.slice(0, 3).map(s => (
              <span
                key={s.label}
                className="inline-flex items-center gap-2 text-xs rounded-full px-3 py-1 ring-1 ring-slate-200 bg-slate-50">
                <s.icon className="h-3.5 w-3.5 text-blue-600" /> {s.label}:{" "}
                <b className="font-medium text-slate-800">{s.value}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Quick create panel */}
        <div className="rounded-2xl ring-1 ring-blue-200 bg-blue-50 p-4 @container">
          <h2 className="font-semibold text-lg text-blue-900">Quick Actions</h2>
          <p className="text-sm text-blue-700">Create & manage course</p>
          <div className="mt-3 grid grid-cols-1 @xs:grid-cols-2 gap-2">
            <button className="rounded-lg bg-white text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50 px-3 py-2 text-sm inline-flex items-center gap-2">
              <LuPlus className="h-4 w-4" /> New course
            </button>
            <button className="rounded-lg bg-white text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50 px-3 py-2 text-sm inline-flex items-center gap-2 text-nowrap">
              <LuMessageSquareText className="h-4 w-4" /> Answer Question
            </button>
          </div>
        </div>
      </section>

      {/* Left: My Courses expanded */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
              <h2 className="font-semibold">My Courses</h2>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 ring-1 ring-slate-200 hover:bg-slate-50">
                  Manage catalog
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200/70">
                    <th className="text-left font-medium px-4 py-3">Course</th>
                    <th className="text-left font-medium px-4 py-3">Students</th>
                    <th className="text-left font-medium px-4 py-3">Rating</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {myCourses.map(c => (
                    <tr key={c.title} className="border-b border-slate-200/70">
                      <td className="px-4 py-3 text-slate-800">{c.title}</td>
                      <td className="px-4 py-3">{c.students}</td>
                      <td className="px-4 py-3 flex items-center gap-1 text-yellow-500">
                        <LuStar className="h-4 w-4 fill-yellow-400" /> {c.rating}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-md ring-1",
                            c.status === "Published"
                              ? "text-emerald-700 bg-emerald-50 ring-emerald-100"
                              : "text-slate-600 bg-slate-50 ring-slate-200"
                          )}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800">
                          Manage <LuChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200">
          <div className="p-4 border-b border-slate-200/70">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-sm text-slate-500">Your student and course updates</p>
          </div>
          <ul className="divide-y divide-slate-200/70">
            {recentActivity.map((a, i) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {i % 2 ? (
                    <LuMessageSquareText className="h-4 w-4 text-slate-400" />
                  ) : (
                    <LuCircleCheck className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-slate-700">{a.text}</span>
                </div>
                <span className="text-slate-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Performance Snapshot & Transactions side by side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200 p-4">
          <h2 className="font-semibold mb-3">Student Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200/70">
            <h2 className="font-semibold">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-200/70 text-sm">
            {transactions.map(t => (
              <div key={t.invoice} className="px-4 py-3 grid grid-cols-4 gap-2">
                <div>
                  <p className="text-slate-700">{t.invoice}</p>
                  <p className="text-xs text-slate-500">{t.user}</p>
                </div>
                <div className="col-span-2 flex items-center">{t.amount}</div>
                <div className="flex items-center justify-end">
                  <span className="text-[11px] px-2 py-0.5 rounded-md ring-1 text-emerald-700 bg-emerald-50 ring-emerald-100">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
