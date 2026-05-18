import NavbarDashboard from "@/components/commons/Navbar2";
import NotificationBox from "@/components/commons/NotificationBox";
import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { NavStruct } from "@/components/commons/Sidebar/Sidebar";
import useNotification from "@/hooks/dashboard/useNotification";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  LuChartSpline,
  LuFileClock,
  LuFileText,
  LuReceiptText,
  LuSettings2,
  LuSquareUserRound,
  LuUsers,
} from "react-icons/lu";

const prefix = "/admin/dashboard";
type Nav = { customNav: ReactNode; navTitle?: undefined } | { customNav?: undefined; navTitle: string };

const navLinks: NavStruct = [
  { label: "Overview", Icon: HiOutlineSquares2X2, link: prefix },
  { label: "Analytics", Icon: LuChartSpline, link: prefix + "/analytic" },
  { label: "Courses", Icon: LuFileText, link: prefix + "/course" },
  { label: "Instructor", Icon: LuSquareUserRound, link: prefix + "/instructor" },
  { label: "Users", Icon: LuUsers, link: prefix + "/customer" },
  { label: "Invoices", Icon: LuReceiptText, link: prefix + "/invoices" },
  { label: "Orders", Icon: LuFileClock, link: prefix + "/orders" },
  { label: "Setting", Icon: LuSettings2, link: prefix + "/setting" },
] as const;

export default function AdminLayout({
  children,
  title = "Admin",
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
  const {
    notification: { data, meta },
    readNotifications,
  } = useNotification();
  return (
    <Fragment>
      <PageHead title={title} />
      <Sidebar
        {...{
          open,
          setOpen,
          collapsed,
          setCollapsed,
          active,
          navLinks,
          subTitle: "Admin Dashboard",
          NotificationBox: (
            <NotificationBox newNotif={meta?.newNotif ?? 0} notifications={data} readNotif={readNotifications} />
          ),
          newNotif: meta?.newNotif,
        }}
      />
      <main
        className={cn([
          inter.className,
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]",
          "min-h-screen bg-gradient-to-br from-gray-50 to-white text-slate-900",
        ])}>
        {customNav ? customNav : <NavbarDashboard {...{ setOpen, setCollapsed, title: navTitle! }} />}
        {/* Content */}
        <section className={cn(["space-y-6 p-5 transition-all duration-200"])}>{children}</section>
      </main>
    </Fragment>
  );
}
