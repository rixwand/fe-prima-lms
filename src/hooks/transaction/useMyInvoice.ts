import invoiceQueries from "@/queries/invoice-queries";
import { useQuery } from "@tanstack/react-query";
import { useNProgress } from "../use-nProgress";
import { useQueryError } from "../use-query-error";

export default function useMyInvoice(params?: ListInvoiceParams) {
  const { data, isLoading, error, isError } = useQuery(invoiceQueries.options.listMyInvoices(params));

  useNProgress(isLoading);
  useQueryError({ isError, error });

  return {
    invoices: {
      meta: data?.meta,
      data: data?.invoices,
      isError,
    },
    isLoading,
  };
}
