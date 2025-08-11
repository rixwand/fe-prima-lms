import Checkout from "@/components/views/Checkout";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { IoReturnDownBack } from "react-icons/io5";

export default function CheckoutPage() {
  return (
    <section className="w-full">
      <Navbar isBordered maxWidth="full">
        <NavbarContent className="absolute">
          <NavbarItem>
            <Link href={"#"} className="flex text-prime items-center gap-x-2">
              <IoReturnDownBack size={24} />
              <p className="font-semibold md:flex hidden text-lg">Kembali</p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="center" className="w-full">
          <Image
            src="/images/logo-full.png"
            alt="brand logo"
            height={34}
            width={128}
          />
        </NavbarContent>
      </Navbar>
      {/* <nav className="fixed flex w-full shadow-md z-50 bg-white py-5 px-6 md:px-12 top-0">
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
      </nav> */}
      <Checkout />
    </section>
  );
}
