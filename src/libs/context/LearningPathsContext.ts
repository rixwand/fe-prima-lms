import { createContext, useContext } from "react";

type LearningPathsContextProps = {
  paths?: { slug: string; sectionId: number; itemId: number };
};
export const LearningPathsContext = createContext<LearningPathsContextProps | undefined>(undefined);

export function useLearningPathsContext() {
  const ctx = useContext(LearningPathsContext);
  if (!ctx) throw new Error("useLearningPathsContextProps ust be used inside LearningPathsContextProvider");
  return ctx;
}
