import AuthStatusCard from "@/components/commons/Cards/AuthStatusCard";
import Link from "next/link";

export default function ActivationSuccess() {
  return (
    <AuthStatusCard title="Aktivasi Berhasil" subtitle="Akun Anda telah aktif.">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-8 w-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        </div>
        <p className="text-sm text-slate-600">Selamat! Akun Anda sudah bisa digunakan untuk masuk ke Prima LMS.</p>
        <Link
          href="/auth/login"
          className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Masuk Sekarang
        </Link>
      </div>
    </AuthStatusCard>
  );
}
