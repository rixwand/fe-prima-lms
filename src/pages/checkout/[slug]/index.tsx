import Checkout from "@/components/views/Checkout";
import Image from "next/image";
import Link from "next/link";
import { IoReturnDownBack } from "react-icons/io5";

export default function CheckoutPage() {
  return (
    <section className="w-full">
      <nav className="fixed flex w-full shadow-md py-5 px-6 md:px-12 top-0">
        <Link
          href={"#"}
          className="flex mt-1 absolute text-prime items-center gap-x-2">
          <IoReturnDownBack size={24} />
          <p className="font-semibold md:flex hidden text-lg">Kembali</p>
        </Link>
        <Image
          className="mx-auto"
          src="/images/logo-full.png"
          alt="brand logo"
          height={34}
          width={128}
        />
      </nav>
      <Checkout />
    </section>
  );
}
