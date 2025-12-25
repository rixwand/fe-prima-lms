import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type LessonPathIds = {
  ids: { courseId: number; sectionId: number; lessonId: number };
  path: string[];
};

type FolderTreeContextType = {
  editMode: boolean;
  activeLesson: LessonPathIds | null;
  setActiveLesson: Dispatch<SetStateAction<LessonPathIds | null>>;
};

export const FolderTreeContext = createContext<FolderTreeContextType | null>(null);

export const useFolderTreeContext = () => {
  const ctx = useContext(FolderTreeContext);
  if (!ctx) throw new Error("useFolderTreeContext must be used inside FolderTreeProvider");
  return ctx;
};
