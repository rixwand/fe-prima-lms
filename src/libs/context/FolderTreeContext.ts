import { createContext, useContext } from "react";

type FolderTreeContextType = {
  activeLessonId?: number | null;
  editMode: boolean;
};

export const FolderTreeContext = createContext<FolderTreeContextType | null>(null);

export const useFolderTreeContext = () => {
  const ctx = useContext(FolderTreeContext);
  if (!ctx) throw new Error("useFolderTreeContext must be used inside FolderTreeProvider");
  return ctx;
};
