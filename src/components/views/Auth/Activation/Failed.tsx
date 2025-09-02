import AuthStatusCard from "@/components/commons/Cards/AuthStatusCard";
import Link from "next/link";

export default function ActivationFailed({
  reason = "Tautan aktivasi tidak valid atau telah kedaluwarsa.",
  showResend = false,
}: {
  reason?: string;
  showResend?: boolean;
}) {
  return (
    <AuthStatusCard title="Aktivasi Gagal" subtitle="Kami tidak dapat mengaktifkan akun Anda.">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-8 w-8 text-rose-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </div>
        <p className="text-sm text-slate-600">{reason}</p>

        {showResend ? (
          <Link
            href="/auth/resend-activation"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Kirim Ulang Email Aktivasi
          </Link>
        ) : (
          <Link
            href="/auth/register"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Daftar Ulang
          </Link>
        )}
      </div>
    </AuthStatusCard>
  );
}
