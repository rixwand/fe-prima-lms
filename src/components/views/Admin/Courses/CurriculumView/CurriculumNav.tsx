import AvatarProfile from "@/components/commons/AvatarProfile";
import { useCurriculumViewContext } from "@/libs/context/CurriculumViewContext";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { LuCircleChevronLeft, LuCircleChevronRight } from "react-icons/lu";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";
import { SectionsTree } from "./SectionsTree";

type ModuleItemStatus = "done" | "current" | "pending";

type ModuleItem = {
  title: string;
  href: string;
  free?: boolean;
  status: ModuleItemStatus;
};

type ModuleCategory = {
  id: string;
  title: string;
  completedCount: number;
  totalCount: number;
  items: ModuleItem[];
};

const randomId = () => Math.random().toString(36).substring(2, 8); // random 6-char string

export const DATA: ModuleCategory[] = [
  {
    id: "module-1",
    title: "Persiapan Belajar",
    completedCount: 2,
    totalCount: 5,
    items: [
      {
        title: "Pengenalan Kursus",
        href: `/dashboard/course/persiapan-belajar/${randomId()}`,
        free: true,
        status: "current",
      },
      {
        title: "Persyaratan Dasar",
        href: `/dashboard/course/persiapan-belajar/${randomId()}`,
        free: true,
        status: "pending",
      },
      {
        title: "Instalasi Microsoft Office Word",
        href: `/dashboard/course/persiapan-belajar/${randomId()}`,
        free: true,
        status: "pending",
      },
      {
        title: "Mengenal Antarmuka Word",
        href: `/dashboard/course/persiapan-belajar/${randomId()}`,
        status: "pending",
      },
      {
        title: "Tips Efektif Belajar",
        href: `/dashboard/course/persiapan-belajar/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-2",
    title: "Dasar-Dasar Microsoft Word",
    completedCount: 0,
    totalCount: 4,
    items: [
      {
        title: "Membuat Dokumen Baru",
        href: `/dashboard/course/dasar-dasar-microsoft-word/${randomId()}`,
        status: "pending",
      },
      {
        title: "Menyimpan & Membuka Dokumen",
        href: `/dashboard/course/dasar-dasar-microsoft-word/${randomId()}`,
        status: "pending",
      },
      {
        title: "Format Teks Dasar",
        href: `/dashboard/course/dasar-dasar-microsoft-word/${randomId()}`,
        status: "pending",
      },
      {
        title: "Pengaturan Paragraf",
        href: `/dashboard/course/dasar-dasar-microsoft-word/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-3",
    title: "Pemformatan Lanjutan",
    completedCount: 0,
    totalCount: 4,
    items: [
      {
        title: "Gaya & Tema",
        href: `/dashboard/course/pemformatan-lanjutan/${randomId()}`,
        status: "pending",
      },
      {
        title: "Kolom & Indentasi",
        href: `/dashboard/course/pemformatan-lanjutan/${randomId()}`,
        status: "pending",
      },
      {
        title: "Penggunaan Tabel",
        href: `/dashboard/course/pemformatan-lanjutan/${randomId()}`,
        status: "pending",
      },
      {
        title: "Header, Footer, & Nomor Halaman",
        href: `/dashboard/course/pemformatan-lanjutan/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-4",
    title: "Pengelolaan Konten",
    completedCount: 0,
    totalCount: 3,
    items: [
      {
        title: "Menyisipkan Gambar & Grafik",
        href: `/dashboard/course/pengelolaan-konten/${randomId()}`,
        status: "pending",
      },
      {
        title: "Menyisipkan Tabel & SmartArt",
        href: `/dashboard/course/pengelolaan-konten/${randomId()}`,
        status: "pending",
      },
      {
        title: "Hyperlink & Bookmark",
        href: `/dashboard/course/pengelolaan-konten/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-5",
    title: "Pengaturan Dokumen",
    completedCount: 0,
    totalCount: 3,
    items: [
      {
        title: "Pengaturan Margin & Orientasi",
        href: `/dashboard/course/pengaturan-dokumen/${randomId()}`,
        status: "pending",
      },
      {
        title: "Pengaturan Ukuran Kertas",
        href: `/dashboard/course/pengaturan-dokumen/${randomId()}`,
        status: "pending",
      },
      {
        title: "Pengaturan Section Break",
        href: `/dashboard/course/pengaturan-dokumen/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-6",
    title: "Tips & Trik Profesional",
    completedCount: 0,
    totalCount: 3,
    items: [
      {
        title: "Shortcut Keyboard Penting",
        href: `/dashboard/course/tips-dan-trik-profesional/${randomId()}`,
        status: "pending",
      },
      {
        title: "Menggunakan Template",
        href: `/dashboard/course/tips-dan-trik-profesional/${randomId()}`,
        status: "pending",
      },
      {
        title: "Fitur Kolaborasi & Review",
        href: `/dashboard/course/tips-dan-trik-profesional/${randomId()}`,
        status: "pending",
      },
    ],
  },
  {
    id: "module-7",
    title: "Penutup",
    completedCount: 0,
    totalCount: 2,
    items: [
      {
        title: "Rangkuman Materi",
        href: `/dashboard/course/penutup/${randomId()}`,
        status: "pending",
      },
      {
        title: "Kuis Akhir & Sertifikat",
        href: `/dashboard/course/penutup/${randomId()}`,
        status: "pending",
      },
    ],
  },
];

type Props = {
  children: ReactNode;
  sections: CourseSection[];
  courseTitle: string;
};

export default function CurriculumNav({ children, sections, courseTitle }: Props) {
  const { onSelect } = useCurriculumViewContext();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { activeLesson } = useCurriculumViewContext();
  const sideBarToggle = () => setSidebarOpen(isSidebarOpen => !isSidebarOpen);

  return (
    <section className={cn([inter.className, "relative min-h-screen"])}>
      <Navbar isBordered maxWidth="full" className="md:px-2">
        <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-[85%]">
            <Link href="#" className="flex text-prime items-center w-full gap-x-4 overflow-hidden">
              <FaArrowLeft size={20} />
              <p className="font-semibold hidden md:block truncate flex-1">Curriculum Preview</p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="center" className="">
          {courseTitle}
        </NavbarContent>
        <NavbarContent justify="end" className="max-w-1/2">
          <NavbarItem className="md:hidden">
            <button onClick={sideBarToggle} className="flex text-2xl text-prime items-center gap-x-2">
              {!isSidebarOpen ? <RiMenuFold4Line /> : <RiMenuUnfold4Line />}
            </button>
          </NavbarItem>
          <NavbarItem>
            <AvatarProfile />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <button
        onClick={sideBarToggle}
        className={cn([
          isSidebarOpen ? "-translate-x-12" : "translate-x-0",
          "sticky hidden md:block cursor-pointer delay-700 duration-300 transition-transform top-20 bg-prime pl-2 pr-4 rounded-r-full py-2",
        ])}>
        <RiMenuFold4Line className="text-2xl text-white" />
      </button>
      <div className="flex justify-between ">
        <aside
          // when hide, position fixed or absolute instead sticky
          className={cn([
            // mobile: slide-in panel, fixed to viewport
            isSidebarOpen ? "translate-x-0 md:-mt-10 md:sticky" : "-translate-x-[350px]",
            "fixed top-16 bottom-0 left-0 w-[350px] z-10 bg-white shadow-lg border-x border-abu",
            "transition-transform duration-[400ms]",
            "md:top-16 md:bottom-auto md:h-[calc(100vh-8rem)]",
          ])}>
          <div className="flex h-full flex-col">
            {/* Header (non-scrolling) */}
            <header className="shrink-0 flex items-center justify-between pl-7 pr-4 pt-5 border-abu">
              <h5 className="font-bold 2xl:text-xl text-lg m-0">Daftar Modul</h5>
              <div className="hidden md:block">
                <button
                  onClick={sideBarToggle}
                  id="sidebar-navigation-btn-close"
                  className="cursor-pointer"
                  aria-label="Close sidebar">
                  <RiMenuUnfold4Line className="text-3xl text-zinc-800" />
                </button>
              </div>
            </header>
            <section className="flex-1 overflow-y-auto overscroll-contain px-5 mt-2 pb-5 scrollbar-hide">
              <SectionsTree courseSections={sections} onSelect={onSelect} activeLessonId={activeLesson?.lessonId} />
            </section>
          </div>
        </aside>
        {children}
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 border-t border-gray-300 bg-white py-5">
        <div className="flex w-full items-center justify-between px-6">
          {/* Left */}
          <button
            disabled
            className="flex cursor-pointer md:w-1/3 disabled:text-prime/50 text-prime items-center gap-x-2 ">
            <LuCircleChevronLeft size={24} />
            <p className="font-semibold text-nowrap hidden w-2/3 truncate">
              Lorem ipsum dolor sit amet consectetur adipisicing elit
            </p>
          </button>

          {/* Center */}
          <p className="font-semibold md:w-1/3 text-center text-nowrap truncate px-4 md:px-0">Pengenalan Kursus</p>

          {/* Right */}
          <button className="flex cursor-pointer text-prime justify-end items-center gap-x-4 md:w-1/3 ">
            <p className="font-semibold md:block text-nowrap hidden text-end w-2/3 truncate">Persyaratan Dasar</p>
            <LuCircleChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
