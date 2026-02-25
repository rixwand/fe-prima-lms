import * as React from "react";
import { IoClose } from "react-icons/io5";

import { cn } from "@/libs/tiptap/tiptap-utils";

import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { Button } from "@heroui/react";
import { LuChevronsDown, LuChevronsUp } from "react-icons/lu";
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
}) => {
  const { ids } = useLessonEditorContext();
  const expandedState = React.useState<Set<number>>(ids ? new Set([ids.sectionId]) : new Set());
  const [_, setExpanded] = expandedState;
  const sectionIds = React.useMemo(() => structure.map(s => s.id), [structure]);
  const handleExpandSections = () => setExpanded(new Set(sectionIds));
  const handleFoldSections = () => setExpanded(new Set(ids ? new Set([ids.sectionId]) : new Set()));
  return (
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
          !isDesktop && (isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"),
        )}
        id={sidebarId}
        aria-hidden={!isDesktop && !isSidebarOpen}>
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.05em] text-[var(--tt-theme-text-subtle)]">
            Course Section
          </h2>
          <span className="flex">
            <Button
              onPress={handleExpandSections}
              isIconOnly
              radius="sm"
              size="lg"
              className="reset-button p-2"
              color="primary"
              variant="light">
              <LuChevronsDown size={18} />
            </Button>

            <Button
              onPress={handleFoldSections}
              isIconOnly
              radius="sm"
              size="lg"
              className="reset-button p-2"
              color="primary"
              variant="light">
              <LuChevronsUp size={18} />
            </Button>
          </span>
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
        <FolderTree
          expandedState={expandedState}
          courseSections={structure}
          activeLessonId={activeLessonId}
          onSelect={onSelect}
        />
      </aside>
    </>
  );
};
