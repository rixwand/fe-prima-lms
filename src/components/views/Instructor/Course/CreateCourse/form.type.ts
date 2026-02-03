import { FieldArrayWithId } from "react-hook-form";

export interface CourseForm {
  title: string;
  coverImage: FileList;
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree?: boolean;
  tags: string[];
  categories: { id: number; name: string }[];
  sections?: {
    title: string;
    position?: number;
    lessons?: {
      title: string;
      summary?: string;
      durationSec?: number;
      isPreview?: boolean; // default false in Yup
      position?: number;
    }[];
  }[];
  discount?: DiscountForm;
}
export type CourseSectionForm = FieldArrayWithId<CourseForm, "sections", "id">;
export type CourseLessonForm = FieldArrayWithId<CourseForm, `sections.${number}.lessons`, "id">;
export type AddSectionsFormRhf = { sections: { title: string }[] };

export type AddLessonsFormRhf = { lessons: { title: string }[] };
