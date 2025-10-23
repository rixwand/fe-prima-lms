import PageHead from "@/components/commons/PageHead";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SimpleEditorLayout } from "@/components/tiptap-templates/simple/simple-editor-layout";
import { Fragment } from "react";

export default function CurriculumPage() {
  return (
    <Fragment>
      <PageHead title="Edit Course" />
      <SimpleEditorLayout>
        <SimpleEditor />
      </SimpleEditorLayout>
    </Fragment>
  );
}
