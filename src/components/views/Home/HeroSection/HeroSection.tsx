import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div
      className={cn([
        inter.className,
        "w-full bg-[#1E40AF] relative overflow-hidden px-4",
      ])}>
      <div className="absolute flex-row -top-52 -bottom-24 -start-24 -end-52 justify-start flex">
        <Image
          src={"/svg/hero-bg.svg"}
          fill
          alt="decoration"
          className="object-cover lg:object-fill"
        />
      </div>
      <div className="z-10 relative container flex mx-auto px-4 flex-wrap lg:flex-row flex-col">
        <div className="lg:w-1/2 flex flex-col justify-center items-center lg:items-start">
          <h1 className="font-bold xl:text-[2.5rem]  text-3xl lg:text-start text-center lg:mt-0 mt-8 text-white">
            Tingkatkan keterampilanmu,
            <br /> wujudkan masa depan cerah
          </h1>
          <p className="text-white mt-7 text-center lg:text-start">
            Temukan pelatihan terbaik sesuai minat dan tujuan kariermu.
          </p>
          <Button className="mt-10 w-fit rounded-lg font-semibold text-white bg-black">
            Daftar dan Ikuti Pelatihan
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-end overflow-hidden">
          <div className="-mb-16 mt-12">
            <Image
              src={"/images/hero-image.png"}
              alt="hero image"
              width={652}
              height={528}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
