import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import { HiOutlineCreditCard } from "react-icons/hi";
import { HiOutlineCog6Tooth, HiOutlineDocumentChartBar, HiOutlineSquares2X2 } from "react-icons/hi2";
import { LuBookOpen } from "react-icons/lu";

const navLinks = [
  { label: "Overview", Icon: HiOutlineSquares2X2 },
  { label: "MyCourses", Icon: LuBookOpen },
  { label: "Analytics", Icon: HiOutlineDocumentChartBar },
  { label: "Payouts", Icon: HiOutlineCreditCard },
  { label: "Setting", Icon: HiOutlineCog6Tooth },
] as const;

export default function InstructorLayout({
  children,
  title = "Instructor",
  active,
}: {
  children: ReactNode;
  title?: string;
  active: (typeof navLinks)[number]["label"];
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Fragment>
      <PageHead title={title} />
      <main className={cn([inter.className, "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900"])}>
        <Sidebar {...{ collapsed, setCollapsed, active, navLinks, subTitle: "Instructor Dashboard" }} />
        {/* Content */}
        <section
          className={cn([collapsed ? "md:ml-[72px]" : "md:ml-[260px]", "space-y-6 p-5 transition-all duration-200"])}>
          {children}
        </section>
      </main>
    </Fragment>
  );
}
