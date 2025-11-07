import * as React from "react";
import { IoClose } from "react-icons/io5";

import { cn } from "@/lib/tiptap-utils";

import { FolderTree } from "./simple-editor-layout-folder-tree";
type SidebarProps = {
  structure: CourseSection[];
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
  isDesktop: boolean;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  sidebarId: string;
};

export const SimpleEditorSidebar: React.FC<SidebarProps> = ({
  structure,
  activeLessonId,
  onSelect,
  isDesktop,
  isSidebarOpen,
  closeSidebar,
  sidebarId,
}) => (
  <>
    {isSidebarOpen && !isDesktop ? (
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
        role="presentation"
        onClick={closeSidebar}
      />
    ) : null}

    <aside
      className={cn(
        "flex flex-col gap-4 border-[var(--tt-border-color)] bg-[var(--tt-panel-bg-color)] px-4 py-5 transition-transform duration-200 ease-in-out",
        isDesktop
          ? "w-[280px] border-b-0 border-r lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:self-start lg:overflow-y-auto lg:overflow-x-hidden"
          : "fixed inset-y-0 left-0 z-50 w-[260px] max-w-[80vw] border-b shadow-lg lg:hidden",
        !isDesktop && (isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none")
      )}
      id={sidebarId}
      aria-hidden={!isDesktop && !isSidebarOpen}>
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.05em] text-[var(--tt-theme-text-subtle)]">
          Course Section
        </h2>
        {!isDesktop ? (
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--tt-border-color)] bg-[var(--tt-panel-bg-color)] text-base text-[var(--tt-theme-text)] hover:bg-[var(--tt-gray-light-a-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0"
            aria-label="Close course navigation"
            aria-controls={sidebarId}
            onClick={closeSidebar}>
            <IoClose />
          </button>
        ) : null}
      </div>
      <FolderTree courseSections={structure} activeLessonId={activeLessonId} onSelect={onSelect} />
    </aside>
  </>
);
