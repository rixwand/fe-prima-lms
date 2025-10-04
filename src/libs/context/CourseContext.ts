import { StateType } from "@/types/Helper";
import { createContext, useContext } from "react";

type CourseContextType = {
  // basicsForm: StateType<NewCourseBasics>;
  curriculumForm: StateType<CurriculumSection[]>;
  // pricingForm: StateType<Pricing>;
};

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function useCourseContext() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourseContext must be used inside CourseProvider");
  return ctx;
}
