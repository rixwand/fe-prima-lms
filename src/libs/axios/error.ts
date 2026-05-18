import { NODE_ENV } from "@/config/env";
import { AppAxiosError } from "@/types/axios";
import { isAxiosError } from "axios";

export const getErrorMessage = (err: AppAxiosError) => {
  if (NODE_ENV === "production" && err.response?.status === 500) {
    return "internal server error";
  }

  return err.response?.data.error || err.message;
};

export const getUnknownErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return getErrorMessage(error as AppAxiosError);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "something went wrong";
};
