import NavbarDashboard from "@/components/commons/Navbar2";
import NotificationBox from "@/components/commons/NotificationBox";
import PageHead from "@/components/commons/PageHead";
import Sidebar from "@/components/commons/Sidebar";
import { NavStruct } from "@/components/commons/Sidebar/Sidebar";
import useNotification from "@/hooks/dashboard/useNotification";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";
import {
  LuBell,
  LuChartSpline,
  LuFileText,
  LuLayoutGrid,
  LuMessagesSquare,
  LuSettings2,
  LuWalletMinimal,
} from "react-icons/lu";

const prefix = "/instructor/dashboard";

const navLinks: NavStruct = [
  { label: "Overview", Icon: LuLayoutGrid, link: prefix },
  { label: "My Courses", Icon: LuFileText, link: prefix + "/course" },
  { label: "Forums", Icon: LuMessagesSquare, link: prefix + "/forum" },
  { label: "Notifications", Icon: LuBell, link: "/notifications" },
  { label: "Analytics", Icon: LuChartSpline, link: prefix + "/report" },
  { label: "Payouts", Icon: LuWalletMinimal, link: prefix + "/payout" },
  { label: "Settings", Icon: LuSettings2, link: prefix + "/setting" },
] as const;

type Nav = { customNav: ReactNode; navTitle?: undefined } | { customNav?: undefined; navTitle: string };

export default function InstructorLayout({
  children,
  title = "Instructor",
  active,
  customNav,
  navTitle,
  customBg,
}: {
  children: ReactNode;
  title?: string;
  active: (typeof navLinks)[number]["label"];
  customBg?: string;
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
          collapsed,
          open,
          setOpen,
          setCollapsed,
          active,
          navLinks,
          subTitle: "Instructor Dashboard",
          newNotif: meta?.newNotif,
          NotificationBox: (
            <NotificationBox notifications={data} newNotif={meta?.newNotif ?? 0} readNotif={readNotifications} />
          ),
        }}
      />
      <main
        className={cn([
          inter.className,
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]",
          "min-h-screen text-slate-900 transition-all duration-200",
          customBg || "bg-gradient-to-br from-gray-50 to-white",
        ])}>
        {customNav ? customNav : <NavbarDashboard {...{ setOpen, setCollapsed, title: navTitle! }} />}
        <section className={cn(["space-y-6 p-5 @container"])}>{children}</section>
      </main>
    </Fragment>
  );
}
