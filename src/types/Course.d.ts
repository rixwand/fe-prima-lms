type ICourseListItem = {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage: string;
  priceAmount: number;
  isFree: boolean;
  createdAt: string;
  discount?: CourseDiscount[];
  students: number;
  rating: number;
};

type CoursePreview = {
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

type CourseForm = {
  title: string;
  status: "PUBLISHED" | "DRAFT";
  coverImage: FileList;
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree?: boolean;
  tags: string[];
  sections?: {
    title: string;
    lessons?: {
      title: string;
      summary?: string;
      durationSec?: number;
      isPreview?: boolean; // default false in Yup
    }[];
  }[];
  discount?: {
    type: "FIXED" | "PERCENTAGE"; // from DiscountType/DiscountTypes
    value: number;
    label?: string;
    isActive?: boolean; // default true in Yup
    startAt?: CalendarDate;
    endAt?: CalendarDate;
  };
};

interface Course {
  id: number;
  title: string;
  slug: string;
  status: "PUBLISHED" | "DRAFT";
  ownerId: number;
  coverImage: string;
  previewVideo: string | null;
  shortDescription: string;
  descriptionJson: string | null;
  tags: Tag[];
  priceAmount: number;
  isFree: boolean;
  discount: Discount[];
  sections: CourseSection[];
}

interface Discount {
  id: number;
  courseId: number;
  type: "FIXED" | "PERCENTAGE";
  value: number;
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
  label: string;
}

interface CourseSection {
  id: number;
  courseId: number;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  sectionId: number;
  slug: string;
  title: string;
  summary: string | null;
  position: number;
  durationSec: number | null;
  isPreview: boolean;
}

interface Tag {
  tagId: number;
  tagName: string;
  tagSlug: string;
}

interface EditCourseForm {
  coverImage: string;
  fileImage: FileList | null;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree: boolean;
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
}
