import { authService } from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const useRegister = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: yupResolver(registerSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onError: error => {
      console.log(error);
      setError("root", { message: error.message });
    },
    onSuccess: data => {
      console.log(data);
      router.push("/auth/register-success");
    },
  });
  const handleRegister = (data: IRegister) => mutate(data);

  return { control, handleSubmit, errors, isPending, handleRegister };
};

export default useRegister;

const registerSchema = yup.object().shape({
  fullName: yup.string().required("Silahkan masukkan Nama lengkap"),
  username: yup.string().required("Silahkan masukkan Username"),
  email: yup.string().email("Email tidak valid").required("Silahkan masukkan email"),
  password: yup
    .string()
    .required("Silahkan masukkan password")
    .min(8, "Password minimal 8 karakter")
    .test("at-least-one-uppercase-letter", "Mengandung setidaknya satu huruf kapital", value => {
      if (!value) return false;
      const regex = /^(?=.*[A-Z])/;
      return regex.test(value);
    })
    .test("at-least-one-number", "Mengandung setidaknya satu nomor", value => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
});
