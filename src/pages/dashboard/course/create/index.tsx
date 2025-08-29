"use client";

import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Hello world!</p>`,
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
};

export default function CreateCoursePage() {
  return <Tiptap />;
}
