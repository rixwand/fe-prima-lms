import cn from "@/libs/utils/cn";
import { Divider } from "@heroui/react";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { IconType } from "react-icons";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { HiMenuAlt2 } from "react-icons/hi";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

export type NavStruct = ReadonlyArray<{ readonly label: string; readonly Icon: IconType }>;

export default function Sidebar<T extends NavStruct>({
  navLinks,
  collapsed,
  setCollapsed,
  active,
  subTitle,
}: {
  navLinks: T;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  active: T[number]["label"];
  subTitle: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
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
          "md:top-0 md:left-0",
          open ? "translate-x-0 top-0 left-0" : "-translate-x-full top-0 left-0",
          "md:translate-x-0 md:shadow-none shadow-lg border border-gray-200",
        ])}>
        <div
          className={`flex h-full my-3 items-center ${collapsed ? "justify-center flex-col space-y-4" : "gap-3 mb-4"}`}>
          <span className="inline-grid place-items-center relative w-10 aspect-[4/3] ">
            <Image src={"/images/logo-prima.png"} fill alt="logo-prima" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-semibold">Prima LMS</p>
              <p className="text-xs text-gray-500">{subTitle}</p>
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
          {navLinks.map(({ Icon, label }) => (
            <SectionLink key={label} collapsed={collapsed} active={label == active} Icon={Icon} label={label} />
          ))}
        </nav>

        {/* Footer links */}
        <nav className="mt-auto space-y-2 mb-4">
          <SectionLink collapsed={collapsed} Icon={HiOutlineArrowLeftOnRectangle} label="Logout" />
        </nav>
      </aside>
    </Fragment>
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
