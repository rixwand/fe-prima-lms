type NewCourseBasics = {
  title: string;
  subtitle: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  thumbnail?: string;
  description: string;

  tags: string[];
};

type LessonForm = { id: string; title: string; durationMin?: number; preview?: boolean };

type CurriculumSection = {
  id: string;
  title: string;
  lessons: LessonForm[];
};

type Pricing = {
  type: "PERCENTAGE" | "FIXED";
  value: number;
  label?: string;
  isActive?: boolean;
  startAt?: string | Date;
  endAt?: string | Date;
};

type CourseDiscount = {
  id: number;
  courseId: number;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
  label: string;
};

type ICourseListItem = {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage: string;
  priceAmount: number;
  isFree: false;
  createdAt: string;
  discount?: CourseDiscount[];
  students: number;
  rating: number;
};

type Course = {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  ownerId: number;
  coverImage: string;
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree: boolean;
  tags: string[];
  sections?: {
    title: string;
    lessons: string[];
  }[];
  discount?: CourseDiscount[];
  createdAt: string;
};
