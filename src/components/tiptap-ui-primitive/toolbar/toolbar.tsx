import * as React from "react"
import { Separator } from "@/components/tiptap-ui-primitive/separator"
import { cn } from "@/libs/tiptap/tiptap-utils"
import { useMenuNavigation } from "@/hooks/use-menu-navigation"
import { useComposedRef } from "@/hooks/use-composed-ref"

type BaseProps = React.HTMLAttributes<HTMLDivElement>

interface ToolbarProps extends BaseProps {
  variant?: "floating" | "fixed"
  position?: "sticky" | "fixed"
}

const useToolbarNavigation = (
  toolbarRef: React.RefObject<HTMLDivElement | null>
) => {
  const [items, setItems] = React.useState<HTMLElement[]>([])

  const collectItems = React.useCallback(() => {
    if (!toolbarRef.current) return []
    return Array.from(
      toolbarRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])'
      )
    )
  }, [toolbarRef])

  React.useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const updateItems = () => setItems(collectItems())

    updateItems()
    const observer = new MutationObserver(updateItems)
    observer.observe(toolbar, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [collectItems, toolbarRef])

  const { selectedIndex } = useMenuNavigation<HTMLElement>({
    containerRef: toolbarRef,
    items,
    orientation: "horizontal",
    onSelect: (el) => el.click(),
    autoSelectFirstItem: false,
  })

  React.useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (toolbar.contains(target))
        target.setAttribute("data-focus-visible", "true")
    }

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (toolbar.contains(target)) target.removeAttribute("data-focus-visible")
    }

    toolbar.addEventListener("focus", handleFocus, true)
    toolbar.addEventListener("blur", handleBlur, true)

    return () => {
      toolbar.removeEventListener("focus", handleFocus, true)
      toolbar.removeEventListener("blur", handleBlur, true)
    }
  }, [toolbarRef])

  React.useEffect(() => {
    if (selectedIndex !== undefined && items[selectedIndex]) {
      items[selectedIndex].focus()
    }
  }, [selectedIndex, items])
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, className, variant = "fixed", position = "sticky", style, ...props }, ref) => {
    const toolbarRef = React.useRef<HTMLDivElement>(null)
    const composedRef = useComposedRef(toolbarRef, ref)
    useToolbarNavigation(toolbarRef)

    const variantClasses =
      variant === "fixed"
        ? cn(
            "flex w-full items-center gap-1 overflow-x-auto bg-[var(--tt-toolbar-bg-color)] px-2 py-2 min-h-[var(--tt-toolbar-height)] border-b border-[var(--tt-toolbar-border-color)]",
            position === "fixed" ? "fixed inset-x-0 z-30" : "sticky top-0 z-30"
          )
        : "flex items-center gap-1 rounded-xl border border-[var(--tt-toolbar-border-color)] bg-[var(--tt-toolbar-bg-color)] px-1.5 py-1 shadow-[var(--tt-shadow-elevated-md)]"

    const variantStyle =
      variant === "fixed"
        ? {
            ...(style ?? {}),
            ...(position === "sticky" && style?.top === undefined
              ? { top: "var(--tt-toolbar-offset, 0px)" }
              : {}),
            ...(position === "fixed" && style?.top === undefined && style?.bottom === undefined
              ? { top: "var(--tt-toolbar-offset, 0px)" }
              : {}),
          }
        : style

    return (
      <div
        ref={composedRef}
        role="toolbar"
        aria-label="toolbar"
        data-variant={variant}
        className={cn("tiptap-toolbar", variantClasses, className)}
        style={variantStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Toolbar.displayName = "Toolbar"

export const ToolbarGroup = React.forwardRef<HTMLDivElement, BaseProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("tiptap-toolbar-group", "flex items-center gap-0.5", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ToolbarGroup.displayName = "ToolbarGroup"

export const ToolbarSeparator = React.forwardRef<HTMLDivElement, BaseProps>(
  ({ ...props }, ref) => (
    <Separator ref={ref} orientation="vertical" decorative {...props} />
  )
)
ToolbarSeparator.displayName = "ToolbarSeparator"
