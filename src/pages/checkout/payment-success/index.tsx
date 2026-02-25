import AuthStatusCard from "@/components/commons/Cards/AuthStatusCard";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Link } from "@heroui/react";
import { GiCheckMark } from "react-icons/gi";

export default function PaymentFailed() {
  return (
    <AuthLayout>
      <AuthStatusCard title="Pembayaran Berhasil" subtitle="Periksa email Anda untuk mengaktifkan akun.">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success">
            <GiCheckMark size={24} className="text-white" />
          </div>
          <p className="text-sm text-slate-600">
            Kami telah mengirim email verifikasi ke alamat Anda. Klik tautan di dalamnya untuk mengaktifkan akun.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Kembali ke Dashboard
          </Link>
        </div>
      </AuthStatusCard>
    </AuthLayout>
  );
}
