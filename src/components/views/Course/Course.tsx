import CourseCard from "@/components/commons/Cards/Coursecard";
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
      <div className="hidden max-w-2/12 min-w-fit w-full pl-6 text-lg xl:flex justify-end pr-7 pt-12 bg-[#1E40AF]">
        <div className="space-y-3 flex-col flex w-3/4 max-w-52 min-w-40">
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
      </div>
      <div className="bg-white px-3 lg:w-full lg:px-8 mt-8 mb-24">
        <div className="flex items-center px-2 w-full justify-between mb-5">
          <h2 className="font-semibold text-2xl">{selectedValue}</h2>
          <span className="xl:hidden flex">
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
        <div className="grid grid-cols-2 md:gap-x-5 gap-3 md:gap-y-7 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
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
