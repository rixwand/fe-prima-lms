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

type CurriculumSection = {
  id: string;
  title: string;
  lessons: { id: string; title: string; kind: "video" | "article"; durationMin?: number; preview?: boolean }[];
};

type Pricing = { price: number; discount?: number; visibility: "Public" | "Unlisted" | "Private" };
