import orderService from "@/services/order.service";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const orderQueries = {
  keys: {
    listOrder: (params?: ListOrderParams) => (params ? ["list-orders", params] : ["list-orders"]),
  },
  options: {
    listOrder: (params?: ListOrderParams) =>
      queryOptions<OrderListResponse>({
        queryKey: orderQueries.keys.listOrder(params),
        queryFn: () =>
          orderService
            .list(params)
            .then(res => res.data)
            .catch(error => {
              if (isAxiosError(error) && error.status === 404) return { invoices: [], meta: null };
              throw error;
            }),
        placeholderData: keepPreviousData,
      }),
  },
};

export default orderQueries;
