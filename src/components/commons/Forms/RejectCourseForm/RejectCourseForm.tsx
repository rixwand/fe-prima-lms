import { Input, Textarea } from "@heroui/react";
import { UseFormReturn } from "react-hook-form";

export type NotesForm = { notes: string };
const RejectCourseForm = ({
  methods: { register },
  courseTitle,
  description,
}: {
  methods: UseFormReturn<NotesForm>;
  courseTitle: string;
  description?: string;
}) => {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 text-sm -mt-5 mb-10">
        {description ||
          `This action cannot be undone. The course will remain unpublished, and the instructor will need to submit a new
        publish request if they wish to proceed in the future.`}
      </p>
      <Input type="text" disabled labelPlacement="outside" value={courseTitle} label="Course" />
      <Textarea label="Notes" labelPlacement="outside" isClearable placeholder="(optional)" {...register("notes")} />
    </div>
  );
};

export default RejectCourseForm;
