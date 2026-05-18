import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor";
import { useEditLesson } from "@/hooks/course/useEditLesson";
import { useNProgress } from "@/hooks/use-nProgress";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { hasTrue } from "@/libs/utils/boolean";
import { StateType } from "@/types/Helper";
import { Spinner } from "@heroui/react";
import { JSONContent } from "@tiptap/core";

type LessonEditorProps = {
  lessonState: StateType<Lesson | null>;
};
export default function LessonEditor() {
  const { ids } = useLessonEditorContext();

  const { lessonContent, updateLesson, pending, publishDraftAsync } = useEditLesson({ idsPath: ids! });

  // useEffect(() => {
  //   console.log(activeLesson?.title, " ", lessonContent);
  // }, [lessonContent]);

  const onSave = ({ json, onSuccess }: { json: JSONContent; onSuccess?: () => void }) =>
    updateLesson({ contentJson: json }, { onSuccess });
  const onPublishDraft = ({ newDraft, onSuccess }: { newDraft?: JSONContent; onSuccess?: () => void }) =>
    confirmDialog({
      title: "Publish Draft",
      desc: "The content in the draft will be published",
      onConfirmed: () =>
        publishDraftAsync(
          { newDraft },
          {
            onSuccess,
            onError(e) {
              console.log("publishDraft error: ", e);
            },
          },
        ),
    });

  useNProgress(hasTrue(pending));

  if (pending.isPendingQuery)
    return (
      <div className="min-h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <SimpleEditor
      onSave={onSave}
      onPublish={onPublishDraft}
      lessonContent={lessonContent || { contentLive: [{}], contentDraft: [{}] }}
    />
  );
}
