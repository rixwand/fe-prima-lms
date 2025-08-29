import React, { useState } from "react";

/**
 * Prima LMS – Auth Pages (Login & Signup)
 * - TailwindCSS-only, no external UI libs
 * - Matches the blue/rounded/clean style from the provided mockups
 * - Compact: a single component that can render Login or Signup
 * - Swap modes with the pill switch on top or by using the standalone exports
 *
 * Exports:
 *  - default: <AuthPage /> with internal toggle
 *  - LoginPage: renders login directly
 *  - SignupPage: renders signup directly
 */

const brand = {
  name: "PRIMA",
  tagline: "Bina Insani Profesional",
};

const navLinks = [
  { label: "Kursus", href: "#" },
  { label: "Ulasan", href: "#" },
  { label: "Tentang", href: "#" },
];

function NavbarSimple() {
  return (
    <header className="w-full py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 ring-2 ring-blue-300" />
          <div className="leading-tight text-slate-800">
            <div className="text-lg font-extrabold tracking-wide">{brand.name}</div>
            <div className="text-[10px] opacity-70">{brand.tagline}</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          {navLinks.map(n => (
            <a key={n.label} href={n.href} className="hover:text-slate-900">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden gap-2 md:flex">
          <a className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100" href="#">
            Masuk
          </a>
          <a className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" href="#">
            Daftar
          </a>
        </div>
      </div>
    </header>
  );
}

function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_80%_-10%,#dbeafe_10%,#bfdbfe_50%,#eff6ff_100%)]">
      <NavbarSimple />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 pt-4 md:grid-cols-2 md:gap-12 md:pt-10">
        {/* Left: marketing / hero */}
        <div className="order-2 md:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            20+ Mitra • Sertifikat Resmi • Job-ready Skill
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tingkatkan keterampilanmu, wujudkan masa depan cerah
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-600">
            Masuk atau daftar untuk mulai belajar. Pilih kelas favoritmu dan ikuti progres pembelajaran lewat dashboard
            yang rapi dan mudah dipahami.
          </p>

          {/* Illustration block */}
          <div className="mt-8 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              {[40, 52, 45, 60, 30, 70].map((pct, i) => (
                <div key={i} className="rounded-2xl bg-blue-50 p-3">
                  <div className="text-[10px] text-slate-500">Progress</div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: card */}
        <div className="order-1 md:order-2">
          <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            </div>
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
          </div>
        </div>
      </div>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-500">
        © {new Date().getFullYear()} PRIMA – Bina Insani Profesional
      </footer>
    </div>
  );
}
function SocialButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.2 6.1 28.8 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.4 16.7 18.8 12 24 12c3 0 5.7 1.1 7.7 3l5.7-5.7C33.2 6.1 28.8 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.1C29.3 36.6 25.9 38 24 38c-5.3 0-9.6-3.4-11.3-8l-6.5 5c3.4 6.4 10 11 17.8 11z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.3 5.2-6.1 6.2l6.2 5.1C38.2 36.6 40 31.6 40 26c0-1.3-.1-2.7-.4-3.9z"
          />
        </svg>
        Masuk dengan Google
      </button>
    </div>
  );
}

function Divider({ label = "atau" }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-[11px] uppercase tracking-wider text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function TextField({ id, label, type = "text", placeholder = "", autoComplete, required = true }: any) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function PasswordHint() {
  return <p className="mt-1 text-xs text-slate-500">Minimal 8 karakter, kombinasikan huruf & angka.</p>;
}

function LoginForm() {
  return (
    <form className="grid gap-4">
      <SocialButtons />
      <Divider />
      <TextField id="email" label="Email" type="email" placeholder="nama@contoh.com" autoComplete="email" />
      <TextField id="password" label="Kata Sandi" type="password" autoComplete="current-password" />

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
        className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
        Masuk
      </button>
    </form>
  );
}

function SignupForm() {
  return (
    <form className="grid gap-4">
      <SocialButtons />
      <Divider />
      <TextField id="fullName" label="Nama Lengkap" placeholder="Nama lengkap Anda" autoComplete="name" />
      <TextField id="email" label="Email" type="email" placeholder="nama@contoh.com" autoComplete="email" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="password" label="Kata Sandi" type="password" autoComplete="new-password" />
        <TextField id="confirm" label="Konfirmasi Sandi" type="password" autoComplete="new-password" />
      </div>
      <PasswordHint />
      <button
        type="submit"
        className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
        Buat Akun
      </button>
    </form>
  );
}

function ModeSwitch({ value, onChange }: { value: "login" | "signup"; onChange: (v: "login" | "signup") => void }) {
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
        onClick={() => onChange("signup")}
        className={`${
          !isLogin ? "bg-white shadow" : "bg-transparent"
        } rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition`}>
        Daftar
      </button>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <AuthShell
      title={mode === "login" ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
      subtitle={mode === "login" ? "Selamat datang kembali!" : "Gabung dan mulai tingkatkan skill Anda."}>
      <ModeSwitch value={mode} onChange={setMode} />
      {mode === "login" ? <LoginForm /> : <SignupForm />}
      <p className="mt-6 text-center text-sm text-slate-600">
        {mode === "login" ? (
          <>
            Belum punya akun?{" "}
            <button className="font-semibold text-blue-700 hover:underline" onClick={() => setMode("signup")}>
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
    </AuthShell>
  );
}

export function LoginPage() {
  return (
    <AuthShell title="Masuk ke Akun Anda" subtitle="Selamat datang kembali!">
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <a className="font-semibold text-blue-700 hover:underline" href="#">
          Daftar
        </a>
      </p>
    </AuthShell>
  );
}

export function SignupPage() {
  return (
    <AuthShell title="Buat Akun Baru" subtitle="Gabung dan mulai tingkatkan skill Anda.">
      <SignupForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <a className="font-semibold text-blue-700 hover:underline" href="#">
          Masuk
        </a>
      </p>
    </AuthShell>
  );
}
