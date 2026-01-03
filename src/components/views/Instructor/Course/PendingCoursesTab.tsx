"use client";
import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import Toolbar from "@/components/commons/Toolbar";
import { useNProgress } from "@/hooks/use-nProgress";
import { hasTrue } from "@/libs/utils/boolean";
import { aVoidFn, voidFn } from "@/libs/utils/function";
import { Input, Textarea } from "@heroui/react";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { CourseCardGrid, CourseCardGridSkeleton, CourseCardList, CourseCardListSkeleton } from "./CourseCard";
import EmptyCourses from "./EmptyCourse";
import useCourse from "./useCourse";

type NotesForm = { notes: string; title: string };

type Props = {
  onCreate: VoidFn;
};
export default function PendingCoursesTab({ onCreate }: Props) {
  const [layout, setLayout] = useState<Layout>("grid");
  const notesMethods = useForm<NotesForm>();
  const { publishCourse, isLoading, courses } = useCourse();

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
        layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CourseCardGridSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCardListSkeleton key={i} />
            ))}
          </div>
        )
      ) : courses?.length === 0 ? (
        <EmptyCourses onCreate={onCreate} />
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 @7xl:grid-cols-4 @4xl:grid-cols-3 gap-4">
          {courses?.map(c => (
            <CourseCardGrid
              key={c.id}
              data={c}
              onPublish={onPublish}
              onUnpublish={voidFn}
              onDelete={aVoidFn}
              isLoading={false}
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
