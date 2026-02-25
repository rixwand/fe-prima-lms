import { StateType } from "@/types/Helper";
import { createContext, useContext } from "react";
type EditCourseContextType = {
  courseId: number;
  showCoursePreviewState: StateType<boolean>;
  showPublished: boolean;
};

export const EditCourseContext = createContext<EditCourseContextType | undefined>(undefined);

export function useEditCourseContext() {
  const ctx = useContext(EditCourseContext);
  if (!ctx) throw new Error("useEditCourseContext must be used inside EditCourseContextProvider");
  return ctx;
}
