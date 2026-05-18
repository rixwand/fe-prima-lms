import { useEditLesson } from "@/hooks/course/useEditLesson";
import { LessonPathIds } from "@/libs/context/CurriculumViewContext";
import { Spinner } from "@heroui/react";
import { Content, JSONContent } from "@tiptap/core";
import { useEffect, useState } from "react";
import { TiptapViewer } from "../../../../commons/TiptapViewer/TiptapViewer";

export default function Lessonview({ activeItem }: { activeItem: LessonPathIds }) {
  // const { data: blocks, isPending, isError, error } = useQueryBlocks(activeItem);
  const {
    lessonContent,
    pending: { isPendingQuery },
  } = useEditLesson({ idsPath: activeItem });
  const [blockPreview, setBlockPreview] = useState<Content | undefined>(undefined);
  useEffect(() => {
    if (lessonContent && lessonContent.contentDraft) {
      setBlockPreview(lessonContent.contentDraft);
    } else {
      setBlockPreview(undefined);
    }
  }, [lessonContent]);
  return (
    <div className="w-full flex min-h-[calc(100vh-7rem)] justify-center md:mt-0 mt-11">
      {isPendingQuery ? (
        <Spinner size="lg" />
      ) : (
        <TiptapViewer
          className="px-5 max-w-[min(960px,100%)]"
          json={(blockPreview as JSONContent) || { type: "doc", content: [] }}
        />
      )}
    </div>
  );
}
