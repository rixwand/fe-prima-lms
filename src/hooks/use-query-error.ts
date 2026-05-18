import { getUnknownErrorMessage } from "@/libs/axios/error";
import { addToast } from "@heroui/react";
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
        description: getUnknownErrorMessage(error),
      });
    }
  }, [isError, error, addToast]);
};
