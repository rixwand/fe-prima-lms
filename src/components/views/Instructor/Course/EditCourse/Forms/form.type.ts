export interface EditCourseForm {
  coverImage: string;
  fileImage: FileList | null;
  title: string;
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree: boolean;
  categories?: { id: number; name: string }[];
  tags?: {
    createOrConnect: string[];
    disconnectSlugs: string[];
  };
  discount?: {
    id?: number;
    type: "FIXED" | "PERCENTAGE";
    value: number;
    label?: string;
    isActive?: boolean;
    startAt?: CalendarDate | null;
    endAt?: CalendarDate | null;
  };
  discounts?: {
    id?: number;
    type: "FIXED" | "PERCENTAGE";
    value: number;
    label?: string;
    isActive?: boolean;
    startAt?: CalendarDate | null;
    endAt?: CalendarDate | null;
  }[];
  sections?: {
    id?: number;
    title: string;
    position?: number;
    publishedAt?: string | null;
    removedAt?: string | null;
    lessons?: {
      id?: number;
      title: string;
      summary?: string | null;
      durationSec?: number | null;
      isPreview?: boolean;
      position?: number;
      publishedAt?: string | null;
      removedAt?: string | null;
    }[];
  }[];
}

// Curriculum sections
export type CurriculumFormProps = {
  courseId: number;
  defaultValue: CourseSection[];
};

export type CourseSectionForm = NonNullable<EditCourseForm["sections"]>[number];

export type AddSectionsFormRhf = { sections: { title: string }[] };

export type AddLessonsFormRhf = { lessons: { title: string }[] };
