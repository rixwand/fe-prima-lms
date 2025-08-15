// SidebarModules.tsx
import React, { useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  LuBookOpen,
  LuCircle,
  LuCircleCheckBig,
  LuCircleChevronLeft,
  LuCircleChevronRight,
  LuClipboardCheck,
  LuFileCheck2,
  LuVideo,
} from "react-icons/lu";
import cn from "@/libs/utils/cn";
import { GoDotFill } from "react-icons/go";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaInfo, FaUserSecret } from "react-icons/fa6";
import { inter } from "@/libs/fonts";

type ModuleItemStatus = "done" | "current" | "pending";

type ModuleItem = {
  title: string;
  href: string;
  free?: boolean;
  status: ModuleItemStatus;
};

type ModuleCategory = {
  id: string; // unique id for collapse
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

// ——— Reusable UI bits —————————————————————————————————————————————

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded bg-abu">
      <div
        className="h-2 rounded bg-prime"
        style={{ width: `${safe}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safe}
        role="progressbar"
        title={`${safe}% Selesai`}
      />
    </div>
  );
};

const StatusIcon: React.FC<{ status: ModuleItemStatus }> = ({ status }) => {
  if (status === "done") {
    return <LuCircleCheckBig className="text-prime text-base" />;
  }
  if (status === "current") {
    // a thicker outlined circle to hint “in progress”
    return <LuCircle className="text-prime" />;
  }
  return <GoDotFill className="text-zinc-300 text-xs" />;
};

const SmallFreeTag: React.FC = () => (
  <small className="text-zinc-500 ml-1">(Gratis)</small>
);

// ——— Items ————————————————————————————————————————————————————————

const ModuleRow: React.FC<{
  item: ModuleItem;
  isCurrent?: boolean;
}> = ({ item }) => {
  return (
    <div className="flex items-start gap-3 py-2 text-zinc-700">
      <div className="pt-0.5">
        <StatusIcon status={item.status} />
      </div>
      <a
        href={item.href}
        className={cn("text-sm hover:underline")}
        title={item.title}>
        {item.status === "current" ? <strong>{item.title}</strong> : item.title}
        {item.free ? <SmallFreeTag /> : null}
      </a>
    </div>
  );
};

const CategoryHeader: React.FC<{
  title: string;
  completedCount: number;
  totalCount: number;
  expanded: boolean;
  onToggle: () => void;
}> = ({ title, completedCount, totalCount, expanded, onToggle }) => {
  return (
    <div className="py-3 flex items-center justify-between text-zinc-600">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full text-start items-center gap-4 font-semibold"
        aria-expanded={expanded}
        aria-controls={title}>
        {expanded ? (
          <IoChevronUp className="text-lg" />
        ) : (
          <IoChevronDown className="text-lg" />
        )}
        <span>{title}</span>
        <div className="text-sm ml-auto">
          {completedCount}/{totalCount}
        </div>
      </button>
    </div>
  );
};

// ——— Main component ————————————————————————————————————————————————

export default function SidebarModules() {
  // open the first category by default (to mirror the original “show”)
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DATA.forEach((c, idx) => (initial[c.id] = idx === 0));
    return initial;
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const totals = useMemo(() => {
    const done = DATA.reduce((acc, c) => acc + c.completedCount, 0);
    const total = DATA.reduce((acc, c) => acc + c.totalCount, 0);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }, []);

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const sideBarToggle = () => setSidebarOpen((isSidebarOpen) => !isSidebarOpen);

  return (
    <section className={cn([inter.className, "relative min-h-screen"])}>
      <Navbar isBordered maxWidth="full" className="md:px-2">
        {/* <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-full">
            <Link
              href={"#"}
              className="flex text-prime items-center w-full gap-x-4">
              <FaArrowLeft size={20} />
              <p className="font-semibold w-[99%] hidden md:flex overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                Menjadi Admin Profesional: Microsoft Office Word
              </p>
            </Link>
          </NavbarItem>
        </NavbarContent> */}
        <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-[85%]">
            <Link
              href="#"
              className="flex text-prime items-center w-full gap-x-4 overflow-hidden">
              <FaArrowLeft size={20} />
              <p className="font-semibold hidden md:block truncate flex-1">
                Menjadi Admin Profesional: Microsoft Office Word
              </p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="center" className="">
          <Image
            src="/images/logo-full.png"
            alt="brand logo"
            height={34}
            width={128}
          />
        </NavbarContent>
        <NavbarContent justify="end" className="max-w-1/2">
          <NavbarItem className="md:hidden">
            <button
              onClick={sideBarToggle}
              className="flex text-2xl text-prime items-center gap-x-2">
              {!isSidebarOpen ? <RiMenuFold4Line /> : <RiMenuUnfold4Line />}
            </button>
          </NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
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
            isSidebarOpen
              ? "translate-x-0 md:-mt-10 md:sticky"
              : "-translate-x-[350px]",
            "fixed top-16 bottom-0 left-0 w-[350px] z-10 bg-white shadow-lg border-x border-abu",
            "transition-transform duration-[400ms]",
            "md:top-16 md:bottom-auto md:h-[calc(100vh-8rem)]",
          ])}>
          <div className="flex h-full flex-col">
            {/* Header (non-scrolling) */}
            <header className="shrink-0 flex items-center justify-between pl-7 pr-4 py-5 border-abu">
              <h5 className="font-bold 2xl:text-xl text-lg m-0">
                Daftar Modul
              </h5>
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
            {/* Progress summary */}
            <section className="p-5 bg-[#fafafa] border-y shrink-0 border-abu ">
              <div className="space-y-3">
                <ProgressBar value={totals.pct} />
                <div className="text-sm text-zinc-700">
                  {totals.pct}% Selesai
                </div>
              </div>
            </section>

            {/* Categories */}
            <section className="flex-1 overflow-y-auto overscroll-contain px-5 mt-2 pb-5 scrollbar-hide">
              {DATA.map((cat) => (
                <div key={cat.id} className="first:border-t-0 border-abu py-1">
                  <CategoryHeader
                    title={cat.title}
                    completedCount={cat.completedCount}
                    totalCount={cat.totalCount}
                    expanded={!!open[cat.id]}
                    onToggle={() => toggle(cat.id)}
                  />

                  {/* Collapsible list */}
                  <div
                    className={cn([
                      "pl-5 ml-2.5 border-l-2 border-abu transition-[max-height] overflow-hidden duration-500",
                      open[cat.id] ? "mb-3 max-h-96" : "max-h-0",
                    ])}>
                    {cat.items.length === 0 ? (
                      <div className="text-sm text-zinc-500 pb-3">
                        (Belum ada item.)
                      </div>
                    ) : (
                      cat.items.map((item, i) => (
                        <ModuleRow key={i} item={item} />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </aside>
        <article className="mx-auto md:-mt-14 -mt-3 mb-16 max-w-3xl px-5 py-8 lg:py-10 text-zinc-800">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e40af]">
              Mekanisme Belajar
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-700">
              Selamat datang di{" "}
              <span className="font-semibold">
                Kursus Microsoft Office Word – Prima Bina Insani Profesional
              </span>
              . Sebelum memulai pembelajaran, penting bagi Anda untuk memahami
              tahapan, metode belajar, dan fasilitas yang tersedia agar proses
              belajar berjalan efektif dan terarah.
            </p>
          </header>

          {/* Materi Pembelajaran */}
          <section className="space-y-5">
            <span className="flex justify-between">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <LuBookOpen className="h-6 w-6 text-[#1e40af]" />
                Materi Pembelajaran
              </h2>
              <Button className="bg-prime text-white font-semibold" radius="sm">
                Mulai Belajar
              </Button>
            </span>

            {/* Materi Bacaan */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LuBookOpen className="h-5 w-5 text-[#1e40af]" />
                Materi Bacaan
              </h3>
              <p className="mt-2 leading-7 text-zinc-700">
                Materi dalam kursus ini sebagian besar disajikan dalam bentuk
                teks yang sistematis dan mudah dipahami. Format ini dipilih
                karena efektif untuk memperdalam pemahaman dan memudahkan
                peserta dalam mempraktikkan langsung langkah-langkah penggunaan
                Microsoft Word.
              </p>
            </div>

            {/* Video Pembelajaran */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LuVideo className="h-5 w-5 text-[#1e40af]" />
                Video Pembelajaran
              </h3>
              <p className="mt-2 leading-7 text-zinc-700">
                Beberapa materi juga disampaikan melalui video yang memberikan
                penjelasan praktis dan visual. Terdapat video yang{" "}
                <span className="font-medium">
                  tidak dapat dipercepat atau di-skip
                </span>
                , sehingga pastikan Anda meluangkan waktu secara khusus untuk
                menyimak video hingga selesai.
              </p>
            </div>

            {/* Forum Diskusi / Grup Belajar */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaUserSecret className="h-5 w-5 text-[#1e40af]" />
                Forum Diskusi atau Grup Belajar
              </h3>
              <p className="mt-2 leading-7 text-zinc-700">
                Setiap peserta akan tergabung dalam forum atau grup belajar yang
                difasilitasi oleh instruktur. Di forum ini, Anda dapat bertanya,
                berdiskusi, serta berbagi pengetahuan dengan peserta lainnya.
                Partisipasi aktif sangat disarankan untuk memperkuat pemahaman
                materi.
              </p>
              <p className="mt-2 leading-7 text-zinc-700">
                Jika Anda mengalami kendala teknis atau administrasi, silakan
                hubungi admin melalui kontak resmi.
                <span className="font-medium">
                  {" "}
                  Mohon tidak menggunakan grup diskusi untuk pertanyaan bersifat
                  teknis pribadi.
                </span>
              </p>
            </div>
          </section>

          {/* Evaluasi Pembelajaran */}
          <section className="space-y-5 mt-10">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <LuClipboardCheck className="h-6 w-6 text-[#1e40af]" />
              Evaluasi Pembelajaran
            </h2>

            {/* Kuis & Ujian Akhir */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LuClipboardCheck className="h-5 w-5 text-[#1e40af]" />
                Kuis dan Ujian Akhir
              </h3>
              <p className="mt-2 leading-7 text-zinc-700">
                Tersedia kuis-kuis kecil pada setiap bagian materi untuk
                mengevaluasi pemahaman Anda, serta ujian akhir kelas yang
                mencakup keseluruhan materi. Jika terdapat soal yang sulit
                dijawab, sebaiknya Anda mengulang kembali materi yang
                bersangkutan.
              </p>
            </div>

            {/* Tugas / Submission */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LuFileCheck2 className="h-5 w-5 text-[#1e40af]" />
                Tugas atau Submission
              </h3>
              <p className="mt-2 leading-7 text-zinc-700">
                Setiap peserta akan diberikan tugas praktik berupa dokumen
                Microsoft Word yang harus dikerjakan secara mandiri dan diunggah
                sebagai bukti pemahaman. Tugas ini akan diperiksa oleh
                instruktur.
              </p>
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
                <p className="text-sm leading-6">
                  <span className="font-semibold">Penting:</span> Kerjakan tugas
                  secara jujur. Segala bentuk plagiasi akan dikenai sanksi,
                  mulai dari peringatan hingga dikeluarkan dari kelas.
                </p>
              </div>
            </div>
          </section>

          {/* Catatan Tambahan */}
          <section className="space-y-4 mt-10">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FaInfo className="h-6 w-6 text-[#1e40af]" />
              Catatan Tambahan
            </h2>
            <ul className="list-disc pl-6 leading-7 text-zinc-700 space-y-2">
              <li>
                Informasi lebih lanjut mengenai sistem penilaian, tenggat waktu,
                dan sertifikat akan dijelaskan oleh instruktur di awal
                pertemuan.
              </li>
              <li>
                Pastikan perangkat Anda sudah terinstal Microsoft Word dan
                memiliki koneksi internet yang stabil jika mengikuti kursus
                secara online.
              </li>
              <li>
                Gunakan waktu belajar sebaik mungkin, dan jangan ragu untuk
                bertanya jika mengalami kesulitan.
              </li>
            </ul>
            <p className="mt-2 text-zinc-700">
              Selamat belajar dan semoga Anda mendapatkan manfaat maksimal dari
              kursus ini.
              <br />
              <span className="font-semibold">
                Prima Bina Insani Profesional – Mengasah Keterampilan, Membangun
                Masa Depan.
              </span>
            </p>
          </section>
        </article>
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
          <p className="font-semibold md:w-1/3 text-center text-nowrap truncate px-4 md:px-0">
            Pengenalan Kursus
          </p>

          {/* Right */}
          <button className="flex cursor-pointer text-prime justify-end items-center gap-x-4 md:w-1/3 ">
            <p className="font-semibold md:block text-nowrap hidden text-end w-2/3 truncate">
              Persyaratan Dasar
            </p>
            <LuCircleChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * NOTES (what I normalized & made DRY):
 * 1) Replaced all inline SVGs with react-icons:
 *    - Close button -> IoClose
 *    - Expand/collapse chevron -> IoChevronDown/IoChevronUp
 *    - Status icons -> HiCheckCircle (done), LuCircle (current/pending)
 * 2) Extracted repeated chunks into components:
 *    - ProgressBar, StatusIcon, ModuleRow, CategoryHeader
 * 3) Content is purely data-driven:
 *    - DATA array holds categories and nested items.
 *    - UI maps over DATA; no duplicated markup.
 * 4) Collapse state:
 *    - Managed with a dictionary keyed by category id.
 * 5) Progress:
 *    - Derived once via useMemo from DATA (done/total -> %).
 */
