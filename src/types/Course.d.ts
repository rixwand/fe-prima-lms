// =======================
// Core unions / enums

// =======================
type DiscountType = "FIXED" | "PERCENTAGE";
type LessonProgressStatus = "PENDING" | "CURRENT" | "COMPLETED";

// =======================
// Shared base models
// =======================
interface CourseOwner {
  fullName: string;
  username: string;
  profilePict: string;
}

interface MetaCourse {
  title: string;
  shortDescription: string;
  descriptionJson: string;
  coverImage: string;
  previewVideo?: string;
  priceAmount: number;
  isFree: boolean;
}

interface DraftMetaCourse extends MetaCourse {
  draftTags: Tag[];
  draftCategories: Category[];
  draftDiscounts?: Discount[];
  requiresApproval: boolean;
}

interface BaseCourse {
  id: number;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  takenDownAt?: string;
  updatedAt?: string;
}

// =======================
// Discount
// =======================
interface Discount {
  id: number;
  courseId: number;
  type: DiscountType;
  value: number;
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
  label?: string;
}

type DiscountForm = {
  type: DiscountType;
  value: number;
  label?: string;
  isActive?: boolean; // default true in Yup
  startAt?: CalendarDate;
  endAt?: CalendarDate;
};

// =======================
// Course list items
// =======================
interface CourseListItem extends BaseCourse {
  metaApproved: MetaCourse;
  metaDraft: Pick<
    DraftMetaCourse,
    "coverImage" | "title" | "previewVideo" | "priceAmount" | "draftDiscounts" | "requiresApproval"
  >;
  discounts?: Discount[];
  publishRequest?: PublishRequest;
  students: number;
  rating: number;
  canApplyTierB: boolean;
}

interface PublicCourseListItem extends Omit<CourseListItem, "metaDraft"> {
  owner: CourseOwner;
  categories: PublicCategory[];
  tags: Tag[];
}

// =======================
// Query params
// =======================
interface ListCourseParams {
  status?: "PENDING" | "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REJECTED";
  publishedAt?: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

interface ListPublicCoursesParams {
  tagSlugs?: string[];
  search?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}

interface ListCourseTagsParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface ListCoursesCategoriesParams {
  page?: number;
  limit?: number;
  serch?: string;
}

// =======================
// Course preview
// =======================
interface CoursePreview extends BaseCourse {
  owner: CourseOwner;
  metaApproved: MetaCourse;
  categories: Category[];
  tags: Tag[];
  sections?: {
    title: string;
    lessons: Lesson[];
  }[];
  discounts?: Discount[];
}

// =======================
// Full course (domain model)
// =======================
interface Course extends BaseCourse {
  metaApproved: MetaCourse;
  metaDraft: Omit<DraftMetaCourse, "draftCategories"> & {
    draftCategories: Category[];
  };
  publishRequest?: PublishRequest;
  ownerId: number;
  tags: Tag[];
  discounts: Discount[];
  sections: CourseSection[];
  categories: Category[];
  canApplyTierB: boolean;
}

// =======================
// Sections, lessons, tags, Categories
// =======================
interface CourseSection {
  id: number;
  courseId: number;
  title: string;
  position: number;
  publishedAt: string | null;
  removedAt: string | null;
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
  publishedAt: string | null;
  removedAt: string | null;
}

interface LessonContent {
  contentDraft: JSONContent;
  contentLive: JSONContent;
  publishedAt: string | null;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface PublicCategory {
  id: number;
  name: string;
  slug: string;
}

interface Category extends Omit<PublicCategory, "slug"> {
  isPrimary: boolean;
}

type PublicTagListItem = { name: string; slug: string };

type PublishRequest = {
  id: number;
  notes: string | null;
  status: PublishCourseStatus;
};

type QueryLessonItem = {
  createdAt: Date;
  updatedAt: Date;
} & Lesson;

interface CourseCurriculum {
  title: MetaCourse["title"];
  sections: Array<
    Pick<CourseSection, "id" | "courseId" | "title" | "position" | "publishedAt" | "removedAt"> & {
      lessons: Array<
        Pick<Lesson, "id" | "isPreview" | "slug" | "sectionId" | "title" | "durationSec"> & {
          lessonProgress: { status: LessonProgressStatus };
        }
      >;
    }
  >;
}
