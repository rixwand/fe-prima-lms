import { Button } from "@heroui/react";
import { ReactNode } from "react";
import { FaInfo, FaUserSecret } from "react-icons/fa6";
import { LuBookOpen, LuClipboardCheck, LuFileCheck2, LuVideo } from "react-icons/lu";

export default function LearnCourse({ children }: { children: ReactNode }) {
  return <h1 className="w-full text-center">{children}</h1>;
}

export function LearnCourseIntro() {
  return (
    <article className="mx-auto md:-mt-14 -mt-3 mb-16 max-w-3xl px-5 py-8 lg:py-10 text-zinc-800">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e40af]">Mekanisme Belajar</h1>
        <p className="mt-3 text-base leading-7 text-zinc-700">
          Selamat datang di{" "}
          <span className="font-semibold">Kursus Microsoft Office Word – Prima Bina Insani Profesional</span>. Sebelum
          memulai pembelajaran, penting bagi Anda untuk memahami tahapan, metode belajar, dan fasilitas yang tersedia
          agar proses belajar berjalan efektif dan terarah.
        </p>
      </header>

      {/* Materi Pembelajaran */}
      <section className="space-y-5">
        <span className="flex justify-between">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <LuBookOpen className="h-6 w-6 text-[#1e40af]" />
            Materi Pembelajaran
          </h2>
          <Button className="bg-prime text-white font-semibold" radius="sm">
            Mulai Belajar
          </Button>
        </span>

        {/* Materi Bacaan */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LuBookOpen className="h-5 w-5 text-[#1e40af]" />
            Materi Bacaan
          </h3>
          <p className="mt-2 leading-7 text-zinc-700">
            Materi dalam kursus ini sebagian besar disajikan dalam bentuk teks yang sistematis dan mudah dipahami.
            Format ini dipilih karena efektif untuk memperdalam pemahaman dan memudahkan peserta dalam mempraktikkan
            langsung langkah-langkah pembelajaran.
          </p>
        </div>

        {/* Video Pembelajaran */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LuVideo className="h-5 w-5 text-[#1e40af]" />
            Video Pembelajaran
          </h3>
          <p className="mt-2 leading-7 text-zinc-700">
            Beberapa materi juga disampaikan melalui video yang memberikan penjelasan praktis dan visual. Terdapat video
            yang <span className="font-medium">tidak dapat dipercepat atau di-skip</span>, sehingga pastikan Anda
            meluangkan waktu secara khusus untuk menyimak video hingga selesai.
          </p>
        </div>

        {/* Forum Diskusi / Grup Belajar */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaUserSecret className="h-5 w-5 text-[#1e40af]" />
            Forum Diskusi atau Grup Belajar
          </h3>
          <p className="mt-2 leading-7 text-zinc-700">
            Setiap peserta akan tergabung dalam forum atau grup belajar yang difasilitasi oleh instruktur. Di forum ini,
            Anda dapat bertanya, berdiskusi, serta berbagi pengetahuan dengan peserta lainnya. Partisipasi aktif sangat
            disarankan untuk memperkuat pemahaman materi.
          </p>
          <p className="mt-2 leading-7 text-zinc-700">
            Jika Anda mengalami kendala teknis atau administrasi, silakan hubungi admin melalui kontak resmi.
            <span className="font-medium">
              {" "}
              Mohon tidak menggunakan grup diskusi untuk pertanyaan bersifat teknis pribadi.
            </span>
          </p>
        </div>
      </section>

      {/* Evaluasi Pembelajaran */}
      <section className="space-y-5 mt-10">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <LuClipboardCheck className="h-6 w-6 text-[#1e40af]" />
          Evaluasi Pembelajaran
        </h2>

        {/* Kuis & Ujian Akhir */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LuClipboardCheck className="h-5 w-5 text-[#1e40af]" />
            Kuis dan Ujian Akhir
          </h3>
          <p className="mt-2 leading-7 text-zinc-700">
            Tersedia kuis-kuis kecil pada setiap bagian materi untuk mengevaluasi pemahaman Anda, serta ujian akhir
            kelas yang mencakup keseluruhan materi. Jika terdapat soal yang sulit dijawab, sebaiknya Anda mengulang
            kembali materi yang bersangkutan.
          </p>
        </div>

        {/* Tugas / Submission */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LuFileCheck2 className="h-5 w-5 text-[#1e40af]" />
            Tugas atau Submission
          </h3>
          <p className="mt-2 leading-7 text-zinc-700">
            Setiap peserta akan diberikan tugas praktik berupa dokumen file yang harus dikerjakan secara mandiri dan
            diunggah sebagai bukti pemahaman. Tugas ini akan diperiksa oleh instruktur.
          </p>
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
            <p className="text-sm leading-6">
              <span className="font-semibold">Penting:</span> Kerjakan tugas secara jujur. Segala bentuk plagiasi akan
              dikenai sanksi, mulai dari peringatan hingga dikeluarkan dari kelas.
            </p>
          </div>
        </div>
      </section>

      {/* Catatan Tambahan */}
      <section className="space-y-4 mt-10">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <FaInfo className="h-6 w-6 text-[#1e40af]" />
          Catatan Tambahan
        </h2>
        <ul className="list-disc pl-6 leading-7 text-zinc-700 space-y-2">
          <li>
            Informasi lebih lanjut mengenai sistem penilaian, tenggat waktu, dan sertifikat akan dijelaskan oleh
            instruktur di awal pertemuan.
          </li>
          <li>Pastikan perangkat anda memiliki koneksi internet yang stabil jika mengikuti kursus secara online.</li>
          <li>Gunakan waktu belajar sebaik mungkin, dan jangan ragu untuk bertanya jika mengalami kesulitan.</li>
        </ul>
        <p className="mt-2 text-zinc-700">
          Selamat belajar dan semoga Anda mendapatkan manfaat maksimal dari kursus ini.
          <br />
          <span className="font-semibold">
            Prima Bina Insani Profesional – Mengasah Keterampilan, Membangun Masa Depan.
          </span>
        </p>
      </section>
    </article>
  );
}
