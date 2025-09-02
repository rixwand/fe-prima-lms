import { useAuthContext } from "@/libs/context/AuthContext";
import React, { Fragment } from "react";
import AuthMode from "../AuthMode/AuthMode";

interface IAuthCard {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
export default function AuthCard({ children, subtitle, title }: IAuthCard) {
  const { mode, setMode } = useAuthContext();
  return (
    <Fragment>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <AuthMode value={mode} onChange={setMode} />
      {children}
      <p className="mt-6 text-center text-xs text-slate-500">
        Dengan masuk, Anda menyetujui{" "}
        <a className="underline hover:text-slate-700" href="#">
          Syarat
        </a>{" "}
        &{" "}
        <a className="underline hover:text-slate-700" href="#">
          Privasi
        </a>
        .
      </p>
    </Fragment>
  );
}
