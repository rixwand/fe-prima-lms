/* eslint-disable @typescript-eslint/no-explicit-any */
interface BlockDataBase {
  meta?: Record<string, any>;
}

interface RichTextBlock extends BlockDataBase {
  type: "RICH_TEXT";
  textJson: Record<string, any>;
  url?: never;
}

interface MediaBlock extends BlockDataBase {
  type: "VIDEO" | "FILE" | "EMBED";
  url: string;
  textJson?: never;
}

type BlockData = RichTextBlock | MediaBlock;

type LessonBlockType = "RICH_TEXT" | "VIDEO" | "FILE" | "EMBED";

interface LessonBlockItem {
  id: number;
  lessonId: number;
  position: number;
  type: LessonBlockType;
  textJson: LessonBlockTextJson | null;
  url: string | null;
  meta: Record<string, any> | null;
  createdAt: string;
}
