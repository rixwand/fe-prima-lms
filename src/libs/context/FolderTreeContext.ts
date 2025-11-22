import { StateType } from "@/types/Helper";
import { createContext, useContext } from "react";

type ToggleExpandSections = boolean | null;

type FolderTreeContextType = {
  editMode: boolean;
  expandSectionsState: StateType<ToggleExpandSections>;
  resetSections: () => void;
};

export const FolderTreeContext = createContext<FolderTreeContextType | null>(null);

export const useFolderTreeContext = () => {
  const ctx = useContext(FolderTreeContext);
  if (!ctx) throw new Error("useFolderTreeContext must be used inside FolderTreeProvider");
  return ctx;
};
