"use client";

import { Button as HeroUIBtn } from "@heroui/react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import fastDeepEqual from "fast-deep-equal/es6";
import * as React from "react";

// --- Tiptap Core Extensions ---
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- UI Primitives ---
import { useSimpleEditorLayoutContext } from "@/components/layouts/SimpleEditorLayout/simple-editor-layout.context";
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap/tiptap-ui-primitive/spacer";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ImageUploadNode } from "@/components/tiptap/tiptap-node/image-upload-node/image-upload-node-extension";
// --- Tiptap UI ---
import { BlockquoteButton } from "@/components/tiptap/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/components/tiptap/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap/tiptap-ui/image-upload-button";
import { LinkButton, LinkContent, LinkPopover } from "@/components/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "@/hooks/tiptap/use-cursor-visibility";
import { useIsMobile } from "@/hooks/tiptap/use-mobile";

// --- Components ---

// --- Lib ---
import { cn, handleImageUpload, MAX_FILE_SIZE } from "@/libs/tiptap/tiptap-utils";
import ccn from "@/libs/utils/cn";

// --- Icons (external) ---
import { MySwitch } from "@/components/commons/CustomHeroui/MySwitch";
import { TiptapViewer } from "@/components/commons/TiptapViewer/TiptapViewer";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { normalizeTiptapContent } from "@/libs/utils/course";
import { StateType } from "@/types/Helper";
import { addToast } from "@heroui/react";
import { IoContractOutline, IoExpandOutline, IoSaveOutline } from "react-icons/io5";
import { LuBookmark, LuGlobe, LuInfo } from "react-icons/lu";

