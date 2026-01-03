import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { getYouTubeEmbedUrl } from "@/libs/utils/string";
import { Accordion, AccordionItem, Button, Chip, Tab, Tabs } from "@heroui/react";
import Image from "next/image";
import { FiInfo } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { LuSquareArrowOutUpRight, LuUsers } from "react-icons/lu";
import { Rating } from "react-simple-star-rating";

export default function CourseInfo({ data }: { data: Course }) {
  console.log(data);
  const validUrlPreview = data.previewVideo ? getYouTubeEmbedUrl(data.previewVideo) : null;
  const { descriptionJson, shortDescription, sections, discount } = data;
  return (
    <section className={cn([inter.className, "2xl:container xl:px-12 2xl:mx-auto px-6 my-12"])}>
      <div className="flex relative max-xl:mx-auto max-xl:container flex-col min-xl:flex-row gap-x-4 gap-y-9 items-start">
        <div className="flex-1">
          <div className="flex gap-8 flex-col sm:flex-row">
            <div className="max-w-96 w-full h-fit aspect-video rounded-lg overflow-hidden relative">
              <Image src={data.coverImage} alt="course image" fill objectFit="cover" />
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-xl xl:text-2xl">{data.title}</h1>
              <span className="flex items-center gap-x-2">
                <p className="text-slate-800">Tags:</p>
                {data.tags.map(tag => (
                  <Chip key={tag.tagSlug} variant="bordered" color="primary">
                    {tag.tagName}
                  </Chip>
                ))}
              </span>
              <p className="text-slate-800 flex items-center gap-x-1">
                <IoMdTime size={24} /> <span>20 Jam Belajar</span>
              </p>
              <p className="text-slate-700 flex items-center gap-x-1">
                <LuUsers size={20} stroke="#3F3F46" /> <span>1.2rb Peserta</span>
              </p>
              <span className="flex items-center gap-x-3">
                <Rating size={24} initialValue={4.5} allowFraction />
                <p className="text-lg font-semibold mt-1">4.5</p>
              </span>
            </div>
          </div>
          <div className={"lg:mt-12 mt-6"}>
            <Tabs size="lg" aria-label="Tabs variants" variant={"underlined"}>
              <Tab key="desc" title="Deskripsi">
                <DescTab {...{ descriptionJson, shortDescription }} />
              </Tab>
              {sections && sections.length > 0 && (
                <Tab key="sylabus" title="Silabus">
                  <SyllabusTab sections={sections} />
                </Tab>
              )}
              {validUrlPreview && (
                <Tab key="preview" title="Preview">
                  <PreviewTab url={validUrlPreview} />
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
        {/* <Card
          className={cn([
            "px-6 sticky top-20 h-fit py-5 xl:ml-auto shadow-none border space-y-3 border-[#E4E4E7] bg-white max-w-[25rem]",
          ])}>
          <span className="w-full flex items-center justify-between">
            <p className="font-bold">Harga Kursus</p>
            <p
              className={cn([
                "2xl:text-xl text-lg font-semibold",
                discount && discount.length > 0 && discount[0].isActive && "line-through text-[#aaa]",
              ])}>
              {data.priceAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </p>
          </span>
          {data.discount && data.discount.length > 0 && data.discount[0].isActive && (
            <span className="w-full flex items-center justify-between">
              <p className=" 2xl:text-lg leading-2">
                Diskon {data.discount[0].type == "PERCENTAGE" && data.discount[0].value + "%"}
              </p>
              <p className="2xl:text-xl text-lg font-semibold">
                -
                {(data.discount[0].type == "FIXED"
                  ? data.discount[0].value
                  : data.priceAmount * (data.discount[0].value / 100)
                ).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                })}
              </p>
            </span>
          )}
          <span className="flex items-center gap-x-2">
            <p className="font-semibold">Kode Promo</p>
            <PiInfoBold size={22} />
          </span>
          <p className="text-sm 2xl:text-base">Bayar lebih hemat dengan promo</p>
          <span className="mt-2 flex items-center gap-x-4">
            <Input
              classNames={{
                innerWrapper: ["px-1"],
              }}
              placeholder="Masukkan kode promo"
              radius="sm"
              variant="bordered"
            />
            <Button className="bg-[#1E40AF] text-white font-semibold rounded-lg px-6">Terapkan</Button>
          </span>
          <span className="flex items-center justify-between">
            <p className="ml-1 text-[#1E40AF] text-sm 2xl:text-base font-semibold">Diskon 20%</p>
            <p className="text-[#1E40AF] 2xl:text-lg font-semibold">-Rp110.000</p>
          </span>
          <span className="w-full flex items-center justify-between mt-2">
            <p className="font-bold text-sm 2xl:text-base">Jumlah Tagihan</p>
            <p className="2xl:text-xl text-lg font-semibold">
              {(discount && discount.length > 0 && discount[0].isActive
                ? finalPrice(data.priceAmount, discount[0].value, discount[0].type)
                : data.priceAmount
              ).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </p>
          </span>
          <Button className="mt-2 bg-[#1E40AF] py-5.5 text-white font-semibold rounded-lg 2xltext-lg px-6">
            Checkout
          </Button>
        </Card> */}

        <CheckoutSummary />
      </div>
    </section>
  );
}

const PreviewTab = ({ url }: { url: string }) => {
  return (
    <div className="mt-3 lg:w-4/5 text-gray-500 text-lg">
      <iframe
        width="560"
        height="315"
        // src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ICjExVfOKbdQW3Nf"
        src={url}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
};

const SyllabusTab = ({ sections }: { sections: { title: string; lessons?: Lesson[] }[] }) => {
  return (
    <div className="space-y-3 w-full lg:w-4/5 text-gray-500 2xl:text-lg">
      <h3 className="w-full lg:ml-3 font-semibold 2xl:text-lg">Materi yang akan dipelajari pada kursus ini :</h3>
      <Accordion
        itemClasses={{
          base: ["shadow-none border-1 border-gray-300 mt-0.5 lg:ml-0 -ml-2"],
          title: ["text-gray-500", "font-semibold"],
        }}
        variant="splitted">
        {sections.map((item, index) => (
          <AccordionItem key={index} aria-label={`Accordion ${index}`} title={item.title}>
            <ul className="text-gray-500 mb-4 -mt-2 list-disc space-y-2">
              {item.lessons &&
                item.lessons.map((list, index) => (
                  <li key={index} className="ml-6">
                    {list.title}
                  </li>
                ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const DescTab = ({
  shortDescription,
  descriptionJson,
}: {
  shortDescription: string;
  descriptionJson?: string | null;
}) => {
  return (
    <div className="lg:mx-2 space-y-3 text-gray-500">
      <p className="lg:w-4/5">{shortDescription}</p>
      <p className="lg:w-4/5">{descriptionJson || ""}</p>
    </div>
  );
};

function CheckoutSummary() {
  return (
    <div className="w-full max-w-md max-lg:max-w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Price Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Harga Kursus</span>
        <span className="text-sm font-medium text-slate-400 line-through">Rp 9.999.999</span>
      </div>

      {/* Discount */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Diskon 99%</span>
        <span className="text-base font-semibold text-emerald-600">-Rp 9.899.999</span>
      </div>

      {/* Promo Code */}
      <div className="mt-5">
        <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
          Kode Promo
          <FiInfo className="text-slate-400" size={14} />
        </div>

        <p className="mt-1 text-xs text-slate-500">Bayar lebih hemat dengan promo</p>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan kode promo"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            isIconOnly
            radius="none"
            className="reset-button rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-primary transition hover:bg-primary hover:text-white cursor-pointer">
            Terapkan
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-slate-200" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Harga Akhir</span>
        <span className="text-xl font-bold tracking-tight text-slate-900">Rp 100.000</span>
      </div>

      {/* Checkout */}
      <Button
        isIconOnly
        radius="none"
        className="mt-6 w-full flex justify-center items-center rounded-xl bg-white py-3 text-sm font-semibold text-primary ring-1 ring-primary transition hover:bg-primary hover:text-white cursor-pointer">
        Open Curriculum
        <LuSquareArrowOutUpRight className="ml-2" size={16} />
      </Button>
    </div>
  );
}
