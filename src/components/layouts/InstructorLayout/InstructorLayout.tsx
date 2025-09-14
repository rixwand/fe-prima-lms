import NavbarDashboard from "@/components/commons/Navbar2";
import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { NavStruct } from "@/components/commons/Sidebar/Sidebar";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import { HiOutlineCreditCard } from "react-icons/hi";
import { HiOutlineCog6Tooth, HiOutlineDocumentChartBar, HiOutlineSquares2X2 } from "react-icons/hi2";
import { LuBookOpen } from "react-icons/lu";

const prefix = "/instructor/dashboard";

const navLinks: NavStruct = [
  { label: "Overview", Icon: HiOutlineSquares2X2, link: prefix },
  { label: "MyCourses", Icon: LuBookOpen, link: prefix + "/course" },
  { label: "Analytics", Icon: HiOutlineDocumentChartBar, link: prefix + "/report" },
  { label: "Payouts", Icon: HiOutlineCreditCard, link: prefix + "/payout" },
  { label: "Setting", Icon: HiOutlineCog6Tooth, link: prefix + "/setting" },
] as const;

type Nav = { customNav: ReactNode; navTitle?: undefined } | { customNav?: undefined; navTitle: string };

export default function InstructorLayout({
  children,
  title = "Instructor",
  active,
  customNav,
  navTitle,
}: {
  children: ReactNode;
  title?: string;
  active: (typeof navLinks)[number]["label"];
} & Nav) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <PageHead title={title} />
      <Sidebar {...{ collapsed, open, setOpen, setCollapsed, active, navLinks, subTitle: "Instructor Dashboard" }} />
      <main
        className={cn([
          inter.className,
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]",
          "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900 transition-all duration-200",
        ])}>
        {customNav ? customNav : <NavbarDashboard {...{ setOpen, setCollapsed, title: navTitle! }} />}
        <section className={cn(["space-y-6 p-5"])}>{children}</section>
      </main>
    </Fragment>
  );
}
