import { inter, quicksand } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  Chip,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import Image from "next/image";
import { IoMdTime } from "react-icons/io";
import { LuUsers } from "react-icons/lu";
import { PiInfoBold } from "react-icons/pi";
import { Rating } from "react-simple-star-rating";

export default function CourseInfo() {
  return (
    <section className={cn([inter.className, "container px-12 mx-auto my-12"])}>
      <div className="flex gap-x-8">
        <div className="flex-1">
          <div className="flex gap-x-8">
            <div className="w-[23rem] h-fit aspect-video rounded-lg overflow-hidden relative bg-red-50">
              <Image
                src={"/images/course-img.png"}
                alt="course image"
                fill
                objectFit="contain"
              />
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-2xl">
                Menjadi Admin Profesional: Microsoft Office Word
              </h1>
              <span className="flex items-center gap-x-2">
                <p className="text-slate-800">Tags:</p>
                <Chip variant="bordered" color="primary">
                  Microsft Word
                </Chip>
              </span>
              <p className="text-slate-800 flex items-center gap-x-1">
                <IoMdTime size={24} /> <span>20 Jam Belajar</span>
              </p>
              <p className="text-slate-700 flex items-center gap-x-1">
                <LuUsers size={20} stroke="#3F3F46" />{" "}
                <span>1.2rb Peserta</span>
              </p>
              <span className="flex items-center gap-x-3">
                <Rating size={24} initialValue={4.5} allowFraction />
                <p className="text-lg font-semibold mt-1">4.5</p>
              </span>
            </div>
          </div>
          <div className={"mt-12"}>
            <Tabs size="lg" aria-label="Tabs variants" variant={"underlined"}>
              <Tab key="desc" title="Deskripsi">
                <DescTab />
              </Tab>
              <Tab key="sylabus" title="Silabus">
                <SyllabusTab />
              </Tab>
              <Tab key="preview" title="Preview">
                <PreviewTab />
              </Tab>
            </Tabs>
          </div>
        </div>
        <Card className="px-6 h-fit py-5 ml-auto shadow-md border space-y-3 border-[#E4E4E7] bg-white w-[25rem]">
          <span className="w-full flex items-center justify-between">
            <p className="font-bold">Harga Kursus</p>
            <p className="text-xl font-semibold text-[#aaa] line-through">
              Rp850.000
            </p>
          </span>
          <span className="w-full flex items-center justify-between">
            <p className=" text-lg leading-2">Diskon 15%</p>
            <p className="text-xl font-semibold">Rp550.000</p>
          </span>
          <span className="flex items-center gap-x-2">
            <p className="font-semibold">Kode Promo</p>
            <PiInfoBold size={22} />
          </span>
          <p className="">Bayar lebih hemat dengan promo</p>
          <span className="mt-2 flex items-center gap-x-4">
            <Input
              classNames={{
                innerWrapper: ["px-1"],
              }}
              placeholder="Masukkan kode promo"
              radius="sm"
              variant="bordered"
              color="success"
            />
            <Button className="bg-[#1E40AF] text-white font-semibold rounded-lg px-6">
              Terapkan
            </Button>
          </span>
          <span className="flex items-center justify-between">
            <p className="ml-1 text-[#1E40AF] font-semibold">Diskon 20%</p>
            <p className="text-[#1E40AF] text-lg font-semibold">-Rp110.000</p>
          </span>
          <span className="w-full flex items-center justify-between mt-2">
            <p className="font-bold">Jumlah Tagihan</p>
            <p className="text-xl font-semibold">Rp440.000</p>
          </span>
          <Button className="mt-2 bg-[#1E40AF] py-5.5 text-white font-semibold rounded-lg text-lg px-6">
            Checkout
          </Button>
        </Card>
      </div>
    </section>
  );
}

