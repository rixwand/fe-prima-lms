import type { AxiosError } from "axios";

export const getErrorMessage = (err: AxiosError) => {
  return err.response?.data.error || err.message;
};
