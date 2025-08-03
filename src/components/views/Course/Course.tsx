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
      <div className="hidden lg:flex space-y-3 flex-col pl-24 pr-6 pt-12 bg-[#1E40AF]">
        <h2 className="text-3xl font-bold text-white">Kursus</h2>
        <Divider className="border-2 bg-white w-52" />
        <Link className="text-lg text-white font-bold" href={"#"}>
          Semua Kursus (25)
        </Link>
        {categories.map((category, i) => (
          <Link className="text-lg text-white" href={"#"} key={i}>
            {category}
          </Link>
        ))}
      </div>
      <div className="bg-white px-3 lg:w-full lg:pr-12 lg:pl-14 mt-8 mb-24">
        <div className="flex items-center px-2 w-full justify-between mb-5">
          <h2 className="font-semibold text-2xl">{selectedValue}</h2>
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
        <div className="flex flex-wrap flex-row gap-x-2 md:gap-x-6 gap-y-8 justify-around lg:justify-start">
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
