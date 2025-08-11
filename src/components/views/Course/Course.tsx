import CourseCard from "@/components/commons/Cards/CourseCard";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { fromSlug, toSlug } from "@/libs/utils/string";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

export default function Course() {
  const categories = [
    "Semua Kursus",
    "MS. Office",
    "Design Grafis",
    "Teknisi Komputer",
    "Bahasa Inggris",
    "Video Editing",
    "Web Development",
    "3D Desain",
  ];
  const [selectedKeys, setSelectedKeys] = useState(categories[0]);

  const selectedValue = useMemo(() => fromSlug(selectedKeys), [selectedKeys]);
  return (
    <section className={cn([inter.className, "flex"])}>
      {/* <div className="hidden w-2/12 relative 2xl:text-lg min-w-fit pl-6 lg:flex justify-end pr-7 pt-12 bg-[#1E40AF]">
        <div className="space-y-3 sticky top-20 ml-7 flex-col flex w-3/4 max-w-52 min-w-40">
          <h2 className="text-2xl font-bold text-white">Kursus</h2>
          <Divider className="border-2 bg-white w-full" />
          {categories.map((category, i) => (
            <Link
              className={cn([i == 0 && "font-bold", "text-white"])}
              href={"#"}
              key={i}>
              {category}
            </Link>
          ))}
        </div>
      </div> */}
      <aside className="hidden 2xl:text-lg lg:block min-w-fit w-2/12 justify-end shrink-0 bg-[#1E40AF] pl-6 pr-7 pt-12">
        <div className="space-y-3 sticky top-20 ml-7 2xl:ml-auto mr-2 flex-col flex w-3/4 max-w-52 min-w-40">
          {/* <div className="sticky top-20 self-start space-y-3 w-full max-w-52 min-w-40"> */}
          <h2 className="text-2xl font-bold text-white">Kursus</h2>
          <Divider className="border-2 bg-white w-full" />
          {categories.map((category, i) => (
            <Link
              className={cn([i === 0 && "font-bold", "text-white"])}
              href="#"
              key={i}>
              {category}
            </Link>
          ))}
        </div>
      </aside>
      <div className="bg-white px-3 w-full 2xl:px-8 mt-8 mb-24 lg:mx-0 md:mx-8 @container">
        <div className="flex items-center sm:px-4 w-full justify-between mb-5">
          <h2 className="font-semibold text-xl">{selectedValue}</h2>
          <span className="lg:hidden flex">
            <Dropdown>
              <DropdownTrigger>
                <button className="bg-transparent">
                  <HiOutlineSquares2X2 size={24} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={selectedKeys}
                selectionMode="single"
                variant="flat"
                onSelectionChange={(keys) => setSelectedKeys(keys.currentKey!)}>
                {categories.map((category) => (
                  <DropdownItem key={toSlug(category)}>{category}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </span>
        </div>
        <div className="grid grid-cols-2 @md:gap-6 @md:mx-4 @2xl:gap-x-5 gap-3 @lg:gap-y-7 @xl:grid-cols-3 @4xl:grid-cols-4 @5xl:grid-cols-5">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
    </section>
  );
}
