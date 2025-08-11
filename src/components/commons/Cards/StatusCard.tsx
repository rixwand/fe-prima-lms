import cn from "@/libs/utils/cn";
import { Card, CircularProgress } from "@heroui/react";
import { IconType } from "react-icons";

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
        "flex p-3 lg:w-[32%] w-full justify-center flex-row @container",
      ])}>
      <span className="p-1.5 @3xs:pl-3 text-white">
        <div
          className={cn([
            bgIcon,
            `xl:text-2xl text-xl w-fit p-3 text-white rounded-full`,
          ])}>
          <Icon />
        </div>
        <h4 className="font-bold text-xl xl:text-2xl mt-1.5">{complete}</h4>
        <p className="xl:text-lg font-semibold">{title}</p>
        <p className="xl:text-sm text-xs italic">dari {total} selesai</p>
      </span>
      <CircularProgress
        className="ml-auto @3xs:mr-2"
        classNames={{
          svg: "xl:w-32 xl:h-32 w-28 h-28 drop-shadow-md",
          indicator: cn([strokeColor]),
          track: "stroke-white/50",
          value: "xl:text-xl text-lg font-semibold text-white",
        }}
        showValueLabel={true}
        strokeWidth={4}
        value={(complete / total) * 100}
      />
    </Card>
  );
}
