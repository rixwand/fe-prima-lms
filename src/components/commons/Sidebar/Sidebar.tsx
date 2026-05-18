import useAuth from "@/hooks/auth/useAuth";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Badge, Button, Divider, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, Fragment, ReactNode, SetStateAction } from "react";
import { IconType } from "react-icons";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import { LuBell, LuChevronsLeft, LuIndentIncrease, LuX } from "react-icons/lu";

export type NavStruct = ReadonlyArray<{ readonly label: string; readonly Icon: IconType; readonly link: string }>;

export default function Sidebar<T extends NavStruct>({
  navLinks,
  collapsed,
  setCollapsed,
  active,
  subTitle,
  open,
  setOpen,
  NotificationBox,
  newNotif = 0,
}: {
  navLinks: T;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  active: T[number]["label"];
  subTitle: string;
  NotificationBox?: ReactNode;
  newNotif?: number;
}) {
  const { logoutHandler } = useAuth();
  const popoverState = useOverlayTriggerState({ defaultOpen: false });
  return (
    <Fragment>
      {open && <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} aria-hidden />}
      <aside
        className={cn([
          inter.className,
          collapsed ? "w-[72px] p-3" : "w-[260px] p-4",
          "flex flex-col h-fit bg-white min-h-dvh transition-all duration-200 fixed z-50",
          "md:top-0 md:left-0",
          open ? "translate-x-0 top-0 left-0" : "-translate-x-full top-0 left-0",
          "md:translate-x-0 md:shadow-none shadow-lg border border-gray-200",
        ])}>
        <Button
          isIconOnly
          variant="light"
          hidden={!open}
          onPress={() => setOpen(false)}
          className="absolute md:hidden reset-button text-slate-500 -right-3.5 top-[8%] p-1 rounded-full border-gray-200 border-1 bg-white">
          <LuChevronsLeft size={20} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          hidden={collapsed}
          onPress={() => setCollapsed(true)}
          className="absolute hidden md:block reset-button text-slate-500 -right-3.5 top-[7%] p-1 rounded-full border-gray-200 border-1 bg-white">
          <LuChevronsLeft size={20} />
        </Button>
        <div className={`flex h-full my-3 items-center ${collapsed ? "justify-center flex-col" : "gap-3 mb-4"}`}>
          <span className="inline-grid place-items-center relative w-10 aspect-[4/3] ">
            <Image src={"/images/logo-prima.png"} fill alt="logo-prima" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-semibold">Prima LMS</p>
              <p className="text-xs text-gray-500">{subTitle}</p>
            </div>
          )}
          <Button
            className="reset-button md:block hidden text-slate-700 w-full data-[hover=true]:bg-transparent px-3 py-2 mt-2"
            onPress={() => setCollapsed(false)}
            radius="none"
            variant="light"
            hidden={!collapsed}
            disableRipple
            isIconOnly>
            <LuIndentIncrease size={20} />
          </Button>
          <Popover state={popoverState} placement="right-start" showArrow={true} className="">
            <PopoverTrigger>
              <Button
                className={cn(
                  !collapsed && "ml-auto",
                  "reset-button text-slate-700 w-full data-[hover=true]:bg-transparent overflow-visible px-3 py-2",
                )}
                radius="none"
                variant="light"
                disableRipple
                isIconOnly>
                <Badge size="sm" content={newNotif} isInvisible={newNotif < 1} color="danger" shape="circle">
                  <LuBell size={20} />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-xl rounded-lg p-0 max-w-[95%] md:max-w-2xl">
              <span className="px-4 py-3 border-b w-full flex border-abu items-center text-slate-700">
                <h1 className="text-lg font-medium mr-auto">Notifications</h1>
                <Button
                  className="reset-button data-[hover=true]:bg-transparent p-0 text-slate-500"
                  radius="none"
                  isIconOnly
                  variant="light"
                  onPress={popoverState.close}
                  disableRipple>
                  <LuX size={20} />
                </Button>
              </span>
              {NotificationBox}
            </PopoverContent>
          </Popover>
        </div>

        {!collapsed && <Divider />}

        {/* Primary links */}
        <nav className={cn(collapsed ? "mt-0" : "mt-3", " space-y-2")}>
          {navLinks.map(({ Icon, label, link }) => (
            <SectionLink
              key={label}
              collapsed={collapsed}
              link={link}
              active={label == active}
              Icon={Icon}
              label={label}
            />
          ))}
        </nav>

        {/* Footer links */}
        <nav className="mt-auto space-y-2 mb-4">
          <SectionLink
            collapsed={collapsed}
            Icon={HiOutlineArrowLeftOnRectangle}
            onPress={logoutHandler}
            label="Logout"
          />
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
  link,
  onPress,
}: {
  collapsed?: boolean;
  Icon?: IconType;
  label: string;
  active?: boolean;
  badge?: string;
  tag?: string;
} & ({ link: string; onPress?: never } | { onPress: () => void | Promise<void>; link?: never })) {
  type TagProps = { children: ReactNode; title: string; className: string };
  type TagLink = { href: string; as: "link" };
  type TagButton = { onPress: () => void | Promise<void>; as: "button" };
  function Tag(props: TagProps & TagLink): ReactNode;
  function Tag(props: TagButton & TagProps): ReactNode;
  function Tag({ children, className, title, ...type }: TagProps & (TagLink | TagButton)) {
    if (type.as == "link")
      return (
        <Link href={type.href} {...{ className, title }}>
          {children}
        </Link>
      );
    else
      return (
        <Button variant="light" isIconOnly as={"div"} onPress={type.onPress} {...{ className, title }}>
          {children}
        </Button>
      );
  }

  const TagImpl = (props: TagProps) =>
    link ? (
      <Tag {...{ ...props, href: link, as: "link" }} />
    ) : (
      <Tag {...{ ...props, as: "button", onPress: onPress ?? (() => {}) }} />
    );
  return (
    <TagImpl
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
    </TagImpl>
  );
}
