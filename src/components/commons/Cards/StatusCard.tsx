import cn from "@/libs/utils/cn";
import { Card, CircularProgress } from "@heroui/react";
import { IconType } from "react-icons";
import { FaBook } from "react-icons/fa";

type TProps = {
  Icon: IconType;
  title: string;
  bg: string;
  complete: number;
  total: number;
  strokeColor: string;
  bgIcon: string;
};

export default function StatusCard({
  Icon,
  title,
  bg,
  complete,
  total,
  strokeColor,
  bgIcon,
}: TProps) {
  return (
    <Card
      className={cn([
        bg,
        "flex p-3 lg:w-[32%] w-full justify-center flex-row",
      ])}>
      <span className="p-1 pl-3 text-white">
        <div className={cn([bgIcon, ` w-fit p-3 text-white rounded-full`])}>
          <Icon size={24} />
        </div>
        <h4 className="font-bold text-2xl mt-1.5">{complete}</h4>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm italic">dari {total} selesai</p>
      </span>
      <CircularProgress
        className="ml-auto mr-2"
        classNames={{
          svg: "w-32 h-32 drop-shadow-md",
          indicator: cn([strokeColor]),
          track: "stroke-white/50",
          value: "text-xl font-semibold text-white",
        }}
        showValueLabel={true}
        strokeWidth={4}
        value={(complete / total) * 100}
      />
    </Card>
  );
}
