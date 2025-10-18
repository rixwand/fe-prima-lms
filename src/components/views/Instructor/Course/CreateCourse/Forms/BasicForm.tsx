import TextField from "@/components/commons/TextField";
import { Chip } from "@heroui/react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { LuImage, LuUpload } from "react-icons/lu";
import Field from "./Field";

export default function BasicsForm() {
  const [tagInput, setTagInput] = useState("");

  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CourseForm>();
  // const {fields} = useFieldArray({control, name: 'courseInfo.tags', keyName: ""})

  // const onThumbPick = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const f = e.target.files?.[0];
  //   if (!f) return;
  //   const url = URL.createObjectURL(f);
  //   set("thumbnail", url);
  // };

  register("tags", { minLength: { value: 1, message: "Add at least 1 tag" }, required: "Add at least 1 tag" });
  const tags = watch("tags");
  const fileList = watch("coverImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) return setTagInput("");
    setValue("tags", [...tags, tagInput]);
    setTagInput("");
  };

  return (
    <div className="space-y-6">
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
                rows={6}
                placeholder="Describe what students will learn, requirements, and outcomes."
                className="w-full resize-y p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </Field>
          );
        }}
      />
      <Controller
        control={control}
        name="previewVideo"
        render={({ field }) => (
          <TextField
            field={field}
            label="Preview vide (url)"
            id="previewVideo"
            placeholder="e.g., https://youtu.be/dQw4w9WgXcQ"
          />
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Thumbnail" required>
          <div className="rounded-xl border border-dashed border-slate-300 p-4 flex items-center gap-4">
            <div className="w-28 aspect-video rounded-lg overflow-hidden bg-slate-100 grid place-items-center">
              {preview ? (
                <img src={preview} alt="thumb" className="w-full h-full object-cover" />
              ) : (
                <LuImage className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <LuUpload className="w-4 h-4" />
                <span>Upload</span>
                <Controller
                  control={control}
                  name="coverImage"
                  rules={{ required: "Choose course cover image" }}
                  render={({ field: { onChange } }) => (
                    <input type="file" accept="image/*" className="hidden" onChange={e => onChange(e.target.files)} />
                  )}
                />
              </label>
              <p className="text-xs text-slate-500">JPG/PNG, 1280×720 recommended</p>
            </div>
          </div>
          {errors.coverImage ? <p className="mt-0.5 text-xs text-rose-600">{errors.coverImage.message}</p> : null}
        </Field>
        <div className="flex flex-col gap-3">
          <TextField
            error={errors.tags?.message}
            classNames={{ wrapper: "flex flex-col" }}
            id="tags"
            label="Tags"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="add tag and press enter"
          />
          <span className="flex flex-wrap gap-3">
            {tags.map(t => (
              <Chip
                className="mb-1"
                variant="bordered"
                color="primary"
                key={t}
                endContent={<IoClose />}
                onClose={() =>
                  setValue(
                    "tags",
                    tags.filter(tag => tag != t)
                  )
                }>
                {t}
              </Chip>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
