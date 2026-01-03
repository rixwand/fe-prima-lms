import * as React from "react";

import { cn } from "@/libs/tiptap/tiptap-utils";

import { findFirstSelectableLesson } from "@/libs/utils/course";
import { StateType } from "@/types/Helper";
import { SimpleEditorHeader } from "./simple-editor-layout-header";
import { SimpleEditorSidebar } from "./simple-editor-layout-sidebar";
import { SimpleEditorLayoutProvider } from "./simple-editor-layout.context";

export { useSimpleEditorLayoutContext } from "./simple-editor-layout.context";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type SimpleEditorLayoutProps = React.PropsWithChildren<{
  structure: CourseSection[];
  className?: string;
  courseTitle: string;
  lessonState: StateType<Lesson | null>;
}>;

export const SimpleEditorLayout: React.FC<SimpleEditorLayoutProps> = ({
  children,
  structure,
  className,
  courseTitle,
  lessonState,
}) => {
  const sidebarId = React.useId();
  const [activeLesson, setActiveLesson] = lessonState;
  const [activePath, setActivePath] = React.useState<string[]>([]);
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const [toolbarOffset, setToolbarOffset] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const openSidebar = React.useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = React.useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleSelect = React.useCallback(
    (_section: CourseSection, lesson: Lesson, path: string[]) => {
      setActiveLesson(lesson);
      setActivePath(path);
      if (!isDesktop) {
        closeSidebar();
      }
    },
    [closeSidebar, isDesktop]
  );

  React.useEffect(() => {
    if (activeLesson || structure.length === 0) return;

    const firstSelectable = findFirstSelectableLesson(structure);
    if (firstSelectable) {
      setActiveLesson(firstSelectable.lesson);
      setActivePath(firstSelectable.path);
    }
  }, [activeLesson, structure]);

  React.useEffect(() => {
    const updateOffset = () => {
      const height = headerRef.current?.getBoundingClientRect().height ?? 0;
      setToolbarOffset(height);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      resizeObserver = new ResizeObserver(updateOffset);
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateOffset);
      resizeObserver?.disconnect();
    };
  }, []);

  const toolbarOffsetStyle = React.useMemo(
    () => ({ "--tt-toolbar-offset": `${toolbarOffset}px` } as React.CSSProperties),
    [toolbarOffset]
  );

  const contentStyle = React.useMemo(() => {
    if (isDesktop) {
      return toolbarOffsetStyle;
    }

    return {
      ...toolbarOffsetStyle,
      marginTop: toolbarOffset > 0 ? toolbarOffset + 16 : 16,
    } as React.CSSProperties;
  }, [isDesktop, toolbarOffset, toolbarOffsetStyle]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateMatches = (matches: boolean) => {
      setIsDesktop(matches);
    };

    const handleChange = (event: MediaQueryListEvent) => {
      updateMatches(event.matches);
    };

    const legacyListener = function (this: MediaQueryList, event: MediaQueryListEvent) {
      updateMatches(event.matches);
    };

    updateMatches(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(legacyListener);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(legacyListener);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar, isSidebarOpen]);

  React.useEffect(() => {
    if (isDesktop) {
      closeSidebar();
    }
  }, [closeSidebar, isDesktop]);

  const contextValue = React.useMemo(
    () => ({
      isDesktop,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
    }),
    [closeSidebar, isDesktop, isSidebarOpen, openSidebar]
  );

  const breadcrumb = React.useMemo(
    () => (activeLesson ? activePath.join(" / ") : "Select a lesson"),
    [activeLesson, activePath]
  );

  return (
    <SimpleEditorLayoutProvider value={contextValue}>
      <div
        style={toolbarOffsetStyle}
        className={cn(
          "flex min-h-screen flex-col bg-[var(--tt-bg-color)] text-[var(--tt-theme-text)] lg:h-screen lg:flex-row",
          className
        )}>
        <SimpleEditorSidebar
          structure={structure}
          activeLessonId={activeLesson?.id ?? null}
          onSelect={handleSelect}
          isDesktop={isDesktop}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
          sidebarId={sidebarId}
        />

        <section className="relative flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <SimpleEditorHeader
              ref={headerRef}
              isDesktop={isDesktop}
              openSidebar={openSidebar}
              sidebarId={sidebarId}
              isSidebarOpen={isSidebarOpen}
              courseTitle={courseTitle}
              breadcrumb={breadcrumb}
            />

            <div className="flex flex-1 flex-col bg-inherit px-4 pb-6 pt-4 lg:px-8" style={contentStyle}>
              {children}
            </div>
          </div>
        </section>
      </div>
    </SimpleEditorLayoutProvider>
  );
};
