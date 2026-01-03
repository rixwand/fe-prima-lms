type QueryPublishCourse = {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string; // ISO date string
  courseId: number;
  course: {
    title: string;
    coverImage: string;
    slug: string;
    priceAmount: number;
    isFree: boolean;
    discount?: Discount[];
    owner: {
      username: string;
      fullName: string;
      profilePict: string;
    };
  };
};

type PublishCourseListParams = {
  status?: "APPROVED" | "PENDING" | "REJECTED";
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};
