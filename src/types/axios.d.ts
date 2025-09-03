import { AxiosError } from "axios";

export interface AxiosErrorResponse {
  error: string;
}

type AppAxiosError = AxiosError<AxiosErrorResponse>;
