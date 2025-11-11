import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { JSONContent, generateHTML } from "@tiptap/core";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { StarterKit } from "@tiptap/starter-kit";
// import Selection from "@tiptap/extension-selection"; // not needed just to render
// import your custom node if your JSON uses it:
import DOMPurify from "dompurify";

export function TiptapViewer({ json }: { json: JSONContent }) {
  const html = DOMPurify.sanitize(
    generateHTML(json, [
      StarterKit,
      // If your stored content actually has <hr>, include HorizontalRule too.
      // HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      // Selection is for interactions; skip on viewer.
      // IMPORTANT: include this only if your stored JSON uses the custom node type
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 10 * 1024 * 1024,
        limit: 3,
        upload: async () => "",
      }),
    ]),
  );

  return (
    <div className="simple-editor-content">
      <div className="tiptap ProseMirror simple-editor" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
