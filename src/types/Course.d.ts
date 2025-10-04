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

type ICourseListItem = {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  students: number;
  rating: number;
  coverImage: string;
  priceAmount: number;
  priceCurrency: string;
  isFree: false;
  createdAt: string;
};
