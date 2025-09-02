import { useAuthContext } from "@/libs/context/AuthContext";
import Image from "next/image";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const { mode, setMode } = useAuthContext();
  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-0 px-4 lg:grid-cols-2 lg:gap-12">
      {/* Left: marketing / hero */}
      <div className="lg:space-y-5 space-y-3 lg:mx-0 mx-3 mb-3 mt-5 lg:-mt-24 flex lg:block flex-col items-center">
        <div className="relative mb-3 lg:w-64 w-44 lg:mb-14 aspect-[17/5] h-fit">
          <Image src={"/images/logo-full.png"} alt="logo prima" fill className="object-contain" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          20+ Mitra • Sertifikat Resmi • Job-ready Skill
        </div>
        <h1 className="lg:text-4xl text-3xl font-extrabold tracking-tight text-slate-900">#GROW WITH PRIMA</h1>
        <p className="max-w-prose lg:text-start text-center text-sm leading-relaxed text-slate-600">
          Masuk atau daftar untuk mulai belajar. Pilih kelas favoritmu dan ikuti progres pembelajaran lewat dashboard
          yang rapi dan mudah dipahami.
        </p>
      </div>

      {/* Right: card */}
      <div className="my-3">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          {mode === "login" ? <Login /> : <Register />}
          <p className="mt-6 text-center text-sm text-slate-600">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button className="font-semibold text-blue-700 hover:underline" onClick={() => setMode("register")}>
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button className="font-semibold text-blue-700 hover:underline" onClick={() => setMode("login")}>
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
