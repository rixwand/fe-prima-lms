import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { NavStruct } from "@/components/commons/Sidebar/Sidebar";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  LuChartSpline,
  LuCog,
  LuFileClock,
  LuFileText,
  LuReceiptText,
  LuSquareUserRound,
  LuUsers,
} from "react-icons/lu";

const prefix = "/admin/dashboard";

const navLinks: NavStruct = [
  { label: "Overview", Icon: HiOutlineSquares2X2, link: prefix },
  { label: "Analytics", Icon: LuChartSpline, link: prefix + "/analytic" },
  { label: "Courses", Icon: LuFileText, link: prefix + "/course" },
  { label: "Instructor", Icon: LuSquareUserRound, link: prefix + "/instructor" },
  { label: "Users", Icon: LuUsers, link: prefix + "/customer" },
  { label: "Invoices", Icon: LuReceiptText, link: prefix + "/invoices" },
  { label: "Orders", Icon: LuFileClock, link: prefix + "/orders" },
  { label: "Setting", Icon: LuCog, link: prefix + "/setting" },
] as const;

export default function AdminLayout({
  children,
  title = "Admin",
  active,
  customNav,
}: {
  children: ReactNode;
  title?: string;
  active: (typeof navLinks)[number]["label"];
  customNav?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <PageHead title={title} />
      <Sidebar {...{ open, setOpen, collapsed, setCollapsed, active, navLinks, subTitle: "Admin Dashboard" }} />
      <main
        className={cn([
          inter.className,
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]",
          "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900",
        ])}>
        {customNav}
        {/* Content */}
        <section className={cn(["space-y-6 p-5 transition-all duration-200"])}>{children}</section>
      </main>
    </Fragment>
  );
}
