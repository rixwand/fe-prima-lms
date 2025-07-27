import { poppins } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import Image from "next/image";
import Link from "next/link";
import {
  FaChevronUp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

export default function Footer() {
  return (
    <footer className={cn([poppins.className, "bg-[#1E40AF]"])}>
      <div className="container items-center flex px-6 justify-between flex-row md:px-0 py-9 mx-auto">
        <div className="relative lg:hidden w-52 lg:w-56 aspect-[17/5] h-fit">
          <Image
            src={"/images/logo-full.png"}
            alt="logo prima"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex sm:flex-row flex-wrap flex-col gap-y-12 container px-6 md:px-0 justify-between gap-x-15 lg:justify-between mx-auto pb-16">
        <div className="relative lg:flex hidden w-52 lg:w-56 aspect-[17/5] h-fit">
          <Image
            src={"/images/logo-full.png"}
            alt="logo prima"
            fill
            className="object-contain"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Jelajahi</h2>
          <p className="text-white">Beranda</p>
          <p className="text-white">PPI</p>
          <p className="text-white">Blog</p>
          <p className="text-white">Kursus</p>
          <p className="text-white">Kontak</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Kontak Kami</h2>
          <div className="flex flex-row gap-x-6">
            <div className="text-white">
              <SlLocationPin size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Alamat :</p>
              <p className="text-white">Jl. Sukawati,</p>
              <p className="text-white">Kecamatan Tanete Riattang</p>
              <p className="text-white">Kabupaten Bone</p>
            </div>
          </div>
          <div className="flex flex-row gap-x-6">
            <div className="text-white">
              <FaWhatsapp size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Whatsapp :</p>
              <p className="text-white">081-342-100-500</p>
              <p className="text-white">085-233-800-800</p>
            </div>
          </div>
          <div className="flex flex-row gap-x-6">
            <div className="text-white">
              <LuMail size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Email :</p>
              <p className="text-white">primabone@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-white mb-4">Ikuti Kami</h2>
          <Link href={"#"} className="text-white flex items-center gap-3">
            <FaYoutube size={28} /> Youtube
          </Link>
          <Link href={"#"} className="text-white flex items-center gap-3">
            <FaFacebook size={28} /> Facebook
          </Link>
          <Link href={"#"} className="text-white flex items-center gap-3">
            <FaInstagram size={28} /> Instagram
          </Link>
          <Link href={"#"} className="text-white flex items-center gap-3">
            <FaTwitter size={28} /> Twitter
          </Link>
          <Link href={"#"} className="text-white flex items-center gap-3">
            <FaLinkedin size={28} /> LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
