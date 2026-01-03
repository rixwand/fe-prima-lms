import * as React from "react";
import { IoMenu } from "react-icons/io5";

import { cn } from "@/libs/tiptap/tiptap-utils";

type HeaderProps = {
  isDesktop: boolean;
  openSidebar: () => void;
  sidebarId: string;
  isSidebarOpen: boolean;
  courseTitle: string;
  breadcrumb: string;
};

export const SimpleEditorHeader = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ isDesktop, openSidebar, sidebarId, isSidebarOpen, courseTitle, breadcrumb }, ref) => (
    <header
      ref={ref}
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
      <div className="text-base font-normal text-[var(--tt-theme-text)]">{breadcrumb}</div>
    </header>
  )
);

SimpleEditorHeader.displayName = "SimpleEditorHeader";
