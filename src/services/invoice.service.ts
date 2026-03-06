import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";
import { buildQueryParams } from "@/libs/utils/api";

export default {
  listInvoices: (params?: ListInvoiceParams) =>
    api.get<InvoiceListResponse>(endpoint.INVOICE, {
      params,
      paramsSerializer: p => buildQueryParams(p),
    }),
  listMyInvoices: (params?: ListInvoiceParams) =>
    api.get<InvoiceListResponse>(endpoint.MY_INVOICE, {
      params,
      paramsSerializer: p => buildQueryParams(p),
    }),
};
