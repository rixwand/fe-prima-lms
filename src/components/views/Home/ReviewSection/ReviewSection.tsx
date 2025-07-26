import { poppins } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Card } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";

type TReview = {
  name: string;
  avatar: string;
  rating: number;
  review: string;
  role: string;
};

// Randomly assign avatars
const getRandomAvatar = () =>
  `/images/rev${Math.floor(Math.random() * 3 + 1)}.jpg`;

const reviews = [
  {
    name: "Dimas",
    role: "Pegawai Swasta",
    avatar: getRandomAvatar(),
    rating: 5,
    review:
      "Belajar di Prima Bina Insani Profesional benar-benar membuka wawasan saya. Saya tidak hanya diajarkan teori, tetapi juga langsung praktik membuat proyek nyata...",
  },
  {
    name: "Husain Amin",
    role: "Orang Tua Alumni",
    avatar: getRandomAvatar(),
    rating: 4,
    color: "text-indigo-600",
    review:
      "Awalnya saya ragu karena anak saya tidak melanjutkan ke universitas. Tapi setelah ikut program ini, sekarang dia punya skill, sertifikat, dan pekerjaan tetap...",
  },
  {
    name: "Siti Rahayu",
    role: "Pegawai Swasta",
    avatar: getRandomAvatar(),
    rating: 5,
    review:
      "Saya mengikuti kursus singkat Microsoft Office untuk meningkatkan kemampuan kerja. Kini saya lebih percaya diri menggunakan Excel dan Word di kantor...",
  },
  {
    name: "Budi Santoso",
    role: "Mahasiswa",
    avatar: getRandomAvatar(),
    rating: 4,
    color: "text-yellow-500",
    review:
      "Materinya mudah dipahami dan langsung praktik. Cocok buat mahasiswa yang ingin cepat kerja!",
  },
  {
    name: "Lina Marlina",
    role: "Ibu Rumah Tangga",
    avatar: getRandomAvatar(),
    rating: 5,
    review:
      "Sekarang saya bisa membantu anak saya belajar komputer di rumah. Terima kasih atas bimbingannya!",
  },
];

export default function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3;

  useEffect(() => {
    const onResize = () => setCurrentIndex(0);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const nextLg = () => {
    if (currentIndex + visibleCards < reviews.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const next = () => {
    if (currentIndex + 1 < reviews.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="my-24">
      <h2 className="text-2xl font-bold text-center">Testimonials</h2>
      <div className="relative w-full md:px-18 max-w-7xl mx-auto py-6">
        {/* Arrow Buttons (absolute sides) */}
        <button
          onClick={prev}
          className="absolute left-4 xl:left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-indigo-500 text-indigo-500 rounded-full shadow hover:bg-indigo-100 disabled:opacity-30"
          disabled={currentIndex === 0}>
          <FaChevronLeft />
        </button>
        <button
          onClick={next}
          className="absolute xl:hidden flex right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-indigo-500 text-indigo-500 rounded-full shadow hover:bg-indigo-100 disabled:opacity-30"
          disabled={currentIndex + 1 >= reviews.length}>
          <FaChevronRight />
        </button>

        <button
          onClick={nextLg}
          className="absolute hidden xl:flex right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-indigo-500 text-indigo-500 rounded-full shadow hover:bg-indigo-100 disabled:opacity-30"
          disabled={currentIndex + visibleCards >= reviews.length}>
          <FaChevronRight />
        </button>

        {/* Slider */}
        <div className="overflow-hidden mx-12 md:mx-0">
          <div
            className="hidden xl:flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(100 / visibleCards) * currentIndex}%)`,
            }}>
            {reviews.map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))}
          </div>
          <div
            className="flex xl:hidden transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${100 * currentIndex}%)`,
            }}>
            {reviews.map((review, index) => (
              // <></>
              <ReviewCard review={review} key={index} />
            ))}
            <div className="w-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
const ReviewCard = ({ review }: { review: TReview }) => {
  return (
    <div className="xl:w-1/3 w-full px-4 box-border py-5 flex-shrink-0 ">
      <Card className="h-full p-6 bg-white shadow-sm border border-prime">
        <p
          className={cn([
            poppins.className,
            "text-[#6B7280] text-lg leading-8 mb-4",
          ])}>
          {review.review}
        </p>
        <div className="flex items-center gap-3 mt-auto pt-4">
          <Image
            width={40}
            height={40}
            src={review.avatar}
            alt={review.name}
            className="rounded-full object-cover"
          />
          <div>
            <h4 className={`text-sm font-semibold ${"text-gray-800"}`}>
              {review.name}
            </h4>
            <p className="text-xs text-gray-500">{review.role}</p>
          </div>
          <div className="ml-auto">
            <Rating allowFraction initialValue={review.rating} size={18} />
          </div>
        </div>
      </Card>
    </div>
  );
};
