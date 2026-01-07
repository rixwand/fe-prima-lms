import { getErrorMessage } from "@/libs/axios/error";
import { authService } from "@/services/auth.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
export default function useLogin() {
  const router = useRouter();
  const callbackUrl: string = (router.query.callbackUrl as string) || "/dashboard";
  const { control, handleSubmit } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
  });

  const loginService = async (payload: ILogin) => {
    try {
      const res = await authService.login(payload);
      const data: { accessToken: string } = res.data;
      const signStatus = await signIn("token", { accessToken: data.accessToken, redirect: false, callbackUrl });
      if (signStatus?.error) throw new Error("Couldn't initiate session ");
    } catch (error) {
      const err = error as AppAxiosError;
      const message = getErrorMessage(err);
      console.log("failed signIn: ", message);
      throw new Error(message);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginService,
    onError: error => {
      console.log(error);
      addToast({
        title: "Gagal masuk",
        description: error.message,
        color: "danger",
      });
    },
    onSuccess: () => {
      addToast({
        title: "Berhasil masuk",
        color: "success",
      });
      router.push(callbackUrl);
    },
  });
  const handlerLogin = (data: ILogin) => mutate(data);

  return { control, isPending, handleSubmit, handlerLogin };
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Silahkan masukkan email"),
  password: yup.string().required("Silahkan masukkan password").min(8, "Password minimal 8 karakter"),
});
