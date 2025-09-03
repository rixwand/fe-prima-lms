import { AppAxiosError } from "@/types/axios";

export const getErrorMessage = (err: AppAxiosError) => {
  return err.response?.data.error || err.message;
};
