import CourseInfo from "@/components/commons/CourseInfo";
import PageHead from "@/components/commons/PageHead";
import {
  Button,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { LuArrowLeft, LuEllipsisVertical } from "react-icons/lu";

export default function AdminCourseInfo({ course }: { course: Course }) {
  const router = useRouter();
  return (
    <Fragment>
      <PageHead title={course.metaDraft.title} />
      <Navbar isBordered maxWidth="full" className="md:px-2">
        <NavbarContent className="max-w-[calc(50%-64px)]">
          <NavbarItem className="w-[85%]">
            <Link
              href="/admin/dashboard/course"
              className="flex items-center w-full gap-x-3 overflow-hidden text-slate-700">
              <LuArrowLeft size={20} />
              <p className="font-semibold hidden md:block text-slate-700 truncate flex-1">Course Preview</p>
            </Link>
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
                {/* <AdminListBoxAction
                reqId={}
                courseTitle={course.title} courseStatus={course.status} courseId={course.id} /> */}
                <></>
              </PopoverContent>
            </Popover>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CourseInfo
        data={course}
        onOpenCurriculum={() => {
          router.push(`/admin/dashboard/course/${course.id}/curriculum`);
        }}
      />
    </Fragment>
  );
}
