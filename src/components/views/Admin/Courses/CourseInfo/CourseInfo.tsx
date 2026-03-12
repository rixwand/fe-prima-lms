import PageHead from "@/components/commons/PageHead";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import courseQueries from "@/queries/course-queries";
import { Button, Navbar, NavbarContent, NavbarItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { LuChevronLeft, LuEllipsisVertical } from "react-icons/lu";
import AdminListBoxAction from "../AdminListBoxActions";
import CoursePreview from "./CoursePreview";

export default function AdminCourseInfo({ course }: { course: Course }) {
  const router = useRouter();
  const qc = useQueryClient();
  const prefetch = () => qc.prefetchQuery(courseQueries.options.listSections(course.id));
  return (
    <Fragment>
      <PageHead title={course.metaDraft?.title ?? course.metaApproved.title} />
      <Navbar isBordered maxWidth="full" className={cn("md:px-2", inter.className)}>
        <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-[85%]">
            <Button
              isIconOnly
              onPress={() => router.push(`/admin/dashboard/course`)}
              disableRipple
              variant="light"
              className="reset-button flex data-[hover=true]:bg-transparent items-center w-full overflow-hidden text-slate-700">
              <LuChevronLeft size={20} />
              <p className="ml-1 font-semibold hidden md:block text-slate-700 truncate flex-1">Course Preview</p>
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" className="max-w-1/2">
          <NavbarItem>
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  variant="light"
                  isIconOnly
                  className="reset-button py-1 px-0.5 rounded-lg hover:bg-slate-100 text-slate-700">
                  <LuEllipsisVertical size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-44">
                {course && course.publishRequest && (
                  <AdminListBoxAction
                    {...{
                      courseTitle: course.metaDraft?.title ?? course.metaApproved.title,
                      reqId: course.publishRequest.id,
                      reqStatus: course.publishRequest.status,
                      notes: course.publishRequest.notes,
                    }}
                  />
                )}
              </PopoverContent>
            </Popover>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CoursePreview
        prefetch={prefetch}
        data={course}
        onOpenCurriculum={() => {
          router.push(`/admin/dashboard/course/${course.id}/curriculum`);
        }}
      />
    </Fragment>
  );
}
