import { hasTrue } from "@/libs/utils/boolean";
import orderQueries from "@/queries/order-queries";
import orderService from "@/services/order.service";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function useOrder(
  options: { immediatlyFetch: boolean } = { immediatlyFetch: false },
  params?: ListOrderParams,
) {
  const router = useRouter();
  const { data, isFetching, isError, error, refetch } = useQuery({
    ...orderQueries.options.listOrder(params),
    enabled: options.immediatlyFetch,
  });
  useQueryError({ isError, error });
  const { mutate: createOrder, isPending: isPendingPurchase } = useMutation({
    mutationFn: (data: { courseId: number; code?: string }) => orderService.create(data),
    onError(e) {
      console.log(e);
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess({ data }) {
      router.push(data.invoiceUrl);
    },
  });
  useNProgress(hasTrue({ isPendingPurchase, isFetching }));
  return {
    orders: { data: data?.orders, meta: data?.meta },
    refetchOrders: refetch,
    createOrder,
    isPendingPurchase,
  };
}
