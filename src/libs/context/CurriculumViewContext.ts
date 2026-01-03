import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type LessonPathIds = {
  courseId: number;
  sectionId: number;
  lessonId: number;
};

type OnSelectLesson = (section: CourseSection, lesson: Lesson) => void;

type CurriculumViewContextType = {
  onSelect: OnSelectLesson;
  activeLesson: LessonPathIds | null;
  setActiveLesson: Dispatch<SetStateAction<LessonPathIds | null>>;
};

export const CurriculumViewContext = createContext<CurriculumViewContextType | null>(null);

export const useCurriculumViewContext = () => {
  const ctx = useContext(CurriculumViewContext);
  if (!ctx) throw new Error("useCurriculumViewContext ust be used inside CurriculumViewContextProvider");
  return ctx;
};
