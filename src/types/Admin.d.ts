type PublishCourseStatus = "PENDING" | "APPROVED" | "REJECTED";
type PublishCourseType = "NEW" | "UPDATE";
type QueryPublishCourse = {
  id: number;
  status: PublishCourseStatus;
  createdAt: string;
  type: "NEW" | "UPDATE";
  notes: string;
  courseId: number;
  course: {
    slug: string;
    publishedAt?: string;
    metaDraft: Pick<MetaCourse, "coverImage" | "title" | "isFree"> & {
      priceAmount?: MetaCourse["priceAmount"];
      priceDecimalAmount?: MetaCourse["priceAmount"];
      draftDiscounts?: Discount[];
      draftTags: Tag[];
      draftCategories: Category[];
    };
    metaApproved?: { payload: MetaCourse };
    discounts?: Discount[];
    owner: {
      username: string;
      fullName: string;
      profilePict: string;
    };
  };
};

type PublishCourseListParams = {
  type?: PublishCourseType;
  status?: PublishCourseStatus;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};
