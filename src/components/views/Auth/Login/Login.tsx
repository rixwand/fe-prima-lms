import AuthCard from "@/components/commons/Cards/AuthCard";
import TextField from "@/components/commons/TextField";
import { Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import useLogin from "../../../../hooks/auth/useLogin";

export default function Login() {
  const { control, handleSubmit, handlerLogin, isPending } = useLogin();
  return (
    <AuthCard title={"Masuk ke Akun Anda"} subtitle={"Selamat datang kembali!"}>
      <form onSubmit={handleSubmit(handlerLogin)} className="grid gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="nama@contoh.com"
              autoComplete="email"
              field={field}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="password"
              label="Kata Sandi"
              type="password"
              autoComplete="new-password"
              field={field}
              error={error?.message}
            />
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Ingat saya
          </label>
          <a href="#" className="text-xs font-medium text-blue-700 hover:underline">
            Lupa kata sandi?
          </a>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex items-center justify-center rounded-xl disabled:bg-blue-600/50 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
          {isPending ? <Spinner size="sm" color="white" /> : "Masuk"}
        </button>
      </form>
    </AuthCard>
  );
}
