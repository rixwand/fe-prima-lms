// SidebarModules.tsx
import React, { useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { LuCircle, LuCircleCheckBig } from "react-icons/lu";
import cn from "@/libs/utils/cn";
import { GoDot } from "react-icons/go";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";

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

const DATA: ModuleCategory[] = [
  {
    id: "module-1",
    title: "Persiapan Belajar",
    completedCount: 1,
    totalCount: 7,
    items: [
      {
        title: "Persetujuan Hak Cipta",
        href: "https://www.dicoding.com/academies/590/tutorials/32015",
        free: true,
        status: "done",
      },
      {
        title: "Prasyarat Kemampuan",
        href: "https://www.dicoding.com/academies/590/tutorials/32020",
        free: true,
        status: "current",
      },
      {
        title: "Prasyarat Tools",
        href: "https://www.dicoding.com/academies/590/tutorials/32025",
        free: true,
        status: "pending",
      },
      {
        title: "Mekanisme Belajar",
        href: "https://www.dicoding.com/academies/590/tutorials/32030",
        free: true,
        status: "pending",
      },
      {
        title: "Forum Diskusi",
        href: "https://www.dicoding.com/academies/590/tutorials/32035",
        status: "pending",
      },
      {
        title: "Glossarium",
        href: "https://www.dicoding.com/academies/590/tutorials/32040",
        status: "pending",
      },
      {
        title: "Daftar Referensi",
        href: "https://www.dicoding.com/academies/590/tutorials/32045",
        status: "pending",
      },
    ],
  },
  {
    id: "module-8",
    title: "Manajemen Proyek Data Science",
    completedCount: 0,
    totalCount: 7,
    items: [
      {
        title: "Pengenalan Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32050",
        status: "pending",
      },
      {
        title: "Tantangan dalam Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32055",
        status: "pending",
      },
      {
        title: "Tahapan dalam Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32060",
        status: "pending",
      },
      {
        title: "Metodologi Manajemen Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32065",
        status: "pending",
      },
      {
        title: "Estimasi Kebutuhan Resource dalam Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32070",
        status: "pending",
      },
      {
        title: "Rangkuman Manajemen Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32075",
        status: "pending",
      },
      {
        title: "Kuis Manajemen Proyek Data Science",
        href: "https://www.dicoding.com/academies/590/tutorials/32080",
        status: "pending",
      },
    ],
  },
  {
    id: "module-15",
    title: "Keterampilan Teknis Data Scientist",
    completedCount: 0,
    totalCount: 9,
    items: [], // not expanded in the original snippet
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
    return <LuCircleCheckBig className="text-emerald-500 text-base" />;
  }
  if (status === "current") {
    // a thicker outlined circle to hint “in progress”
    return <LuCircle className="text-emerald-500 -ml-2" />;
  }
  return <GoDot className="text-zinc-400 text-base" />;
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
    <div className="flex items-start gap-3 py-2">
      <div className="pt-0.5">
        <StatusIcon status={item.status} />
      </div>
      <a
        href={item.href}
        className={cn(
          "text-sm hover:underline",
          item.status === "current" ? "font-semibold" : "font-normal"
        )}
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
    <div className="py-3 flex items-center justify-between text-gray-500">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full text-start items-center gap-4 font-semibold"
        aria-expanded={expanded}
        aria-controls={title}>
        {expanded ? (
          <IoChevronUp className="text-zinc-600 text-lg" />
        ) : (
          <IoChevronDown className="text-zinc-600 text-lg" />
        )}
        <span>{title}</span>
        <div className="text-sm ml-auto text-zinc-600">
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

  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
    <section>
      <button
        onClick={sideBarToggle}
        className={cn([
          isSidebarOpen ? "translate-x-0" : "translate-x-12",
          "absolute cursor-pointer delay-700 duration-300 -left-12 transition-transform top-[22px] bg-prime pl-2 pr-4 rounded-r-full py-2",
        ])}>
        <RiMenuFold4Line className="text-2xl text-white" />
      </button>
      <aside
        id="sidebar-navigation-v3"
        className="w-[350px] bg-white shadow-lg border border-abu min-h-screen rounded-lg transition-transform duration-400 relative z-10"
        style={{
          transform: isSidebarOpen ? "translateX(0px)" : "translateX(-350px)",
        }}>
        {/* Header */}
        <header className="flex items-center justify-between pl-7 pr-4 py-5 border-abu">
          <h5 className="font-extrabold 2xl:text-xl text-lg m-0">
            Daftar Modul
          </h5>
          <div>
            <button
              onClick={sideBarToggle}
              id="sidebar-navigation-btn-close"
              className="cursor-pointer"
              aria-label="Close sidebar">
              <RiMenuUnfold4Line className="text-3xl text-zinc-800" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="pb-5">
          {/* Progress summary */}
          <section className="p-5 bg-[#fafafa] border-t border-b border-abu ">
            <div className="space-y-3">
              <ProgressBar value={totals.pct} />
              <div className="text-sm text-zinc-700">{totals.pct}% Selesai</div>
            </div>
          </section>

          {/* Categories */}
          <section className="px-5 mt-2">
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
