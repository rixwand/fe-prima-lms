import { StateType } from "@/types/Helper";
import { createContext, useContext } from "react";

type LessonEditorContextProps = {
  ids?: { courseId: number; sectionId: number; lessonId: number };
  currentDirtyState: StateType<boolean>;
  courseId: number;
};
export const LessonEditorContext = createContext<LessonEditorContextProps | undefined>(undefined);

export function useLessonEditorContext() {
  const ctx = useContext(LessonEditorContext);
  if (!ctx) throw new Error("useLessonEditorContext ust be used inside LessonEditorProvider");
  return ctx;
}
