import { Card } from "@heroui/react";
import Image, { StaticImageData } from "next/image";
import lopindo from "@/assets/companies-logo/amal-lopindo.png";
import andex from "@/assets/companies-logo/andex.png";
import dxtrick from "@/assets/companies-logo/dxtrick.png";
import lugasganda from "@/assets/companies-logo/lugasganda.png";
import pegadaian from "@/assets/companies-logo/pegadaian.png";
import pln from "@/assets/companies-logo/pln.png";
import qadhy from "@/assets/companies-logo/qadhy.png";
import studio from "@/assets/companies-logo/studio-ponsel.png";
import triasmuda from "@/assets/companies-logo/triasmuda.png";
import uk from "@/assets/companies-logo/uk.png";

const companyLogos = [
  lopindo,
  andex,
  dxtrick,
  lugasganda,
  pegadaian,
  pln,
  qadhy,
  studio,
  triasmuda,
  uk,
];

export default function PartnerSection() {
  return (
    <section className="flex flex-col my-20 items-center lg:px-14">
      <h2 className="font-bold text-2xl">Dipercaya Oleh</h2>
      <div className="flex container gap-6 lg:gap-9 xl:px-9 flex-wrap justify-center mt-9 ">
        {/* <div className="mt-6 lg:mt-9 px-2 grid grid-cols-2 md:gap-9 gap-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"> */}
        {companyLogos.map((logo, i) => (
          <CardLogo key={i} logo={logo} />
        ))}
      </div>
    </section>
  );
}

const CardLogo = ({ logo }: { logo: StaticImageData }) => {
  return (
    <Card className="sm:w-56 w-44 h-20 bg-white flex justify-center items-center">
      <Image src={logo} className="object-center" alt="Bussiness Logo" />
    </Card>
  );
};
