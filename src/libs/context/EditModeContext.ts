import { StateType } from "@/types/Helper";
import { createContext, useContext } from "react";

type EditModeContextType = {
  isEditMode: boolean;
  setEditMode: StateType<boolean>[1];
};

export const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditModeContext() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditModeContext must be used inside EditModeContext Provider");
  return ctx;
}
