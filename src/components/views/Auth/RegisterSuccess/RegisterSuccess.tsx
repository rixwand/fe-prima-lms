import AuthStatusCard from "@/components/commons/Cards/AuthStatusCard";
import Link from "next/link";

export default function RegisterSuccess() {
  return (
    <AuthStatusCard title="Registrasi Berhasil" subtitle="Periksa email Anda untuk mengaktifkan akun.">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 7.5 12 13l9-5.5" />
          </svg>
        </div>
        <p className="text-sm text-slate-600">
          Kami telah mengirim email verifikasi ke alamat Anda. Klik tautan di dalamnya untuk mengaktifkan akun.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Kembali ke Login
        </Link>
      </div>
    </AuthStatusCard>
  );
}
