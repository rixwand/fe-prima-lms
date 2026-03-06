import invoiceService from "@/services/invoice.service";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const invoiceQueries = {
  keys: {
    listInvoices: (params?: ListInvoiceParams) => (params ? ["admin-invoices", params] : ["admin-invoices"]),
    listMyInvoices: (params?: ListInvoiceParams) => (params ? ["invoices", params] : ["invoices"]),
  },
  options: {
    listInvoices: (params?: ListInvoiceParams) =>
      queryOptions<InvoiceListResponse>({
        queryKey: invoiceQueries.keys.listInvoices(params),
        queryFn: () =>
          invoiceService
            .listInvoices(params)
            .then(res => res.data)
            .catch(error => {
              if (isAxiosError(error) && error.status === 404) return { invoices: [], meta: null };
              throw error;
            }),
        placeholderData: keepPreviousData,
      }),
    listMyInvoices: (params?: ListInvoiceParams) =>
      queryOptions<InvoiceListResponse>({
        queryKey: invoiceQueries.keys.listMyInvoices(params),
        queryFn: () =>
          invoiceService
            .listMyInvoices(params)
            .then(res => res.data)
            .catch(error => {
              if (isAxiosError(error) && error.status === 404) return { invoices: [], meta: null };
              throw error;
            }),
        placeholderData: keepPreviousData,
      }),
  },
};

export default invoiceQueries;
