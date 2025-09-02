import AuthLayout from "@/components/layouts/AuthLayout";
import ActivationFailed from "@/components/views/Auth/Activation/Failed";
import ActivationSuccess from "@/components/views/Auth/Activation/Success";
import { getErrorMessage } from "@/libs/axios/error";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { GetServerSideProps } from "next";

type PropsType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export default function ActivationStatusPage(result: PropsType) {
  return (
    <AuthLayout title={result.success ? "Activation Success" : "Activation Failed"}>
      {result.success ? <ActivationSuccess /> : <ActivationFailed reason={result.message} />}
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps<PropsType, { code: string }> = async ({ query }) => {
  const code = query.code;
  if (!code || typeof code !== "string") return { notFound: true };
  try {
    const result = await authService.activation({ code });
    if (result.data.data) {
      return {
        props: { success: true },
      };
    } else {
      return {
        props: { success: false, message: result.data.error },
      };
    }
  } catch (error) {
    const err = error as AxiosError;
    const message = getErrorMessage(err);
    return {
      props: { success: false, message },
    };
  }
};
