import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { applyDiscounts } from "@/libs/utils/currency";
import { getYouTubeEmbedUrl } from "@/libs/utils/string";
import { Accordion, AccordionItem, Button, Chip, Tab, Tabs } from "@heroui/react";
import Image from "next/image";
import { FiInfo } from "react-icons/fi";
import { LuClock4, LuSquareArrowOutUpRight, LuStar, LuUsers } from "react-icons/lu";

export default function CoursePreview({
  showPublished,
  data: { metaDraft, metaApproved, ...data },
  onOpenCurriculum = () => {},
}: {
  data: Course;
  onOpenCurriculum?: () => void;
  showPublished: boolean;
}) {
  const { previewVideo, coverImage, descriptionJson, priceAmount, shortDescription, title } = showPublished
    ? metaApproved
    : metaDraft;
  const validUrlPreview = previewVideo ? getYouTubeEmbedUrl(previewVideo) : null;
  const { sections, discounts, tags, categories } = data;
  const { draftCategories, draftTags, draftDiscounts } = metaDraft;
  return (
    <section className={cn([inter.className, "2xl:container xl:px-12 2xl:mx-auto px-6 my-12"])}>
      <div className="flex relative max-xl:mx-auto max-xl:container flex-col min-xl:flex-row gap-x-4 gap-y-9 items-start">
        <div className="flex-1">
          <div className="flex gap-8 flex-col sm:flex-row">
            <div className="max-w-96 w-full h-fit aspect-video rounded-lg overflow-hidden relative">
              <Image src={coverImage} alt="course image" fill objectFit="cover" />
            </div>
            <div className="space-y-4">
              <h1 className="font-bold text-xl xl:text-2xl">{title}</h1>
              <div className="space-y-2">
                <p className="text-slate-800">Kategori:</p>
                <span className="flex gap-x-2">
                  {(showPublished ? categories : draftCategories).map((c, index) => (
                    <Chip size="md" key={c.id} radius="sm" color="primary" variant={index == 0 ? "solid" : "flat"}>
                      {c.name}
                    </Chip>
                  ))}
                </span>
              </div>
              <span className="flex items-center gap-x-3">
                <p className="text-slate-700 flex items-center gap-x-1">
                  <LuClock4 size={20} /> <span>20jam</span>
                </p>
                <p className="text-slate-700 flex items-center gap-x-1">
                  <LuUsers size={20} /> <span>1.2rb</span>
                </p>
                <p className="flex items-center gap-x-1 text-slate-700">
                  <LuStar size={20} />
                  <span>4.5</span>
                </p>
              </span>
              <span className="flex items-center gap-x-2">
                <p className="text-slate-800">Tags:</p>
                {(showPublished ? tags : draftTags).map(({ name, slug }) => (
                  <Chip key={slug} variant="bordered" color="primary">
                    {name}
                  </Chip>
                ))}
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
                  <SyllabusTab showPublished={showPublished} sections={sections} />
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
        <div className="w-full max-w-md max-lg:max-w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Harga Kursus</span>
            <span
              className={cn(
                "text-sm font-medium",
                (showPublished ? discounts : (draftDiscounts ?? [])).some(d => d.isActive)
                  ? "text-slate-400 line-through"
                  : "text-slate-600",
              )}>
              {priceAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          {(showPublished ? discounts : (draftDiscounts ?? [])).map(discount => (
            <DiscountItem {...{ discount, priceAmount }} />
          ))}

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
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {applyDiscounts(priceAmount, showPublished ? discounts : (draftDiscounts ?? [])).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          {/* Checkout */}
          <Button
            onPress={onOpenCurriculum}
            isIconOnly
            radius="none"
            className="mt-6 w-full flex justify-center items-center rounded-xl bg-white py-3 text-sm font-semibold text-primary ring-1 ring-primary transition hover:bg-primary hover:text-white cursor-pointer">
            Open Curriculum
            <LuSquareArrowOutUpRight className="ml-2" size={16} />
          </Button>
        </div>
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

const SyllabusTab = ({
  sections,
  showPublished,
}: {
  sections: { title: string; lessons?: Lesson[]; publishedAt: string | null }[];
  showPublished: boolean;
}) => {
  return (
    <div className="space-y-3 w-full lg:w-4/5 text-gray-500 2xl:text-lg">
      <h3 className="w-full lg:ml-3 font-medium 2xl:text-lg">Materi yang akan dipelajari pada kursus ini :</h3>
      <Accordion
        itemClasses={{
          base: ["shadow-none border-1 border-gray-300 mt-0.5 lg:ml-0 -ml-2"],
          title: ["text-gray-500", "font-semibold"],
        }}
        variant="splitted">
        {sections.map((item, index) => (
          <AccordionItem
            hidden={showPublished && item.publishedAt == null}
            key={index}
            aria-label={`Accordion ${index}`}
            title={item.title}>
            <ul className="text-gray-500 mb-4 -mt-2 list-disc space-y-2">
              {item.lessons &&
                item.lessons.map((list, index) => (
                  <li hidden={showPublished && list.publishedAt == null} key={index} className="ml-6">
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

function DiscountItem({ discount, priceAmount }: { discount: Discount; priceAmount: number }) {
  if (!discount.isActive) return null;

  const discountAmount = discount.type === "FIXED" ? discount.value : priceAmount * (discount.value / 100);

  return (
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600">
        Diskon {discount.type === "PERCENTAGE" && `${discount.value}%`}
      </span>

      <span className="text-base font-semibold text-emerald-600">
        -
        {discountAmount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}
