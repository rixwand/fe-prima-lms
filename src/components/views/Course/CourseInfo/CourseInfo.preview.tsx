import NotFound from "@/components/commons/NotFound";
import usePayment from "@/hooks/payment/use-payment";
import useDump from "@/hooks/use-dump";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { getYouTubeEmbedUrl } from "@/libs/utils/string";
import courseQueries from "@/queries/course-queries";
import { Accordion, AccordionItem, Button, Card, Chip, Skeleton, Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiInfo } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { LuSquareArrowOutUpRight, LuUsers } from "react-icons/lu";
import { Rating } from "react-simple-star-rating";

export default function CourseInfo({ slug }: { slug: string }) {
  const { isError, error, isPending, data } = useQuery(courseQueries.options.getCourseBySlug(slug));
  useDump(data);
  const { purchase } = usePayment();
  const { status } = useSession();
  const router = useRouter();
  useNProgress(isPending);
  useQueryError({ isError, error });
  if (isPending) return <CourseDetailSkeleton />;
  if (!data && !isPending && error && isError && isAxiosError(error))
    return <NotFound code={error.status} message={error.message} />;
  if (!data) return null;
  const {
    metaApproved: { descriptionJson, shortDescription, coverImage, isFree, priceAmount, title, previewVideo },
    sections,
    discounts,
    tags,
    slug: _,
  } = data;
  const validUrlPreview = previewVideo ? getYouTubeEmbedUrl(previewVideo) : null;
  const onCheckout = () => {
    if (status == "unauthenticated") {
      const callbackUrl = router.asPath;
      router.push({ pathname: "/auth/login", query: { callbackUrl } });
    } else purchase({ courseId: data.id });
  };
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
              <span className="flex items-center gap-x-2">
                <p className="text-slate-800">Tags:</p>
                {tags.map(({ name, slug }) => (
                  <Chip key={slug} variant="bordered" color="primary">
                    {name}
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
        <div className="w-full max-w-md max-lg:max-w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Price Row */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Harga Kursus</span>
            <span className="text-sm font-medium text-slate-400 line-through">
              {priceAmount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          {/* Discountsdiscounts */}
          {discounts && discounts.length > 0 && discounts[0].isActive && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Diskon {discounts[0].type == "PERCENTAGE" && discounts[0].value + "%"}
              </span>
              <span className="text-base font-semibold text-emerald-600">
                -
                {(discounts[0].type == "FIXED"
                  ? discounts[0].value
                  : priceAmount * (discounts[0].value / 100)
                ).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          )}

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
              {(discounts && discounts.length > 0 && discounts[0].isActive
                ? finalPrice(priceAmount, discounts[0].value, discounts[0].type)
                : priceAmount
              ).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          {/* Checkout */}
          <Button
            onPress={onCheckout}
            isIconOnly
            radius="none"
            className="mt-6 w-full flex justify-center items-center rounded-xl bg-white py-3 text-sm font-semibold text-primary ring-1 ring-primary transition hover:bg-primary hover:text-white cursor-pointer">
            Checkout
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

const SyllabusTab = ({ sections }: { sections: { title: string; lessons?: Lesson[] }[] }) => {
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

function CourseDetailSkeleton() {
  return (
    <section className={cn(["2xl:container xl:px-12 2xl:mx-auto px-4 my-12"])}>
      <div className="flex relative max-xl:mx-auto max-xl:container flex-col min-xl:flex-row gap-x-4 gap-y-9 items-start">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <div className="flex gap-8 flex-col sm:flex-row">
            {/* Cover Image */}
            <Skeleton className="max-w-96 w-full aspect-video rounded-lg" />

            <div className="space-y-4 w-full">
              {/* Title */}
              <Skeleton className="h-8 w-3/4 rounded-md" />

              {/* Tags */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>

              {/* Duration */}
              <Skeleton className="h-5 w-40 rounded-md" />

              {/* Participants */}
              <Skeleton className="h-5 w-36 rounded-md" />

              {/* Rating */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-6 w-10 rounded-md" />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="lg:mt-12 mt-6 space-y-6">
            {/* Tab Headers */}
            <div className="flex gap-6">
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            {/* Tab Content */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <Card
          className={cn([
            "px-6 sticky top-20 h-fit py-5 xl:ml-auto shadow-md border space-y-4 border-[#E4E4E7] bg-white max-w-[25rem] w-full",
          ])}>
          {/* Harga */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>

          {/* Discount (optional placeholder) */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          {/* Promo Label */}
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />

          {/* Promo Input + Button */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>

          {/* Checkout Button */}
          <Skeleton className="h-12 w-full rounded-lg mt-2" />
        </Card>
      </div>
    </section>
  );
}
