import TextField from "@/components/commons/TextField";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { hasDirty } from "@/libs/utils/rhf";
import { Button } from "@heroui/react";
import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LuUndo2 } from "react-icons/lu";
import Field from "../../CreateCourse/Forms/Field";
import { EditCourseForm } from "./form.type";

export default function BasicsForm({
  defaultValues: { descriptionJson, shortDescription, title },
  publishedValues,
}: {
  defaultValues: { title: string; shortDescription: string; descriptionJson: string | null };
  publishedValues?: { title: string; shortDescription: string; descriptionJson: string | null };
}) {
  const {
    control,
    formState: { dirtyFields },
    setValue,
  } = useFormContext<EditCourseForm>();

  const { showPublished } = useEditCourseContext();

  const reset = () => {
    setValue("title", title, { shouldDirty: true });
    setValue("shortDescription", shortDescription, { shouldDirty: true });
    setValue("descriptionJson", descriptionJson || undefined, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      {showPublished ? (
        <Fragment>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField value={publishedValues?.title} id="title" required label="Title" disabled />
            <TextField
              value={publishedValues?.shortDescription}
              id="shortDescription"
              required
              label="Subtitle"
              disabled
            />
          </div>
          <Field label="Description">
            <textarea
              value={publishedValues?.descriptionJson || undefined}
              rows={15}
              name="courseInfo.description"
              placeholder="Describe what students will learn, requirements, and outcomes."
              className="w-full resize-y p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 disabled:bg-slate-50/50"
              disabled
            />
          </Field>
        </Fragment>
      ) : (
        <Fragment>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              control={control}
              name="title"
              rules={{ required: "Please input course title" }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    field={field}
                    error={error?.message}
                    id="title"
                    required
                    label="Title"
                    placeholder="e.g., Build a Full-Stack LMS with Next.js"
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="shortDescription"
              rules={{ required: "Please input subtitle", minLength: { value: 20, message: "at least 20 character" } }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    field={field}
                    error={error?.message}
                    id="shortDescription"
                    required
                    label="Subtitle"
                    placeholder="A concise one-liner that sells the value"
                  />
                );
              }}
            />
          </div>

          <Controller
            control={control}
            name="descriptionJson"
            render={({ field }) => {
              return (
                <Field label="Description">
                  <textarea
                    {...field}
                    name="courseInfo.description"
                    rows={15}
                    placeholder="Describe what students will learn, requirements, and outcomes."
                    className="w-full resize-y p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700"
                  />
                </Field>
              );
            }}
          />
        </Fragment>
      )}
      {!showPublished &&
        (["descriptionJson", "shortDescription", "title"] as const).some(key => hasDirty(dirtyFields?.[key])) && (
          <Button color="danger" onPress={reset} className="h-9" variant="flat" radius="sm">
            <LuUndo2 /> Reset
          </Button>
        )}
    </div>
  );
}
