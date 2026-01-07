import AuthCard from "@/components/commons/Cards/AuthCard";
import TextField from "@/components/commons/TextField";
import { Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import useRegister from "../../../../hooks/auth/useRegister";

function PasswordHint() {
  return <p className="mt-1 text-xs text-slate-500">Minimal 8 karakter, kombinasikan huruf & angka.</p>;
}

export default function Register() {
  const { control, handleRegister, handleSubmit, isPending } = useRegister();
  return (
    <AuthCard title={"Buat Akun Baru"} subtitle={"Gabung dan mulai tingkatkan skill Anda."}>
      <form onSubmit={handleSubmit(handleRegister)} className="grid gap-2">
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="fullName"
              label="Name Lengkap"
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              error={error?.message}
              field={field}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="username"
              label="Username"
              placeholder="Username Anda"
              autoComplete="username"
              error={error?.message}
              field={field}
            />
          )}
        />
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
        <PasswordHint />
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex items-center justify-center rounded-xl disabled:bg-blue-600/50 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
          {isPending ? <Spinner size="sm" color="white" /> : "Buat Akun"}
        </button>
      </form>
    </AuthCard>
  );
}
