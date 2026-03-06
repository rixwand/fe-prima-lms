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
    <div className="w-full flex justify-center">
      <TiptapViewer
        className="px-5 max-w-[min(960px,100%)]"
        json={(blockPreview as JSONContent) || { type: "doc", content: [] }}
      />
    </div>
  );
}
