interface ListInvoiceParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ListOrderParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

type QueryInvoiceItem = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  order: {
    id: string;
    course: {
      metaApproved: {
        payload: MetaCourse;
      };
    };
    amount: number;
    status: string;
    createdAt: string;
  };
};

type QueryOrderItem = {
  id: string;
  userId: number;
  courseId: number;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  course: Pick<Course, "id" | "slug"> & {
    metaApproved: { payload: MetaCourse };
  };
};

type OrderListResponse = {
  orders: QueryOrderItem[];
  meta: MetaData | null;
};

type InvoiceListResponse = {
  invoices: QueryInvoiceItem[];
  meta: MetaData | null;
};
