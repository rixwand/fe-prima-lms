import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { Avatar, Card, Chip, Skeleton } from "@heroui/react";
import Image from "next/image";
import { LuSquareArrowOutUpRight, LuStar, LuUsers } from "react-icons/lu";

type Props = {
  course: Pick<PublicCourseListItem, "owner" | "discounts"> & {
    metaApproved: Pick<MetaCourse, "coverImage" | "priceAmount" | "title">;
  };
};
const UserCourseCard = ({ course: { metaApproved }, course }: Props) => {
  return (
    <Card className="rounded-xl overflow-hidden justify-between" isPressable>
      <div>
        <div className="relative w-full h-fit bg-red-50 aspect-video">
          <Image fill className="object-cover rounded-t-md" src={metaApproved!.coverImage} alt="Course Image" />
          {/* <Chip className="absolute"></Chip> */}
        </div>
        <h3 className="px-4 mt-4 mb-2.5 font-semibold flex-1 leading-snug text-start min-w-0 line-clamp-2">
          {metaApproved!.title}
        </h3>
      </div>

      <div className="px-4 pb-4 space-y-2.5">
        <div className="flex gap-x-3 mt-1">
          <div className="items-start w-full flex">
            <Chip
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="-ml-1 group/chip"
              avatar={<Avatar name="JW" src={course.owner.profilePict} />}
              variant="light"
              endContent={
                <LuSquareArrowOutUpRight
                  className="ml-0.5 group-hover/chip:text-blue-500 group-hover/chip:border-b group-hover/chip:border-blue-500"
                  size={12}
                />
              }>
              <span className="group-hover/chip:underline ml-0.5 text-slate-600 group-hover/chip:text-blue-500">
                {course.owner.fullName}
              </span>
            </Chip>
          </div>
        </div>
        {/* <div className="lg:flex hidden gap-3 justify-center items-center flex-row">
            <Rating size={24} iconsCount={5} allowFraction readonly initialValue={4.5} />
            <p className="text-lg font-bold mt-1">4.5</p>
          </div>
          <div className="flex lg:hidden items-center -ml-0.5 justify-start flex-row">
            <Rating size={18} iconsCount={5} allowFraction readonly initialValue={4.5} />
            <p className="text-sm font-semibold ml-2 mt-1.5">4.5</p>
          </div> */}

        <div className="flex items-center gap-5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <LuUsers className="w-4 h-4" />
            1.000
          </span>
          <span className="inline-flex items-center gap-1">
            <LuStar className="w-4 h-4" />
            {/* {data.rating || "--"} */}
            4.5
          </span>
        </div>
        <div className="flex items-center gap-4 text-large text-slate-800 font-semibold">
          <span
            className={cn(
              course.discounts &&
                course.discounts.length > 0 &&
                course.discounts[0].isActive &&
                "line-through text-gray-400 font-medium",
              "inline-flex items-center gap-1",
            )}>
            {metaApproved!.priceAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </span>
          {course.discounts && course.discounts.length > 0 && course.discounts[0].isActive && (
            <span className="inline-flex items-center gap-1">
              {finalPrice(
                metaApproved!.priceAmount,
                course.discounts[0].value,
                course.discounts[0].type,
              ).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserCourseCard;

export function UserCourseCardSkeleton() {
  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Skeleton className="h-5 w-full rounded-xl" />
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-3/5 rounded-xl" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-14 rounded-xl" />
          <Skeleton className="h-5 w-14 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function UserCoursesCardLoading({ items }: { items: number }) {
  return (
    <div className="grid grid-cols-1 @lg:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-5 @xl:gap-8 @xl:mx-4">
      {Array.from({ length: items }).map((_, i) => (
        <UserCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
