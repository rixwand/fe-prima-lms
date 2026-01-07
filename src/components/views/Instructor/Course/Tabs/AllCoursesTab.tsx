"use client";
import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import Toolbar from "@/components/commons/Toolbar";
import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import { aVoidFn } from "@/libs/utils/function";
import { Input, Textarea } from "@heroui/react";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import useListCourse from "../../../../../hooks/course/useListCourses";
// import { CourseCardGrid, CourseCardGridSkeleton, CourseCardList, CourseCardListSkeleton } from "../CourseCard";
import { CourseCardGrid } from "@/components/commons/Cards/CourseCards";
import CoursesCardLoading from "@/components/commons/Cards/CoursesCardLoading";
import { useRouter } from "next/router";
import { CourseCardList } from "../CourseCard";
import EmptyCourses from "../EmptyCourse";

type NotesForm = { notes: string; title: string };

type Props = {
  onCreate: VoidFn;
};
export default function AllCoursesTab({ onCreate }: Props) {
  const [layout, setLayout] = useState<Layout>("grid");
  const notesMethods = useForm<NotesForm>();
  const { publishCourse, isLoading, courses } = useListCourse();
  const router = useRouter();
  const PublishCourseForm = ({ methods: { register, getValues } }: { methods: UseFormReturn<NotesForm> }) => {
    const [n, sN] = useState("");
    return (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm -mt-5 mb-10">Your request will be reviewen by admin</p>
        <Input type="text" disabled labelPlacement="outside" value={getValues("title")} label="Course" />
        <Textarea label="Notes" labelPlacement="outside" isClearable placeholder="(optional)" {...register("notes")} />
      </div>
    );
  };

  const onPublish = ({ id, title }: { id: number; title: string }) => {
    notesMethods.setValue("title", title);
    FormWrapperDialog({
      title: "Publish Course Request",
      content: <PublishCourseForm methods={notesMethods} />,
      onSubmit: async () => publishCourse({ notes: notesMethods.getValues("notes"), id }),
    });
  };

  useNProgress(hasTrue(isLoading));

  return (
    <div className="border-t border-slate-200 pt-5">
      <Toolbar handleSearch={() => {}} setLayout={setLayout} />
      {isLoading.queryLoading ? (
        <CoursesCardLoading layout={layout} />
      ) : courses?.length === 0 ? (
        <EmptyCourses onCreate={onCreate} />
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
          {courses?.map(c => (
            <CourseCardGrid
              key={c.id}
              data={{
                ...c,
              }}
              onPress={e => {
                router.push(`/instructor/dashboard/course/${c.id}`);
              }}
              PopoverContentAction={<></>}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {courses?.map(c => (
            <CourseCardList
              key={c.id}
              data={c}
              onPublish={aVoidFn}
              onUnpublish={aVoidFn}
              onDelete={aVoidFn}
              isLoading={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
