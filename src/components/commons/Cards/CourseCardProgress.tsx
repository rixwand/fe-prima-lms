import { Card, CardBody, CardFooter, Progress, Skeleton } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CourseCardProgress({ meta: { title, coverImage }, slug }: { meta: MetaCourse; slug: string }) {
  const router = useRouter();
  return (
    <Card
      onPress={() => router.push(`/learn/${slug}`)}
      className="text-sm 2xl:text-base shadow-none border border-gray-300"
      radius="lg"
      isPressable>
      <CardBody className="px-3 pt-3 pb-0">
        <div className="relative aspect-video rounded-lg shadow-sm overflow-hidden">
          <Image src={coverImage} fill alt={title + " cover"} objectFit="cover" />
        </div>
      </CardBody>
      <CardFooter className="flex-col px-4 pb-4 space-y-2 text-gray-500">
        <p className="font-semibold text-start w-full line-clamp-2">{title}</p>
        <span className="flex justify-between mt-2 w-full">
          <p>Progress</p>
          <p>30%</p>
        </span>
        <Progress aria-label="Progress" size="sm" value={30} />
      </CardFooter>
    </Card>
  );
}

export const LearningCardSkeleton = () => {
  return (
    <Card className="p-3 text-sm 2xl:text-base shadow-none border border-gray-300" radius="md">
      {/* Thumbnail */}
      <CardBody className="rounded-lg relative aspect-video p-0">
        <Skeleton className="w-full h-full rounded-lg" />
      </CardBody>

      {/* Footer */}
      <CardFooter className="flex-col space-y-2 text-gray-500">
        {/* Title (2 lines) */}
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>

        {/* Progress label row */}
        <div className="flex justify-between mt-2 w-full">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>

        {/* Progress bar */}
        <Skeleton className="h-2 w-full rounded-full" />
      </CardFooter>
    </Card>
  );
};
