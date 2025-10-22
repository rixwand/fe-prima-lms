import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SimpleEditorLayout } from "@/components/tiptap-templates/simple/simple-editor-layout";

export default function Page() {
  return (
    <SimpleEditorLayout>
      <SimpleEditor />
    </SimpleEditorLayout>
  );
}
