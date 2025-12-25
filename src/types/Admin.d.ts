type QueryPublishCourse = {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  status: "PENDING" | "PUBLISHED" | "REJECTED";
  courseId: number;
  notes: string | null;
  reviewedById: number | null;
};

type PublishCourseListParams = {
  status?: "APPROVED" | "PENDING" | "REJECTED";
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};
