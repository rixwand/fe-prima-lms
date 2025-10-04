import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { NavStruct } from "@/components/commons/Sidebar/Sidebar";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import { HiOutlineCreditCard, HiOutlineUsers } from "react-icons/hi";
import { HiOutlineCog6Tooth, HiOutlineDocumentChartBar, HiOutlineSquares2X2 } from "react-icons/hi2";
import { LuBookOpen } from "react-icons/lu";
import { VscMortarBoard } from "react-icons/vsc";

const prefix = "/admin/dashboard";

const navLinks: NavStruct = [
  { label: "Overview", Icon: HiOutlineSquares2X2, link: prefix },
  { label: "Analytics", Icon: HiOutlineDocumentChartBar, link: prefix + "/analytic" },
  { label: "Courses", Icon: LuBookOpen, link: prefix + "/course" },
  { label: "Instructor", Icon: VscMortarBoard, link: prefix + "/instructor" },
  { label: "Customers", Icon: HiOutlineUsers, link: prefix + "/customer" },
  { label: "Payouts", Icon: HiOutlineCreditCard, link: prefix + "/payout" },
  { label: "Setting", Icon: HiOutlineCog6Tooth, link: prefix + "/setting" },
] as const;

export default function AdminLayout({
  children,
  title = "Admin",
  active,
}: {
  children: ReactNode;
  title?: string;
  active: (typeof navLinks)[number]["label"];
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <PageHead title={title} />
      <main className={cn([inter.className, "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900"])}>
        <Sidebar {...{ open, setOpen, collapsed, setCollapsed, active, navLinks, subTitle: "Admin Dashboard" }} />
        {/* Content */}
        <section
          className={cn([collapsed ? "md:ml-[72px]" : "md:ml-[260px]", "space-y-6 p-5 transition-all duration-200"])}>
          {children}
        </section>
      </main>
    </Fragment>
  );
}
