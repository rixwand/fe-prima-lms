import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoHelp, IoSettingsOutline } from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PiCertificate } from "react-icons/pi";
import { TbLogout2, TbNotes } from "react-icons/tb";

const navItem = [
  { link: "/", title: "Dashboard", Icon: HiOutlineSquares2X2, active: true },
  { link: "course", title: "Kursus", Icon: HiOutlineBookOpen, active: false },
  {
    link: "certificate",
    title: "Sertifikat",
    Icon: PiCertificate,
    active: false,
  },
  { link: "transaction", title: "Transaksi", Icon: TbNotes, active: false },
  {
    link: "setting",
    title: "Pengaturan",
    Icon: IoSettingsOutline,
    active: false,
  },
  { link: "support", title: "Bantuan", Icon: IoHelp, active: false },
];

import { authService } from "@/services/auth.service";
import { Navbar, NavbarContent } from "@heroui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { RiMenuUnfold3Line, RiMenuUnfold4Line } from "react-icons/ri";
import AvatarProfile from "../AvatarProfile";

type TProps = {
  foldSidebar: boolean;
  setFoldSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function DashboardNav({ foldSidebar, setFoldSidebar }: TProps) {
  const [navLinks, setNavLinks] = useState(navItem);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const active = router.route.split("/")[2];
  useEffect(() => {
    setActive(active ? active : "/");
  }, []);
  const setActive = (link: string) => {
    const newNavLink = navLinks.map(navLink =>
      link == navLink.link ? { ...navLink, active: true } : { ...navLink, active: false }
    );
    setNavLinks(newNavLink);
  };
  const handleLogout = async () => {
    await authService.logout();
    await signOut({
      callbackUrl: "/",
    });
  };
  return (
    <>
      <Navbar
        className={cn([inter.className, "2xl:h-[81px]"])}
        maxWidth="full"
        isBlurred={false}
        isBordered
        onMenuOpenChange={setSidebarOpen}>
        <NavbarContent justify="start">
          <button className="text-gray-500 md:hidden block" onClick={() => setSidebarOpen(true)}>
            <RiMenuUnfold3Line size={24} />
          </button>
          <NavbarContent
            justify={"start"}
            className={cn([!foldSidebar ? "2xl:ml-72 md:ml-56" : "md:ml-20", "transition-all duration-400"])}>
            <h1 className="font-semibold text-xl text-gray-500">
              {navLinks.map(item => (item.active ? item.title : null))}
            </h1>
          </NavbarContent>
        </NavbarContent>
        <NavbarContent as="div" className="lg:mr-3" justify="end">
          {/* <Input
            className="lg:flex hidden mr-3"
            variant="bordered"
            radius="sm"
            classNames={{
              base: "max-w-8/12 md:max-w-[25rem]",
              input: ["bg-white"],
              inputWrapper: "h-full bg-white text-default-500 px-4",
            }}
            placeholder="Apa yang ingin anda pelajari?"
            size="lg"
            startContent={<FaSearch size={16} />}
            type="search"
          /> */}

          <AvatarProfile />
        </NavbarContent>
      </Navbar>
      <div
        className={cn([
          inter.className,
          `${foldSidebar ? "md:w-[79.5px]" : "2xl:w-72 md:w-56 2xl:py-7 2xl:px-6"} 
            ${
              !isSidebarOpen ? "md:translate-0 -translate-x-[14rem]" : ""
            } top-0 px-3.5 w-[13rem] items-start flex flex-col md:bg-white bg-white/50 md:backdrop-blur-none backdrop-blur-lg border-gray-300 border min-h-screen fixed z-50 transition-transform md:transition-width duration-400`,
        ])}>
        <span className="bg-white border-l border-gray-300 p-1.5 xl:p-2 absolute hidden md:block -right-4 2xl:-right-[25px] top-6/12 rounded-full">
          <button
            onClick={() => setFoldSidebar(foldSidebar => !foldSidebar)}
            className="p-1 2xl:text-2xl rounded-full text-white bg-prime">
            {foldSidebar ? <LuChevronRight /> : <LuChevronLeft />}
          </button>
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="bg-white border border-gray-300 p-1.5 text-gray-500 absolute md:hidden block -right-[18px] top-4 rounded-full">
          <RiMenuUnfold4Line size={20} />
        </button>
        <ul className="flex flex-col w-full text-sm 2xl:text-lg items-center gap-3 2xl:gap-5 font-sourceSans">
          {!foldSidebar || isSidebarOpen ? (
            <Image
              src="/images/logo-full.png"
              className="mt-6 mb-3 2xl:mt-0"
              alt="brand logo"
              height={34}
              width={128}
            />
          ) : (
            <Image src="/images/logo-prima.png" className="mt-6" alt="brand logo" height={48} width={48} />
          )}
          {navLinks.map(({ title, Icon, active, link }) => (
            <li key={title} className={`w-full`}>
              <Link
                replace={true}
                // onClick={() => (!item.active ? setLoading(true) : null)}
                onClick={() => setActive(title)}
                className={`${
                  active ? "bg-prime text-white font-semibold shadow-sm" : "hover:bg-gray-300/50 text-gray-500"
                } ${
                  foldSidebar ? "px-3 py-2.5 " : "2xl:py-3 2xl:pl-4 pl-3 py-2"
                }  cursor-pointer w-full rounded-xl flex gap-4 items-center`}
                href={"/dashboard/" + (link == "/" ? "" : link)}>
                <span className="inline-block pt-[2px]">
                  <Icon size={26} />
                </span>
                <span className={foldSidebar ? "md:hidden" : "block"}>{title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className={`mt-auto hover:bg-rose-300/50 hover:text-rose-500 text-gray-500 ${
            foldSidebar ? "px-3 py-2.5 " : "2xl:py-3 2xl:pl-4 pl-3 py-2"
          }  cursor-pointer w-full rounded-xl flex gap-4 items-center`}>
          <span className="inline-block pt-[2px]">
            <TbLogout2 size={26} />
          </span>
          <span className={foldSidebar ? "md:hidden" : "block"}>Logout</span>
        </button>
      </div>
    </>
  );
}
