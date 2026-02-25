import { hasTrue } from "@/libs/utils/boolean";
import paymentService from "@/services/payment.service";
import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useNProgress } from "../use-nProgress";

export default function usePayment() {
  const router = useRouter();
  const { mutate: purchase, isPending: isPendingPurchase } = useMutation({
    mutationFn: (data: { courseId: number; code?: string }) => paymentService.purchase(data),
    onError(e) {
      console.log(e);
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess({ data }) {
      router.push(data.invoiceUrl);
    },
  });
  useNProgress(hasTrue({ isPendingPurchase }));
  return {
    purchase,
    isPendingPurchase,
  };
}