const PreviewTab = () => {
  return (
    <div className="mt-3 w-4/5 text-gray-500 text-lg">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ICjExVfOKbdQW3Nf"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
};

const SyllabusTab = () => {
  const syllabus = [
    {
      title: "Pengenalan Microsoft Word dan Antarmuka Pengguna",
      point: [
        "Mengenal fungsi Microsoft Word dan kegunaannya",
        "Menjelajahi antarmuka (toolbar, ribbon, dan area kerja)",
        "Membuat, menyimpan, dan membuka dokumen baru",
        "Mengenal ekstensi file dan mode penyimpanan (.docx, .pdf, dll)",
      ],
    },
    {
      title: "Dasar-dasar Pengetikan dan Format Teks",
      point: [
        "Mengetik, menghapus, dan menyalin teks",
        "Mengatur jenis, ukuran, dan warna font",
        "Menggunakan bold, italic, underline, dan highlight",
        "Shortcut dasar untuk mempercepat pekerjaan",
      ],
    },
    {
      title: "Pengaturan Paragraf dan Halaman",
      point: [
        "Menyusun paragraf dengan spasi, perataan, dan indentasi",
        "Membuat daftar bernomor dan berbutir",
        "Mengatur margin, orientasi, dan ukuran kertas",
        "Menambahkan header, footer, dan nomor halaman",
      ],
    },
    {
      title: "Tabel dan Elemen Visual dalam Dokumen",
      point: [
        "Membuat dan memodifikasi tabel",
        "Menambahkan gambar, ikon, dan bentuk (shapes)",
        "Menyisipkan SmartArt untuk visualisasi informasi",
        "Menyesuaikan posisi dan ukuran objek visual",
      ],
    },
    {
      title: "Fitur Otomatisasi dan Pencarian Cepat",
      point: [
        "Fitur Find & Replace untuk mengubah teks secara massal",
        "Penggunaan Styles dan Themes untuk tampilan konsisten",
        "Pengenalan Quick Parts dan AutoText",
        "Mengatur template untuk dokumen tertentu",
      ],
    },
    {
      title: "Mail Merge (Surat Massal Otomatis)",
      point: [
        "Konsep dasar Mail Merge dan manfaatnya",
        "Menghubungkan Word dengan data dari Excel",
        "Membuat surat, label, atau sertifikat massal",
        "Mengekspor hasil Mail Merge ke dokumen atau PDF",
      ],
    },
    {
      title: "Referensi dan Struktur Dokumen Profesional",
      point: [
        "Membuat daftar isi otomatis",
        "Menambahkan catatan kaki dan kutipan (footnote & citation)",
        "Menyusun daftar gambar dan tabel",
        "Penggunaan section break dan page break",
      ],
    },
    {
      title: "Tips Mahir & Simulasi Proyek Dokumen Nyata",
      point: [
        "Tips dan trik kerja cepat di Word",
        "Shortcut tingkat lanjut dan efisiensi kerja",
        "Simulasi membuat dokumen profesional (contoh: proposal, surat resmi)",
        "Persiapan cetak dan ekspor ke PDF",
      ],
    },
  ];

  return (
    <div className="space-y-3 w-4/5 text-gray-500 text-lg">
      <h3 className="w-full ml-3 font-semibold text-lg">
        Materi yang akan dipelajari pada kursus ini :
      </h3>
      <Accordion
        itemClasses={{
          base: ["shadow-none border-1 border-gray-300 mt-0.5"],
          title: ["text-gray-500", "font-semibold"],
        }}
        variant="splitted">
        {syllabus.map((item, index) => (
          <AccordionItem
            key={index}
            aria-label={`Accordion ${index}`}
            title={item.title}>
            <ul className="text-gray-500 mb-4 -mt-2 list-disc space-y-2">
              {item.point.map((list, index) => (
                <li key={index} className="ml-6">
                  {list}
                </li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const DescTab = () => {
  return (
    <div className="mx-2 space-y-3 text-gray-500 text-lg">
      <p className="w-4/5">
        Kursus ini dirancang khusus untuk membantu Anda menguasai Microsoft Word
        dari dasar hingga fitur-fitur lanjutan.
        <br />
        Melalui materi yang terstruktur dan mudah dipahami, Anda akan belajar
        cara membuat dokumen profesional, mengatur layout, menggunakan berbagai
        fitur otomatisasi seperti mail merge, hingga membuat laporan dengan
        elemen visual yang menarik. <br /> Kursus ini cocok untuk pelajar,
        mahasiswa, karyawan, hingga pebisnis yang ingin meningkatkan
        produktivitas kerja dan kemampuan presentasi dokumen.
      </p>
      <h3 className="font-semibold">
        Yang akan Anda dapatkan setelah menyelesaikan kursus:
      </h3>
      <ul className="list-disc ml-7 space-y-1">
        <li>
          Menguasai dasar-dasar Microsoft Word (pengetikan, penyimpanan, dan
          navigasi dokumen)
        </li>
        <li>
          Mampu mengatur format teks, paragraf, dan halaman secara profesional
        </li>
        <li>Membuat tabel, grafik, dan elemen visual lainnya dalam dokumen</li>
        <li>
          Menggunakan fitur mail merge untuk otomatisasi surat atau sertifikat
        </li>
        <li>
          Membuat daftar isi otomatis, daftar gambar, dan penomoran halaman
        </li>
        <li>
          Menyusun dokumen laporan, surat resmi, dan proposal dengan struktur
          yang benar
        </li>
        <li>
          Meningkatkan kecepatan dan efisiensi kerja dengan shortcut dan tips
          praktis
        </li>
        <li>Sertifikat penyelesaian sebagai bukti kompetensi Anda</li>
      </ul>
      <h3 className="font-semibold">
        Tools yang dibutuhkan untuk mengikuti kursus:
      </h3>
      <ul className="list-disc ml-7 space-y-1">
        <li>Laptop/PC dengan sistem operasi Windows atau macOS</li>
        <li>
          Microsoft Word (versi 2016 ke atas disarankan, termasuk Microsoft 365)
        </li>
        <li>Koneksi internet stabil untuk mengakses materi kursus</li>
        <li>Headset atau speaker untuk mendengarkan penjelasan video</li>
        <li>Alat catat (digital atau manual) untuk mencatat poin penting</li>
      </ul>
    </div>
  );
};
