import { mode } from "@/libs/context/AuthContext";

export default function AuthMode({ value, onChange }: { value: mode; onChange: (v: mode) => void }) {
  const isLogin = value === "login";
  return (
    <div className="mb-6 inline-flex rounded-2xl bg-slate-100 p-1">
      <button
        onClick={() => onChange("login")}
        className={`${
          isLogin ? "bg-white shadow" : "bg-transparent"
        } rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition`}>
        Masuk
      </button>
      <button
        onClick={() => onChange("register")}
        className={`${
          !isLogin ? "bg-white shadow" : "bg-transparent"
        } rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition`}>
        Daftar
      </button>
    </div>
  );
}
