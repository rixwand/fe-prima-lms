import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import { StateType } from "@/types/Helper";
import { JSONContent } from "@tiptap/core";
import { useEffect } from "react";
import useLessonEditor from "./useLessonEditor";

type LessonEditorProps = {
  lessonState: StateType<Lesson | null>;
};
export default function LessonEditor({ lessonState: [activeLesson, setActiveLesson] }: LessonEditorProps) {
  // const {
  //   ids: { sectionId },
  // } = useLessonEditorContext();

  const { queryBlocks, createBlock, updateBlock, isLoading } = useLessonEditor({
    onCreateBlockSuccess() {},
  });

  useEffect(() => {
    console.log(activeLesson?.title, " ", queryBlocks);
  }, [queryBlocks]);

  const onSave = ({ json }: { html: string; json: JSONContent }) => {
    if (queryBlocks && queryBlocks[0]?.id) {
      return updateBlock({ blockId: queryBlocks[0].id, payload: { textJson: json } });
    }
    return createBlock({ type: "RICH_TEXT", textJson: json });
  };

  useNProgress(hasTrue(isLoading));

  if (isLoading.isLoading) return null;
  return (
    <SimpleEditor onSave={onSave} content={(queryBlocks && queryBlocks[0]?.textJson) || { type: "doc", content: [] }} />
  );
}
