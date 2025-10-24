import PageHead from "@/components/commons/PageHead";
import SimpleEditorLayout from "@/components/layouts/SimpleEditorLayout";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Fragment, useState } from "react";

export default function CurriculumPage() {
  const lessonState = useState<Lesson | null>(null);
  return (
    <Fragment>
      <PageHead title="Edit Course" />
      <SimpleEditorLayout lessonState={lessonState}>
        <SimpleEditor />
      </SimpleEditorLayout>
    </Fragment>
  );
}
