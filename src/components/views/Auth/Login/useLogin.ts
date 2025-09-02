import { getErrorMessage } from "@/libs/axios/error";
import { authService } from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
export default function useLogin() {
  const router = useRouter();
  const callbackUrl: string = (router.query.callbackUrl as string) || "/dashboard";
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
  });

  const loginService = async (payload: ILogin) => {
    try {
      const res = await authService.login(payload);
      const data: { accessToken: string } = res.data.data;
      await signIn("token", { accessToken: data.accessToken, redirect: false, callbackUrl });
    } catch (error) {
      const err = error as AxiosError;
      const message = getErrorMessage(err);
      console.log("failed signIn: ", message);
      throw new Error(message);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginService,
    onError: error => {
      console.log(error);
      setError("root", { message: error.message });
    },
    onSuccess: data => {
      console.log(data);
      router.push(callbackUrl);
    },
  });
  const handlerLogin = (data: ILogin) => mutate(data);

  return { control, isPending, errors, handleSubmit, handlerLogin };
}

const loginSchema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Silahkan masukkan email"),
  password: yup.string().required("Silahkan masukkan password").min(8, "Password minimal 8 karakter"),
});
