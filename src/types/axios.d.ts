import "axios";
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "axios" {
  export interface AxiosErrorResponse {
    error: string;
  }

  export interface AxiosError<T = AxiosErrorResponse, D = any> extends Error {
    config: AxiosRequestConfig<D>;
    code?: string;
    request?: any;
    response?: AxiosResponse<T, D>;
    isAxiosError: boolean;
    toJSON: () => object;
  }
}
