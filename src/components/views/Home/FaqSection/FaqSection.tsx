import { poppins } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Accordion, AccordionItem } from "@heroui/react";

export default function FaqSection() {
  return (
    <section
      className={cn([
        poppins.className,
        "container my-32 mx-auto px-6 xl:px-24",
      ])}>
      <h2 className="text-2xl font-bold text-center lg:mb-7 mb-10">
        {"Frequently Asked Questions (FAQ)"}
      </h2>
      <Accordion
        variant="light"
        selectionMode="multiple"
        aria-expanded
        defaultExpandedKeys={["1"]}
        itemClasses={{
          title: ["lg:text-xl", "text-lg", "font-semibold"],
          content: [
            "mb-4",
            "lg:text-lg",
            "text-base",
            "text-[#4B5563]",
            "leading-[28px]",
          ],
          startContent: "",
        }}>
        <AccordionItem
          key="1"
          aria-label="Accordion 1"
          title="Apa itu Prima Bina Insani Profesional?">
          Prima Bina Insani Profesional adalah lembaga pelatihan yang
          menyediakan Program Pendidikan 1 Tahun dan Kursus Singkat untuk
          membekali peserta dengan keterampilan siap kerja di bidang
          Informatika, Bisnis, dan Perkantoran.
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Accordion 2"
          title="Apa keunggulan Program Pendidikan 1 Tahun di Prima Bina Insani Profesional?">
          Program ini dirancang fokus pada praktik, pembelajaran intensif,
          bimbingan karier, serta peluang magang dan kerja setelah lulus. Cocok
          untuk lulusan SMA/SMK maupun sarjana yang ingin cepat kerja.
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Accordion 3"
          title="Apa saja kursus singkat yang tersedia?">
          Kami menyediakan kursus singkat seperti Komputer Office, Desain
          Grafis, Video Editing, Web Programming, Bahasa Inggris, Menjahit, dan
          Mengemudi, yang bisa diikuti secara offline maupun hybrid.
        </AccordionItem>
      </Accordion>
    </section>
  );
}
