import StatCard from "@/components/commons/Cards/StatsCard";
import { formatRupiah } from "@/libs/utils/currency";
import { Fragment } from "react";
import {
  LuBookOpen,
  LuChevronRight,
  LuCircleCheck,
  LuClipboardCheck,
  LuClockAlert,
  LuDollarSign,
  LuHistory,
  LuMessageSquareText,
  LuMonitor,
  LuPlus,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";

export default function Overview() {
  return (
    <Fragment>
      <header className="mb-6 flex items-center gap-3">
        <div className="inline-grid place-items-center rounded p-3 bg-white ring-1 ring-slate-300">
          <span className="text-3xl font-semibold text-slate-600">
            <MdOutlineAdminPanelSettings />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Overview courses, enrollments, and payouts</p>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<LuUsers className="w-5 h-5" />} label="Total Users" value={(1245).toLocaleString("id-ID")} />
        <StatCard icon={<LuBookOpen className="w-5 h-5" />} label="Courses" value={(320).toLocaleString("id-ID")} />
        <StatCard icon={<PiMoneyWavy size={24} />} label="Revenue (30d)" value={formatRupiah(1234567)} />
        <StatCard icon={<LuClockAlert className="w-5 h-5" />} label="Pending Approvals" value={"12"} />
      </div>

      {/* Two-up: Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3 max-w-full overflow-scroll scrollbar-hide">
        {/* Main Activity */}
        <div className="rounded-2xl bg-white border border-slate-300 lg:col-span-2">
          <div className="p-4 border-b border-slate-200/70">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-sm text-slate-500">Updates across your courses and students</p>
          </div>
          <ul className="divide-y divide-slate-200/70">
            {[
              { msg: "New user registered: @mika", time: "2m ago" },
              { msg: 'Course "React Basics" submitted for approval', time: "15m ago" },
              { msg: "Payment processed: John Doe", time: "1h ago" },
              { msg: "Refund issued: #INV-2034", time: "2h ago" },
            ].map((a, i) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {i % 2 ? (
                    <LuMessageSquareText className="h-4 w-4 text-slate-400" />
                  ) : (
                    <LuCircleCheck className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-slate-700">{a.msg}</span>
                </div>
                <span className="text-slate-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white border border-slate-300 p-4">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Create new course", icon: LuPlus },
              { label: "Approve pending courses", icon: LuClipboardCheck },
              { label: "Invite a lecturer", icon: LuUserPlus },
              { label: "View payouts", icon: LuDollarSign },
            ].map(a => (
              <button
                key={a.label}
                className="flex items-center justify-between w-full rounded-xl ring-1 ring-slate-200 hover:ring-blue-500 hover:bg-blue-50 px-3 py-2 text-sm transition">
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <a.icon className="h-4 w-4 text-slate-500" /> {a.label}
                </span>
                <LuChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <p className="text-sm text-slate-600">System status</p>
            <p className="text-xs text-blue-600 font-medium">All services operational</p>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Course */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Pending Approvals</h2>
              <p className="text-sm text-slate-500">Review and publish instructor submissions</p>
            </div>
            <button className="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition text-nowrap ml-2">
              <LuMonitor className="h-4 w-4" /> Review all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200/70">
                  <th className="text-left font-medium px-4 py-3">Course</th>
                  <th className="text-left font-medium px-4 py-3">Instructor</th>
                  <th className="text-left font-medium px-4 py-3">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {[
                  { title: "React Basics", by: "Alice", at: "Today" },
                  { title: "Tailwind UI", by: "Noah", at: "Yesterday" },
                  { title: "TypeScript Deep Dive", by: "Liam", at: "2d ago" },
                  { title: "Go Fiber", by: "Eko", at: "3d ago" },
                ].map(c => (
                  <tr key={c.title} className="border-b border-slate-200/70">
                    <td className="px-4 py-3 text-slate-800">{c.title}</td>
                    <td className="px-4 py-3">{c.by}</td>
                    <td className="px-4 py-3 text-slate-500">{c.at}</td>
                    <td className="px-4 py-3">
                      <button className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800">
                        Open <LuChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent Transactions</h2>
              <p className="text-sm text-slate-500">Last 10 payments and refunds</p>
            </div>
            <button className="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-200 transition text-nowrap ml-2">
              <LuHistory className="h-4 w-4" /> View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200/70">
                  <th className="text-left font-medium px-4 py-3">Invoice</th>
                  <th className="text-left font-medium px-4 py-3">User</th>
                  <th className="text-left font-medium px-4 py-3">Amount</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INV-2039", user: "Mika", amt: "Rp 450.000", status: "Paid" },
                  { id: "INV-2038", user: "Ivy", amt: "Rp 430.000", status: "Paid" },
                  { id: "INV-2037", user: "John", amt: "Rp 350.000", status: "Paid" },
                  { id: "INV-2036", user: "Noah", amt: "Rp 459.000", status: "Paid" },
                ].map(c => (
                  <tr key={c.id} className="border-b border-slate-200/70">
                    <td className="px-4 py-3 text-slate-800">{c.id}</td>
                    <td className="px-4 py-3">{c.user}</td>
                    <td className="px-4 py-3 text-slate-500">{c.amt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs ${
                          c.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : c.status === "Refunded"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function KPI({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-300">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <h2 className="text-2xl font-bold">{value}</h2>
        {trend && <span className="text-[10px] px-2 py-1 rounded-md bg-blue-50 text-blue-600">{trend}</span>}
      </div>
    </div>
  );
}
