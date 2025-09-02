import { ReactNode } from "react";

export default function AuthStatusCard({
  children,
  subtitle,
  title,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
