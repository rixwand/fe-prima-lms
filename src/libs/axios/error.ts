import { AppAxiosError } from "@/types/axios";

export const getErrorMessage = (err: AppAxiosError) => {
  console.log(err);
  return err.response?.data.error || err.message;
};
