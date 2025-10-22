import * as React from "react";

import { IoChevronDown, IoChevronForward, IoClose, IoDocumentTextOutline, IoMenu } from "react-icons/io5";

import { cn } from "@/lib/tiptap-utils";

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  position: number;
  isPreview: boolean;
}

export interface CourseSection {
  id: number;
  title: string;
  position: number;
  lessons: Lesson[];
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const findFirstSelectableLesson = (
  sections: CourseSection[]
): { section: CourseSection; lesson: Lesson; path: string[] } | null => {
  for (const section of sections) {
    if (section.lessons.length === 0) continue;
    const lesson = section.lessons[0];
    return {
      section,
      lesson,
      path: [section.title, lesson.title],
    };
  }
  return null;
};

const DEFAULT_COURSE_SECTIONS: CourseSection[] = [
  {
    id: 1,
    title: "Getting Started",
    position: 1,
    lessons: [
      { id: 101, slug: "welcome", title: "Welcome to the Course", position: 1, isPreview: true },
      { id: 102, slug: "setup", title: "Environment Setup", position: 2, isPreview: false },
      { id: 103, slug: "tour", title: "Editor Walkthrough", position: 3, isPreview: false },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    position: 2,
    lessons: [
      { id: 201, slug: "content-blocks", title: "Working with Content Blocks", position: 1, isPreview: false },
      { id: 202, slug: "media", title: "Media Embeds", position: 2, isPreview: false },
      { id: 203, slug: "collaboration", title: "Collaboration Tips", position: 3, isPreview: false },
    ],
  },
  {
    id: 3,
    title: "Going Further",
    position: 3,
    lessons: [
      { id: 301, slug: "customization", title: "Customizing the Editor", position: 1, isPreview: false },
      { id: 302, slug: "publishing", title: "Publishing Workflows", position: 2, isPreview: false },
      { id: 303, slug: "automation", title: "Automation Ideas", position: 3, isPreview: false },
    ],
  },
];

const DEFAULT_COURSE_TITLE = "Tiptap Editor Course";

type SimpleEditorLayoutContextValue = {
  isDesktop: boolean;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SimpleEditorLayoutContext = React.createContext<SimpleEditorLayoutContextValue | undefined>(undefined);

export const useSimpleEditorLayoutContext = () => React.useContext(SimpleEditorLayoutContext);

type FolderTreeProps = {
  courseSections: CourseSection[];
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
};

const FolderTree: React.FC<FolderTreeProps> = ({ courseSections, activeLessonId, onSelect }) => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0" role="tree">
    {courseSections.map(section => (
      <CourseSectionItem key={section.id} section={section} activeLessonId={activeLessonId} onSelect={onSelect} />
    ))}
  </ul>
);

const CourseSectionItem: React.FC<{
  section: CourseSection;
  activeLessonId?: number | null;
  onSelect: (section: CourseSection, lesson: Lesson, path: string[]) => void;
}> = ({ section, activeLessonId, onSelect }) => {
  const containsActiveLesson = React.useMemo(
    () => section.lessons.some(lesson => lesson.id === activeLessonId),
    [section.lessons, activeLessonId]
  );
  const [isOpen, setIsOpen] = React.useState(containsActiveLesson);

  React.useEffect(() => {
    if (containsActiveLesson) {
      setIsOpen(true);
    }
  }, [containsActiveLesson]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <li
      className="list-none"
      role="treeitem"
      aria-expanded={section.lessons.length > 0 ? isOpen : undefined}
      aria-selected={containsActiveLesson}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[var(--tt-theme-text)] transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0",
          containsActiveLesson
            ? "bg-[var(--tt-gray-light-a-200)] text-[var(--tt-theme-text)] shadow-sm dark:bg-[var(--tt-gray-dark-a-200)]"
            : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]"
        )}
        onClick={handleToggle}>
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-text-muted)]">
          {section.lessons.length > 0 ? isOpen ? <IoChevronDown /> : <IoChevronForward /> : null}
        </span>
        <span className="flex-1 truncate text-sm font-medium text-left">{section.title}</span>
      </button>

      {isOpen ? (
        <ul
          className="mt-1 ml-4 flex list-none flex-col gap-1 border-l border-[var(--tt-border-color)] pl-3"
          role="group">
          {section.lessons.map(lesson => {
            const isActiveLesson = lesson.id === activeLessonId;
            const path = [section.title, lesson.title];

            const handleSelectLesson = () => {
              onSelect(section, lesson, path);
            };

            return (
              <li key={lesson.id} className="list-none" role="treeitem" aria-selected={isActiveLesson}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border-l-2 border-transparent px-2 py-1.5 pl-3 text-left text-[var(--tt-theme-text)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0",
                    isActiveLesson
                      ? "border-[var(--tt-brand-color-500)] bg-[var(--tt-brand-color-100)] text-[var(--tt-theme-text)] font-medium dark:border-[var(--tt-brand-color-400)] dark:bg-[rgba(122,82,255,0.15)]"
                      : "hover:bg-[var(--tt-gray-light-a-100)] dark:hover:bg-[var(--tt-gray-dark-a-100)]"
                  )}
                  onClick={handleSelectLesson}>
                  <span
                    className={cn(
                      "block h-2 w-2 shrink-0 rounded-full",
                      isActiveLesson
                        ? "bg-[var(--tt-brand-color-500)] dark:bg-[var(--tt-brand-color-400)]"
                        : "bg-transparent"
                    )}
                  />
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tt-theme-text-muted)]">
                    <IoDocumentTextOutline />
                  </span>
                  <span className="flex-1 truncate text-sm text-left">{lesson.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
};

type SimpleEditorLayoutProps = React.PropsWithChildren<{
  structure?: CourseSection[];
  className?: string;
  courseTitle?: string;
}>;

export const SimpleEditorLayout: React.FC<SimpleEditorLayoutProps> = ({
  children,
  structure = DEFAULT_COURSE_SECTIONS,
  className,
  courseTitle = DEFAULT_COURSE_TITLE,
}) => {
  const sidebarId = React.useId();
  const [activeSection, setActiveSection] = React.useState<CourseSection | null>(null);
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
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

  const handleSelect = React.useCallback((section: CourseSection, lesson: Lesson, path: string[]) => {
    setActiveSection(section);
    setActiveLesson(lesson);
    setActivePath(path);
    if (!isDesktop) {
      closeSidebar();
    }
  }, [closeSidebar, isDesktop]);

  React.useEffect(() => {
    if (activeLesson || structure.length === 0) return;

    const firstSelectable = findFirstSelectableLesson(structure);
    if (firstSelectable) {
      setActiveSection(firstSelectable.section);
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
      // Safari < 14 support
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

  return (
    <SimpleEditorLayoutContext.Provider value={contextValue}>
      <div
        style={toolbarOffsetStyle}
        className={cn(
          "flex min-h-screen flex-col bg-[var(--tt-bg-color)] text-[var(--tt-theme-text)] lg:h-screen lg:flex-row",
          className
        )}>
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
          <FolderTree courseSections={structure} activeLessonId={activeLesson?.id ?? null} onSelect={handleSelect} />
        </aside>

        <section className="relative flex flex-1 flex-col min-w-0">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <header
              ref={headerRef}
              className={cn(
                "border-b border-[var(--tt-border-color)] bg-[var(--tt-bg-color)] pb-4 pt-6",
                isDesktop ? "sticky top-0 z-20 px-8" : "fixed inset-x-0 top-0 z-30 px-4"
              )}>
              <div className="mb-2 mt-0 flex items-center gap-3">
                {!isDesktop ? (
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--tt-border-color)] bg-[var(--tt-panel-bg-color)] text-xl text-[var(--tt-theme-text)] hover:bg-[var(--tt-gray-light-a-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tt-theme-text-muted)] focus-visible:ring-offset-0"
                    aria-label="Open course navigation"
                    aria-controls={sidebarId}
                    aria-expanded={isSidebarOpen}
                    onClick={openSidebar}>
                    <IoMenu />
                  </button>
                ) : null}
                <h1 className="m-0 flex-1 text-xl font-semibold leading-snug text-[var(--tt-theme-text)]">{courseTitle}</h1>
              </div>
              <div className="text-base font-normal text-[var(--tt-theme-text)]">
                {activeLesson ? activePath.join(" / ") : "Select a lesson"}
              </div>
            </header>

            <div className="flex flex-1 flex-col bg-inherit px-4 pb-6 pt-4 lg:px-8" style={contentStyle}>
              {children}
            </div>
          </div>
        </section>
      </div>
    </SimpleEditorLayoutContext.Provider>
  );
};
