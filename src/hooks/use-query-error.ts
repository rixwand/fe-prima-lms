import { getErrorMessage } from "@/libs/axios/error";
import { addToast } from "@heroui/react";
import { isAxiosError } from "axios";
import { useEffect } from "react";

interface UseQueryErrorOptions {
  isError: boolean;
  error: Error | null;
}

export const useQueryError = ({ isError, error }: UseQueryErrorOptions) => {
  useEffect(() => {
    if (isError && error) {
      addToast({
        title: "Error",
        color: "danger",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
      });
    }
  }, [isError, error, addToast]);
};
