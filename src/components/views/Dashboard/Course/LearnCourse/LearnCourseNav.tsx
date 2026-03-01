import AvatarProfile from "@/components/commons/AvatarProfile";
import useLearnCourse from "@/hooks/course/useLearnCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import cn from "@/libs/utils/cn";
import learnQueries from "@/queries/learn-queries";
import { Navbar, NavbarContent, NavbarItem, Progress } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, ReactNode, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { LuCircle, LuCircleCheckBig, LuCircleChevronLeft, LuCircleChevronRight } from "react-icons/lu";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";

type LessonPath = {
  sectionId: number;
  lessonId: number;
  slug: string;
  title: string;
};

type Props = {
  children: ReactNode;
  activeCourseSlug: string;
  activeLesson: string | null;
  nextLesson: LessonPath | null;
  previousLesson: LessonPath | null;
  currentLesson: LessonPath | null;
  data: CourseCurriculum;
};

export default function LearnCourseNav({
  children,
  activeCourseSlug,
  activeLesson,
  data,
  nextLesson,
  previousLesson,
  currentLesson,
}: Props) {
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    data.sections.forEach((s, idx) => (initial[s.id] = idx === 0));
    return initial;
  });
  const [gsOpen, setGsOpen] = useState(!activeLesson);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const qc = useQueryClient();
  const { completeLesson, isLoading } = useLearnCourse({
    onLessonComplete() {
      qc.invalidateQueries({
        queryKey: learnQueries.keys.getLearningCurriculum(activeCourseSlug),
      });
    },
  });
  const totals = useMemo(() => {
    if (!data.sections?.length) {
      return { done: 0, total: 0, pct: 0 };
    }

    let done = 0;
    let total = 0;

    for (const section of data.sections) {
      for (const lesson of section.lessons) {
        total++;

        if (lesson.lessonProgress[0]?.status === "COMPLETED") {
          done++;
        }
      }
    }

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return { done, total, pct };
  }, [data]);

  const toggle = (id: number) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  const handleNextLesson = () =>
    currentLesson ? completeLesson({ slug: activeCourseSlug, lessonId: currentLesson.lessonId }) : null;
  const sideBarToggle = () => setSidebarOpen(isSidebarOpen => !isSidebarOpen);
  useNProgress(hasTrue(isLoading));
  return (
    <Fragment>
      <Navbar isBordered maxWidth="full" className="md:px-2">
        <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-[85%]">
            <Link href="/dashboard/course" className="flex text-prime items-center w-full gap-x-4 overflow-hidden">
              <FaArrowLeft size={20} />
              <p className="font-semibold hidden md:block truncate flex-1">{data.title}</p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="center" className="">
          <Image src="/images/logo-full.png" alt="brand logo" height={34} width={128} />
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
      <div className="flex justify-between">
        <aside
          // when hide, position fixed or absolute instead sticky
          className={cn([
            isSidebarOpen ? "translate-x-0 md:-mt-10 md:sticky" : "-translate-x-[350px]",

            // layout
            "fixed top-16 bottom-0 left-0 w-[350px] z-10",
            "md:top-16 md:bottom-auto md:h-[calc(100vh-8rem)]",

            // glass effect
            "bg-white/60 dark:bg-neutral-900/60",
            "backdrop-blur-xl backdrop-saturate-150",
            "border-r border-white/20 dark:border-white/10",
            "shadow-xl shadow-black/10",

            // animation
            "transition-transform duration-[400ms]",
          ])}
          // className={cn([
          //   // mobile: slide-in panel, fixed to viewport
          //   isSidebarOpen ? "translate-x-0 md:-mt-10 md:sticky" : "-translate-x-[350px]",
          //   "fixed top-16 bottom-0 left-0 w-[350px] z-10 bg-white shadow-lg border-x border-abu",
          //   "transition-transform duration-[400ms]",
          //   "md:top-16 md:bottom-auto md:h-[calc(100vh-8rem)]",
          // ])}
        >
          <div className="flex h-full flex-col">
            {/* Header (non-scrolling) */}
            <header className="shrink-0 flex items-center justify-between pl-7 pr-4 py-5 border-abu">
              <h5 className="font-bold 2xl:text-xl text-lg m-0 text-blue-800">Daftar Modul</h5>
              <div className="hidden md:block">
                <button
                  onClick={sideBarToggle}
                  id="sidebar-navigation-btn-close"
                  className="cursor-pointer"
                  aria-label="Close sidebar">
                  <RiMenuUnfold4Line className="text-2xl text-zinc-800" />
                </button>
              </div>
            </header>
            {/* Progress summary */}
            <section className="p-5 border-y shrink-0 border-abu ">
              <div className="space-y-3">
                {/* <ProgressBar value={totals.pct} /> */}
                <Progress value={totals.pct} color="primary" isStriped />
                <div className="text-sm text-zinc-700">{totals.pct}% Selesai</div>
              </div>
            </section>

            {/* Categories */}
            <section className="flex-1 overflow-y-auto overscroll-contain px-5 mt-2 pb-5 scrollbar-hide">
              <div key={"getting-start"} className="first:border-t-0 border-abu py-1">
                <CategoryHeader
                  title="Getting Started"
                  totalCount={1}
                  completedCount={1}
                  expanded={gsOpen}
                  onToggle={() => setGsOpen(v => !v)}
                />
                <div
                  className={cn([
                    "pl-5 ml-2 border-l-2 border-abu transition-[max-height] overflow-hidden duration-500",
                    gsOpen ? "mb-3 max-h-96" : "max-h-0",
                  ])}>
                  <ModuleRow
                    activeLesson={"/"}
                    activeCourseSlug={activeCourseSlug}
                    key={"intro"}
                    item={{
                      slug: "/",
                      id: 0,
                      isPreview: true,
                      title: "Introducing into course",
                      sectionId: 0,
                      durationSec: 300,
                      lessonProgress: [{ status: "COMPLETED" }],
                    }}
                  />
                </div>
              </div>
              {data.sections.map(section => (
                <div key={section.id} className="first:border-t-0 border-abu py-1">
                  <CategoryHeader
                    title={section.title}
                    completedCount={section.lessons.filter(l => l.lessonProgress?.[0]?.status === "COMPLETED").length}
                    totalCount={section.lessons.length}
                    expanded={!!open[section.id]}
                    onToggle={() => toggle(section.id)}
                  />

                  {/* Collapsible list */}
                  <div
                    className={cn([
                      "pl-5 ml-2 border-l-2 border-abu transition-[max-height] overflow-hidden duration-500",
                      open[section.id] ? "mb-3 max-h-96" : "max-h-0",
                    ])}>
                    {section.lessons.length === 0 ? (
                      <div className="text-sm text-zinc-500 pb-3">(Belum ada item.)</div>
                    ) : (
                      section.lessons.map((item, i) => (
                        <ModuleRow
                          activeLesson={activeLesson}
                          activeCourseSlug={activeCourseSlug}
                          key={i}
                          item={item}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </aside>
        {children}
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 border-t border-gray-300 bg-white py-5">
        <div className="flex w-full items-center justify-between px-6">
          {/* Left */}
          {!activeLesson ? (
            <div className="w-2/3 md:w-1/3"></div>
          ) : previousLesson ? (
            <Link
              href={`/learn/${activeCourseSlug}/${previousLesson.slug}`}
              className="flex cursor-pointer md:w-1/3 disabled:text-prime/50 text-prime items-center gap-x-2 ">
              <LuCircleChevronLeft size={24} />
              <p className="font-semibold text-nowrap w-2/3 truncate">{previousLesson.title}</p>
            </Link>
          ) : (
            <Link
              href={`/learn/${activeCourseSlug}/`}
              className="flex cursor-pointer md:w-1/3 disabled:text-prime/50 text-prime items-center gap-x-2 ">
              <LuCircleChevronLeft size={24} />
              <p className="font-semibold text-nowrap w-2/3 truncate">Introducing into course</p>
            </Link>
          )}

          {/* Center */}
          <p className="font-semibold md:w-1/3 text-center text-nowrap truncate px-4 md:px-0">
            {currentLesson ? currentLesson.title : "Introducing to course"}
          </p>

          {/* Right */}
          {nextLesson ? (
            <Link
              onClick={handleNextLesson}
              href={`/learn/${activeCourseSlug}/${nextLesson.slug}`}
              className="flex cursor-pointer text-prime justify-end items-center gap-x-3 md:w-1/3 ">
              <p className="font-semibold md:block text-nowrap hidden text-end w-2/3 truncate">{nextLesson.title}</p>
              <LuCircleChevronRight size={24} />
            </Link>
          ) : (
            <button
              onClick={handleNextLesson}
              className="flex cursor-pointer text-prime justify-end items-center gap-x-3 md:w-1/3 ">
              <p className="font-semibold md:block text-nowrap hidden text-end w-2/3 truncate">Selesai</p>
              <LuCircleCheckBig size={20} />
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

const StatusIcon: React.FC<{ status: LessonProgressStatus; isCurrent: boolean }> = ({ isCurrent, status }) => {
  if (status === "COMPLETED") {
    return <LuCircleCheckBig className="text-prime text-base" />;
  }
  if (isCurrent) {
    // a thicker outlined circle to hint “in progress”
    return <LuCircle className="text-prime" />;
  }
  return <GoDotFill className="text-zinc-300 text-xs" />;
};

const SmallFreeTag: React.FC = () => <small className="text-zinc-500 ml-1">(Gratis)</small>;

// ——— Items ————————————————————————————————————————————————————————

const ModuleRow: React.FC<{
  item: CourseCurriculum["sections"][number]["lessons"][number];
  activeLesson: string | null;
  activeCourseSlug: string;
  isCurrent?: boolean;
}> = ({ item, activeLesson, activeCourseSlug }) => {
  return (
    <div className="flex items-start gap-3 py-2 text-zinc-700">
      <div className="pt-0.5">
        <StatusIcon status={item.lessonProgress[0].status} isCurrent={item.slug == activeLesson} />
      </div>
      <a href={`/learn/${activeCourseSlug}/${item.slug}`} className={cn("text-sm hover:underline")} title={item.title}>
        {item.slug == activeLesson ? <strong>{item.title}</strong> : item.title}
        {item.isPreview ? <SmallFreeTag /> : null}
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
        {expanded ? <IoChevronUp className="text-lg" /> : <IoChevronDown className="text-lg" />}
        <span>{title}</span>
        <div className="text-sm ml-auto">
          {completedCount}/{totalCount}
        </div>
      </button>
    </div>
  );
};
