import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import Image from "next/image";

interface BoxProps {
  icon: string;
  title: string;
}

export default function FeatureSection() {
  const features: BoxProps[] = [
    { icon: "/svg/icons/chat.svg", title: "teknologi informasi &…" },
    { icon: "/svg/icons/BSM.svg", title: "Bisnis & Manajemen" },
    { icon: "/svg/icons/TBN.svg", title: "Tata Busana" },
    { icon: "/svg/icons/vegies.svg", title: "Teknik Pengolahan..." },
    { icon: "/svg/icons/OTO.svg", title: "Mengemudi" },
  ];
  return (
    <section
      className={cn([inter.className, "flex items-center my-24 flex-col"])}>
      <h2 className="font-bold text-2xl">Berbagai macam kejuruan</h2>
      <p className="text-slate-500 pt-2">
        Pilih kejuruan yang ingin kamu pelajari lebih lanjut.
      </p>
      <div className="flex lg:gap-x-6 gap-y-12 lg:gap-y-0 mt-10 flex-wrap items-center justify-center">
        {features.map(({ title, icon }, i) => (
          <Box {...{ title, icon }} key={i} />
        ))}
      </div>
    </section>
  );
}

const Box = ({ icon, title }: BoxProps) => {
  return (
    <div className="flex w-[7.5rem] flex-col items-center justify-center">
      <Image width={56} height={56} src={icon} alt={`${title} icon`} />
      <p className="text-sm mt-4 text-center text-wrap">{title}</p>
    </div>
  );
};
