export default function DashboardPage() {
  return (
    <section>
      <NavbarComponent />
    </section>
  );
}

import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { NavbarMenuToggle } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoHelp } from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PiCertificate } from "react-icons/pi";
import { TbNotes } from "react-icons/tb";

const navItem = [
  { title: "Dashboard", Icon: HiOutlineSquares2X2, active: true },
  { title: "Kursus", Icon: HiOutlineBookOpen, active: false },
  { title: "Sertifikat", Icon: PiCertificate, active: false },
  { title: "Transaksi", Icon: TbNotes, active: false },
  { title: "Bantuan", Icon: IoHelp, active: false },
];

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { RiMenuUnfold3Line, RiMenuUnfold4Line } from "react-icons/ri";

function NavbarComponent() {
  const [foldSidebar, setFoldSidebar] = useState(false);
  const [navLink, setNavLink] = useState(navItem);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const active = router.route.split("/")[2];
  useEffect(() => {
    setActive(active ? active : "Dashboard");
  }, []);
  const setActive = (title: string) => {
    const newNavLink = navLink.map((link) =>
      title.toLowerCase() == link.title.toLowerCase()
        ? { ...link, active: true }
        : { ...link, active: false }
    );
    setNavLink(newNavLink);
  };
  return (
    <>
      <Navbar
        className={cn([inter.className, "sm:h-[81px]"])}
        maxWidth="full"
        isBlurred={false}
        isBordered
        onMenuOpenChange={setSidebarOpen}>
        <NavbarContent justify="start">
          <button
            className="text-gray-500 md:hidden block"
            onClick={() => setSidebarOpen(true)}>
            <RiMenuUnfold3Line size={24} />
          </button>
          <NavbarContent
            justify={"start"}
            className={!foldSidebar ? "md:ml-72" : "md:ml-20"}>
            <h1 className="font-semibold text-xl text-gray-500">
              {navLink.map((item) => (item.active ? item.title : null))}
            </h1>
          </NavbarContent>
        </NavbarContent>
        <NavbarContent as="div" className="mr-5" justify="end">
          <Input
            className="sm:flex hidden mr-3"
            variant="bordered"
            radius="sm"
            classNames={{
              base: "max-w-full sm:max-w-[25rem]",
              input: ["bg-white"],
              inputWrapper: "h-full bg-white text-default-500 px-4",
            }}
            placeholder="Apa yang ingin anda pelajari?"
            size="lg"
            startContent={<FaSearch size={16} />}
            type="search"
          />

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <div
        className={cn([
          inter.className,
          `${foldSidebar ? "md:w-fit md:px-3" : "md:w-72 md:py-7 md:px-6"} 
            ${
              !isSidebarOpen ? "md:translate-0 -translate-x-[14rem]" : ""
            } top-0 px-3 w-[13rem] items-start md:flex md:bg-white bg-white/50 md:backdrop-blur-none backdrop-blur-lg border-gray-300 border min-h-screen fixed z-50 transition-all duration-500`,
        ])}>
        <span className="bg-white border-l border-gray-300 p-2 absolute hidden md:block -right-[25px] top-6/12 rounded-full">
          <button
            onClick={() => setFoldSidebar((foldSidebar) => !foldSidebar)}
            className=" p-1 rounded-full text-white bg-prime">
            {foldSidebar ? (
              <LuChevronRight size={24} />
            ) : (
              <LuChevronLeft size={24} />
            )}
          </button>
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="bg-white border border-gray-300 p-1.5 text-gray-500 absolute md:hidden block -right-[18px] top-4 rounded-full">
          <RiMenuUnfold4Line size={20} />
        </button>
        <ul className="flex flex-col w-full text-sm md:text-lg items-center gap-3 md:gap-6 font-sourceSans">
          {!foldSidebar || isSidebarOpen ? (
            <Image
              src="/images/logo-full.png"
              className="mt-6 mb-2 md:mt-0"
              alt="brand logo"
              height={34}
              width={128}
            />
          ) : (
            <Image
              src="/images/logo-prima.png"
              className="mt-6"
              alt="brand logo"
              height={48}
              width={48}
            />
          )}
          {navLink.map(({ title, Icon, active }) => (
            <li key={title} className={`w-full`}>
              <Link
                replace={true}
                // onClick={() => (!item.active ? setLoading(true) : null)}
                onClick={() => setActive(title)}
                className={`${
                  active
                    ? "bg-prime text-white font-semibold shadow-sm"
                    : "hover:bg-gray-300/50 text-gray-500"
                } ${
                  foldSidebar ? "px-3 py-2.5 " : "md:py-3 md:pl-4 pl-3 py-2.5"
                }  cursor-pointer w-full rounded-xl flex gap-4 items-center`}
                // href={`/admin/${ title == "Dashboard" ? "" : title.toLowerCase() }`}
                href={"#"}>
                <span className="inline-block pt-[2px]">
                  <Icon size={26} />
                </span>
                <span className={foldSidebar ? "md:hidden" : "block"}>
                  {title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
