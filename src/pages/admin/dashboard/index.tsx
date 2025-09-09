import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Divider } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";
import { IconType } from "react-icons";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { HiMenuAlt2 } from "react-icons/hi";
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineCreditCard,
  HiOutlineDocumentChartBar,
  HiOutlineHome,
  HiOutlineUsers,
} from "react-icons/hi2";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <main
      className={cn([
        inter.className,
        "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900 overflow-scroll",
      ])}>
      <button
        onClick={() => {
          setOpen(true);
          setCollapsed(false);
        }} // toggle sidebar
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200"
        aria-label="Open menu">
        <HiMenuAlt2 size={24} />
      </button>
      {open && <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />}
      <aside
        className={cn([
          collapsed ? "w-[72px] p-3" : "w-[260px] p-4",
          "flex flex-col h-fit bg-white min-h-dvh transition-all duration-200 fixed z-50",
          "md:top-0 md:left-0", // ✅ NEW: always visible on desktop
          open ? "translate-x-0 top-0 left-0" : "-translate-x-full top-0 left-0", // ✅ NEW: slide-in/out on mobile
          "md:translate-x-0 md:shadow-none shadow-lg border border-gray-200",
        ])}
        // className={`${
        //   collapsed ? "w-[72px] p-3" : "w-[260px] p-4"
        // } flex flex-col top-0 bottom-0 h-fit rounded-2xl bg-white min-h-dvh transition-all duration-200 fixed`}
      >
        {/* Org / app header */}
        <div
          className={`flex h-full my-3 items-center ${collapsed ? "justify-center flex-col space-y-4" : "gap-3 mb-4"}`}>
          <span className="inline-grid place-items-center relative w-10 aspect-[4/3] ">
            <Image src={"/images/logo-prima.png"} fill alt="logo-prima" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-semibold">Prima LMS</p>
              <p className="text-xs text-gray-500">admin@prima.app</p>
            </div>
          )}
          <button
            onClick={() => setOpen(false)}
            className={cn([!collapsed ? "ml-auto mr-3" : "mx-auto", "md:hidden block text-slate-700"])}>
            {collapsed ? <GoSidebarCollapse size={20} /> : <GoSidebarExpand size={24} />}
          </button>
          <button
            onClick={() => setCollapsed(collapsed => !collapsed)}
            className={cn([!collapsed ? "ml-auto mr-3" : "mx-auto", "text-slate-700 md:block hidden"])}>
            {collapsed ? <GoSidebarCollapse size={20} /> : <GoSidebarExpand size={24} />}
          </button>
        </div>

        {!collapsed && <Divider />}

        {/* Primary links */}
        <nav className="mt-3 space-y-2">
          <SectionLink collapsed={collapsed} active Icon={HiOutlineHome} label="Home" />
          <SectionLink collapsed={collapsed} Icon={HiOutlineDocumentChartBar} label="Analytics" />
          <SectionLink collapsed={collapsed} Icon={HiOutlineUsers} label="Customers" badge="6" />
          <SectionLink collapsed={collapsed} Icon={HiOutlineCreditCard} label="Payouts" />
        </nav>

        {/* Footer links */}
        <nav className="mt-auto space-y-2 mb-4">
          <SectionLink collapsed={collapsed} Icon={HiOutlineCog6Tooth} label="Settings" />
          <SectionLink collapsed={collapsed} Icon={HiOutlineArrowLeftOnRectangle} label="Logout" />
        </nav>
      </aside>

      {/* Content */}
      <section
        className={cn([collapsed ? "md:ml-[72px]" : "md:ml-[260px]", "space-y-6 p-5 transition-all duration-200"])}>
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Total Users" value="1,245" trend="↑ 3.1%" />
          <KPI label="Courses" value="320" trend="↑ 1.4%" />
          <KPI label="Revenue (30d)" value="Rp 1.234.567" trend="↑ 7.8%" />
          <KPI label="Pending Approvals" value="12" trend="• awaiting" />
        </div>

        {/* Two-up: Activity + Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3 max-w-full overflow-scroll scrollbar-hide">
          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-300 ">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-xs text-gray-500">Latest events across users, courses, and transactions</p>
            </div>
            <ul className="p-4 divide-y divide-gray-100 text-sm">
              {[
                { msg: "New user registered: @mika", time: "2m ago" },
                { msg: 'Course "React Basics" submitted for approval', time: "15m ago" },
                { msg: "Payment processed: John Doe", time: "1h ago" },
                { msg: "Refund issued: #INV-2034", time: "2h ago" },
              ].map((i, idx) => (
                <li key={idx} className="flex items-center justify-between py-3 px-1">
                  <span className="truncate pr-4">{i.msg}</span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">{i.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white border border-gray-300 p-6">
            <h3 className="text-base font-semibold">Quick Actions</h3>
            <div className="mt-4 grid gap-3">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm">
                + Create new course
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm">
                Approve pending courses
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm">
                Invite a lecturer
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm">
                Issue refund
              </button>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-600">System status</p>
              <p className="text-xs text-blue-600 mt-1">All services operational</p>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Courses */}
          <div className="rounded-2xl bg-white border border-gray-300 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Pending Course Approvals</h3>
                <p className="text-xs text-gray-500">Review and publish instructor submissions</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white">
                Review all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Lecturer</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { title: "React Basics", by: "Alice", at: "Today" },
                    { title: "Tailwind UI", by: "Noah", at: "Yesterday" },
                    { title: "TypeScript Deep Dive", by: "Liam", at: "2d ago" },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{r.title}</td>
                      <td className="px-4 py-3">{r.by}</td>
                      <td className="px-4 py-3">{r.at}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs">Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl bg-white border border-gray-300 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Recent Transactions</h3>
                <p className="text-xs text-gray-500">Last 10 payments and refunds</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: "INV-2039", user: "Mika", amt: "Rp 450.000", status: "Paid" },
                    { id: "INV-2038", user: "Ivy", amt: "Rp 430.000", status: "Paid" },
                    { id: "INV-2037", user: "John", amt: "Rp 350.000", status: "Paid" },
                    { id: "INV-2036", user: "Noah", amt: "Rp 459.000", status: "Paid" },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{r.id}</td>
                      <td className="px-4 py-3">{r.user}</td>
                      <td className="px-4 py-3">{r.amt}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs ${
                            r.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : r.status === "Refunded"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLink({
  collapsed,
  Icon,
  label,
  active,
  badge,
  tag,
}: {
  collapsed?: boolean;
  Icon?: IconType;
  label: string;
  active?: boolean;
  badge?: string;
  tag?: string;
}) {
  return (
    <button
      title={label}
      className={`w-full flex items-center relative ${
        collapsed ? "justify-center" : "justify-between"
      } gap-3 px-3 py-2 rounded-lg transition ${
        active ? "bg-blue-50 text-blue-700 " : "text-gray-700 hover:bg-gray-100 border-transparent"
      }`}>
      <span className={`flex items-center gap-2 ${collapsed ? "" : "truncate"}`}>
        {Icon && <span className="shrink-0">{<Icon size={20} />}</span>}
        {!collapsed && <span className="text-sm">{label}</span>}
      </span>
      {!collapsed && (
        <span className="flex items-center gap-2">
          {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{badge}</span>}
          {tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{tag}</span>}
        </span>
      )}
      {collapsed && badge && (
        <span className="inline-block absolute right-2 bottom-2 size-2 rounded-full bg-gray-300" aria-hidden />
      )}
    </button>
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
