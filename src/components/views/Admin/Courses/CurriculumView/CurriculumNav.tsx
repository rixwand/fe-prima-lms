import PageHead from "@/components/commons/PageHead";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { useCurriculumViewContext } from "@/libs/context/CurriculumViewContext";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import courseQueries from "@/queries/course-queries";
import {
  Button,
  Link,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { useQuery } from "@tanstack/react-query";
import { Fragment, ReactNode, useState } from "react";
import {
  LuArrowLeft,
  LuCircleChevronLeft,
  LuCircleChevronRight,
  LuCircleX,
  LuEllipsisVertical,
  LuFileCheck2,
  LuFileText,
} from "react-icons/lu";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";
import { SectionsTree } from "./SectionsTree";

type Props = {
  children: ReactNode;
  sections: CourseSection[];
  courseId: number;
};

export default function CurriculumNav({ children, sections, courseId }: Props) {
  const { onSelect } = useCurriculumViewContext();
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  const { data: course, isError, error, isPending } = useQuery(courseQueries.options.getCourse(courseId));

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { activeLesson } = useCurriculumViewContext();
  const sideBarToggle = () => setSidebarOpen(isSidebarOpen => !isSidebarOpen);
  useQueryError({ isError, error });
  useNProgress(isPending);
  return (
    <Fragment>
      <PageHead title={course?.metaDraft.title} />
      <section className={cn([inter.className, "relative min-h-screen"])}>
        <Navbar isBordered maxWidth="full" className="md:px-2">
          <NavbarContent className="max-w-[calc(50%-64px)]">
            <NavbarItem className="w-[85%] flex items-center">
              <Link
                href={`/admin/dashboard/course/${activeLesson?.courseId}`}
                className="flex items-center w-full gap-x-3 overflow-hidden text-slate-700">
                <LuArrowLeft size={20} />
                <p className="font-semibold hidden md:block truncate flex-1">Curriculum Preview</p>
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="center" className="">
            <p className="font-semibold text-slate-700 truncate max-w-52 flex-1">{course?.metaDraft.title}</p>
          </NavbarContent>
          <NavbarContent justify="end" className="max-w-1/2">
            <NavbarItem className="md:hidden">
              <button onClick={sideBarToggle} className="flex text-xl items-center gap-x-2">
                {!isSidebarOpen ? <RiMenuFold4Line /> : <RiMenuUnfold4Line />}
              </button>
            </NavbarItem>
            <NavbarItem>
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    variant="light"
                    isIconOnly
                    className="reset-button py-1 px-0.5 rounded-lg hover:bg-slate-100 text-slate-700">
                    <LuEllipsisVertical size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-44">
                  <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
                    <ListboxItem onPress={e => {}} startContent={<LuFileCheck2 />} key="approve">
                      Approve
                    </ListboxItem>
                    <ListboxItem onPress={e => {}} startContent={<LuFileText />} key="notes">
                      Notes
                    </ListboxItem>
                    <ListboxItem
                      className="text-danger-400"
                      color="danger"
                      onPress={e => {}}
                      startContent={<LuCircleX />}
                      key="decline">
                      Decline
                    </ListboxItem>
                  </Listbox>
                </PopoverContent>
              </Popover>
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
    </Fragment>
  );
}
