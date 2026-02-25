import { useEditLesson } from "@/hooks/course/useEditLesson";
import { LessonPathIds } from "@/libs/context/CurriculumViewContext";
import { Content, JSONContent } from "@tiptap/core";
import { useEffect, useState } from "react";
import { TiptapViewer } from "../../../../commons/TiptapViewer/TiptapViewer";

export default function Lessonview({ activeLesson }: { activeLesson: LessonPathIds }) {
  // const { data: blocks, isPending, isError, error } = useQueryBlocks(activeLesson);
  const { lessonContent } = useEditLesson({ idsPath: activeLesson });
  const [blockPreview, setBlockPreview] = useState<Content | undefined>(undefined);
  useEffect(() => {
    if (lessonContent && lessonContent.contentDraft) {
      setBlockPreview(lessonContent.contentDraft);
    } else {
      setBlockPreview(undefined);
    }
  }, [lessonContent]);
  return (
    <article className="mx-auto w-full [@media(min-width:480px)]:-mt-8 md:!-mt-16 mb-16 max-w-3xl text-zinc-800">
      <TiptapViewer json={(blockPreview as JSONContent) || { type: "doc", content: [] }} />
    </article>
  );
}