// --- Styles ---

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onSave,
  isSaveDisabled,
  onToggleFullscreen,
  isFullscreen,
  onPublish,
  showContentLiveState: [showPublished, setShowPublished],
  isDirty,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  onSave: () => void;
  isSaveDisabled: boolean;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  showContentLiveState: StateType<boolean>;
  onPublish: () => void;
  isDirty: boolean;
}) => {
  const SwitchMode = () => (
    <span className={ccn("flex items-center gap-x-1.5 py-1 px-1.5 rounded-full")}>
      <MySwitch
        classNames={{ wrapper: ccn(showPublished ? "bg-success" : "bg-primary", "transition-background") }}
        color="white"
        defaultSelected
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <LuGlobe
              {...{
                className: ccn([className, "text-success"]),
              }}
            />
          ) : (
            <LuBookmark
              {...{
                className: ccn([className, "text-primary"]),
              }}
            />
          )
        }
        isSelected={showPublished}
        onValueChange={setShowPublished}
        endContent={<LuGlobe color="white" />}
        size="md"
        startContent={<LuBookmark color="white" />}
      />
      <p className="text-slate-700 text-sm mr-2 ml-1 text-nowrap">{showPublished ? "Live content" : "Draft content"}</p>
    </span>
  );
  return (
    <>
      <ToolbarGroup>
        <SwitchMode />
      </ToolbarGroup>

      <Spacer size={isMobile ? "0.5rem" : undefined} />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} portal={isMobile} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer size={isMobile ? "0.5rem" : undefined} />

      <ToolbarGroup className="space-x-2">
        <HeroUIBtn
          onPress={onPublish}
          color="success"
          className="reset-button px-2.5 py-1.5 space-x-1 text-white"
          isIconOnly
          aria-label="Publish editor content">
          <LuGlobe />
          <span>{isDirty && "Save & "}Publish draft</span>
        </HeroUIBtn>
        <Button
          // data-style="ghost"
          className="text-nowrap"
          onClick={onToggleFullscreen}
          tooltip={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}>
          {isFullscreen ? (
            <IoContractOutline className="tiptap-button-icon" />
          ) : (
            <IoExpandOutline className="tiptap-button-icon" />
          )}
          <span className="tiptap-button-text">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
        </Button>
        <Button
          data-style="primary"
          onClick={onSave}
          disabled={isSaveDisabled}
          tooltip="Save current document"
          aria-label="Save editor content">
          <IoSaveOutline className="tiptap-button-icon" />
          <span className="tiptap-button-text">Save</span>
        </Button>
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({ type, onBack }: { type: "highlighter" | "link"; onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

type SimpleEditorProps = {
  onSave?: (data: { json: JSONContent; onSuccess?: () => void }) => void;
  onPublish?: (props: { newDraft?: JSONContent; onSuccess?: () => void }) => void;
  lessonContent: LessonContent;
};

export function SimpleEditor({
  onPublish,
  onSave,
  lessonContent: { contentDraft: content, contentLive },
}: SimpleEditorProps) {
  const layoutContext = useSimpleEditorLayoutContext();
  const isCompactBreakpoint = useIsMobile(1024);
  const isCompact = layoutContext ? !layoutContext.isDesktop : isCompactBreakpoint;
  const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const originalBodyOverflow = React.useRef<string>("");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = React.useState(0);
  const showContentLiveState = React.useState(false);
  const {
    currentDirtyState: [isDirty, setIsDirty],
  } = useLessonEditorContext();

  const editor = useEditor({
    editable: !showContentLiveState[0],
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      Placeholder.configure({
        placeholder: "Type here...",
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: error => {
          // alert(error.message);
          // console.error("Upload failed:", error);
          addToast({ title: "Error uploadig image", color: "danger", description: error.message });
        },
      }),
    ],
    content,
  });

  const getEditorPayload = React.useCallback(() => {
    if (!editor) {
      return null;
    }

    return {
      html: editor.getHTML(),
      json: editor.getJSON(),
    };
  }, [editor]);

  const handleSave = React.useCallback(() => {
    const payload = getEditorPayload();
    if (!payload) return;

    if (onSave) {
      onSave({
        json: payload.json,
        onSuccess() {
          setIsDirty(false);
        },
      });
      return;
    }
  }, [getEditorPayload, onSave]);

  const handlePublish = React.useCallback(() => {
    const payload = getEditorPayload();
    if (!payload) return;

    if (onPublish) {
      onPublish({
        newDraft: isDirty ? payload.json : undefined,
        onSuccess() {
          setIsDirty(false);
        },
      });
      return;
    }
  }, [getEditorPayload, onPublish, isDirty]);

  const handleToggleFullscreen = React.useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, [setIsFullscreen]);

  useCursorVisibility({
    editor,
    overlayHeight: toolbarHeight,
  });

  React.useEffect(() => {
    if (!editor) return;
    const checkDirty = () => !fastDeepEqual(normalizeTiptapContent(editor.getJSON()), normalizeTiptapContent(content));
    const updateHandler = () => {
      setIsDirty(checkDirty());
    };
    if (checkDirty()) {
      editor.commands.setContent(content);
      setIsDirty(false);
    }
    editor.on("update", updateHandler);

    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor, content]);

  React.useEffect(() => {
    const updateHeight = () => {
      const nextHeight = toolbarRef.current?.getBoundingClientRect().height ?? 0;
      setToolbarHeight(nextHeight);
    };

    updateHeight();

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && toolbarRef.current) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(toolbarRef.current);
    }

    window.addEventListener("resize", updateHeight);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isCompact, isFullscreen, mobileView]);

  React.useEffect(() => {
    if (!isCompact && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isCompact, mobileView]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    if (isFullscreen) {
      originalBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow.current ?? "";
      };
    }

    document.body.style.overflow = originalBodyOverflow.current ?? "";
  }, [isFullscreen, setIsFullscreen]);

  React.useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const shouldUseMobileToolbar = isCompact && !isFullscreen;

  const toolbarStyle = React.useMemo<React.CSSProperties>(() => {
    if (isFullscreen) {
      return { top: 0 };
    }

    if (shouldUseMobileToolbar) {
      return { bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" };
    }

    return {};
  }, [isFullscreen, shouldUseMobileToolbar]);

  const toolbarVariant: "fixed" | "floating" = shouldUseMobileToolbar ? "floating" : "fixed";
  const toolbarClassName = shouldUseMobileToolbar ? "simple-editor-mobile-toolbar" : undefined;
  const toolbarPosition: "sticky" | "fixed" = shouldUseMobileToolbar || isFullscreen ? "fixed" : "sticky";

  return (
    <div
      className={cn("simple-editor-wrapper", isFullscreen && "is-fullscreen")}
      style={isFullscreen ? ({ "--tt-toolbar-offset": "0px" } as React.CSSProperties) : undefined}>
      <span
        hidden={!showContentLiveState[0]}
        className="lg:-mt-2 mb-0.5 -mt-6 text-center bg-danger-50 py-0.5 px-2 rounded-md text-danger flex items-center justify-center gap-x-1 text-sm font-medium">
        <LuInfo /> <p>Currently view live lesson content switch to draft mode to start editing</p>
      </span>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          variant={toolbarVariant}
          className={toolbarClassName}
          position={toolbarPosition}
          style={toolbarStyle}>
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isCompact}
              onSave={handleSave}
              isSaveDisabled={!editor || !isDirty}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
              showContentLiveState={showContentLiveState}
              onPublish={handlePublish}
              isDirty={isDirty}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>
        {showContentLiveState[0] ? (
          <TiptapViewer json={contentLive} />
        ) : (
          <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        )}
      </EditorContext.Provider>
    </div>
  );
}
