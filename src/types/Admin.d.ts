type PublishCourseStatus = "PENDING" | "APPROVED" | "REJECTED";
type QueryPublishCourse = {
  id: number;
  status: PublishCourseStatus;
  createdAt: string; // ISO date string
  type: "NEW" | "UPDATE";
  courseId: number;
  course: {
    slug: string;
    publishedAt?: string;
    metaDraft: {
      title: string;
      coverImage: string;
      priceAmount: number;
      isFree: boolean;
      draftDiscounts?: Discount[];
      draftTags: Tag[];
      draftCategories: Category[];
    };
    discounts?: Discount[];
    owner: {
      username: string;
      fullName: string;
      profilePict: string;
    };
  };
};

type PublishCourseListParams = {
  status?: PublishCourseStatus;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};
