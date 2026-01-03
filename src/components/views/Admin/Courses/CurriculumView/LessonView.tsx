import { useQueryBlocks } from "@/components/views/Instructor/Course/EditCourse/LessonEditor/useLessonEditor";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { LessonPathIds } from "@/libs/context/CurriculumViewContext";
import { Content, JSONContent } from "@tiptap/core";
import { useEffect, useState } from "react";
import { TiptapViewer } from "../../../../commons/TiptapViewer/TiptapViewer";

export default function Lessonview({ activeLesson }: { activeLesson: LessonPathIds }) {
  const { data: blocks, isPending, isError, error } = useQueryBlocks(activeLesson);
  const [blockPreview, setBlockPreview] = useState<Content | undefined>(undefined);
  useNProgress(isPending);
  useQueryError({ error, isError });
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      setBlockPreview(blocks[0].textJson);
    } else {
      setBlockPreview(undefined);
    }
  }, [blocks]);
  return (
    <article className="mx-auto w-full [@media(min-width:480px)]:-mt-8 md:!-mt-16 mb-16 max-w-3xl text-zinc-800">
      <TiptapViewer json={(blockPreview as JSONContent) || { type: "doc", content: [] }} />
    </article>
  );
}
