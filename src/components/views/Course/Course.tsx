import UserCourseCard, { UserCoursesCardLoading } from "@/components/commons/Cards/UserCourseCard";
import useCourseCategories from "@/hooks/course/useCourseCategories";
import usePublicCourse from "@/hooks/course/usePublicCourse";
import useDump from "@/hooks/use-dump";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import {
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
type Props = {
  category?: string;
};
export default function Course({ category: queryCategory }: Props) {
  const router = useRouter();
  useDump(router.query, "query");
  const { courses, loadings } = usePublicCourse();
  useDump(courses, "courses");
  const { categories, loadings: categoryLoadings } = useCourseCategories();
  const activeCategories = useMemo(() => {
    if (queryCategory && categories && categories?.length > 0)
      return categories[categories.findIndex(v => v.slug == queryCategory)].name;
    else return "Semua Kursus";
  }, [queryCategory, categories]);
  return (
    <section className={cn([inter.className, "flex"])}>
      <aside className="hidden 2xl:text-lg lg:block min-w-fit w-2/12 justify-end shrink-0 bg-[#1E40AF] pl-6 pr-7 pt-12">
        <div className="space-y-3 sticky top-20 ml-7 2xl:ml-auto mr-2 flex-col flex w-3/4 max-w-52 min-w-40">
          <h2 className="text-2xl font-bold text-white">Kursus</h2>
          <Divider className="border-2 bg-white w-full" />
          {categoryLoadings.isQueryLoading || categoryLoadings.isQueryPending ? (
            <div className="space-y-6 mt-2">
              {[60, 80, 50, 80, 80, 60, 80].map((v, i) => (
                <Skeleton className={cn("h-4 rounded-full ")} style={{ width: v + "%" }} key={i} />
              ))}
            </div>
          ) : !categories || categories.length == 0 ? (
            <p>categories not found</p>
          ) : (
            <Fragment>
              <Link className={cn([!queryCategory && "font-bold", "text-white"])} href={"/course"} key={"all"}>
                Semua Kursus
              </Link>
              {categories.map((category, i) => (
                <Link
                  className={cn([queryCategory == category.slug && "font-bold", "text-white"])}
                  href={"/course/" + category.slug}
                  key={category.slug}>
                  {category.name}
                </Link>
              ))}
            </Fragment>
          )}
        </div>
      </aside>
      <div className="bg-white px-3 w-full 2xl:px-8 mt-8 mb-24 lg:mx-0 md:mx-8 @container">
        <div className="flex items-center w-full gap-1 mb-5 @xl:mx-4 @lg:mx-0 mx-3">
          <span className="lg:hidden flex">
            <Popover>
              <PopoverTrigger>
                <Button className="reset-button p-1.5 rounded-xl" isIconOnly variant="light" radius="none">
                  <HiOutlineSquares2X2 size={22} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Listbox>
                  {!categories || categories.length == 0 ? (
                    <ListboxItem>categories not found</ListboxItem>
                  ) : (
                    categories.map(category => (
                      <ListboxItem href={"/course/" + category.slug} key={category.slug}>
                        {category.name}
                      </ListboxItem>
                    ))
                  )}
                </Listbox>
              </PopoverContent>
            </Popover>
          </span>
          <h2 className="font-semibold text-xl">{activeCategories}</h2>
          <div className="flex ml-auto"></div>
        </div>
        {loadings.isQueryLoading ? (
          <UserCoursesCardLoading items={4} />
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 @lg:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-5 @2xl:gap-8 @xl:mx-4 @lg:mx-0 mx-4 @lg:my-0 my-2">
            {courses.map(({ metaApproved, ...course }) => (
              <UserCourseCard course={{ metaApproved: metaApproved!, ...course }} key={course.id} />
            ))}
          </div>
        ) : (
          <p>Course not found</p>
        )}
      </div>
    </section>
  );
}
