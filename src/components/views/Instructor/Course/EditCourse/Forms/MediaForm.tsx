import TextField from "@/components/commons/TextField";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import { getYouTubeEmbedUrl } from "@/libs/utils/string";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FiVideoOff } from "react-icons/fi";
import { LuImage, LuUndo2, LuUpload } from "react-icons/lu";
import { EditCourseForm } from "./form.type";

const MediaForm = ({ publishedValues }: { publishedValues?: { coverImage: string; previewVideo: string | null } }) => {
  const {
    getValues,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useFormContext<EditCourseForm>();
  const { showPublished } = useEditCourseContext();
  const fileList = watch("fileImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;
  const urlPreview = watch("previewVideo");
  const validUrlPreview =
    showPublished && publishedValues?.previewVideo
      ? getYouTubeEmbedUrl(publishedValues.previewVideo)
      : urlPreview
        ? getYouTubeEmbedUrl(urlPreview)
        : null;
  const [currPreview] = useState(getValues("previewVideo"));
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <span className="space-y-6">
          {showPublished ? (
            <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
              <Image
                src={publishedValues?.coverImage || "/images/thumbnail-placeholder.svg"}
                alt="course image"
                fill
                objectFit="cover"
              />
            </div>
          ) : preview ? (
            <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
              <Image src={preview} alt="course image" fill objectFit="cover" />
            </div>
          ) : (
            getValues("coverImage") && (
              <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
                <Image src={getValues("coverImage")} alt="course image" fill className="object-cover" />
              </div>
            )
          )}
          {!showPublished && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 flex items-center gap-4">
              <div className="w-28 aspect-video rounded-lg overflow-hidden bg-slate-100 grid place-items-center">
                {preview ? (
                  <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
                    <Image src={preview} alt="course image" fill className="object-cover" />
                  </div>
                ) : (
                  <LuImage className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="space-y-2">
                <span className="flex gap-x-5">
                  <label className="inline-flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <LuUpload className="w-4 h-4" />
                    <span>Upload</span>
                    <Controller
                      control={control}
                      name="fileImage"
                      rules={{
                        validate: {
                          lessThan3MB: value => {
                            if (value && value.length > 0)
                              return value[0].size < 3 * 1024 * 1024 || "File must be smaller than 3MB";
                          },
                        },
                      }}
                      render={({ field: { onChange } }) => (
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => onChange(e.target.files)}
                        />
                      )}
                    />
                  </label>
                  {preview && (
                    <Button
                      type="reset"
                      onPress={e => {
                        setValue("fileImage", null);
                      }}
                      variant="flat"
                      color="danger"
                      className="text-red-600 bouncy-button cursor-pointer">
                      <LuUndo2 /> Cancel
                    </Button>
                  )}
                </span>
                <p className="text-xs text-slate-500">JPG/PNG, 1280×720 recommended</p>
              </div>
            </div>
          )}
          {!showPublished && errors.fileImage ? (
            <p className="mt-0.5 text-xs text-rose-600">{errors.fileImage.message}</p>
          ) : null}
        </span>
        <span className="space-y-6">
          <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
            {validUrlPreview ? (
              <iframe
                // allowFullScreen
                width={"100%"}
                height={"100%"}
                src={validUrlPreview}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            ) : (
              <span className="w-full h-full grid place-items-center text-slate-400 border rounded-xl border-dashed">
                <span className="flex flex-col items-center gap-y-2">
                  <FiVideoOff size={48} />
                  <p>Invalid url preview</p>
                </span>
              </span>
            )}
          </div>
          {!showPublished && (
            <Controller
              control={control}
              name="previewVideo"
              render={({ field, fieldState: { isDirty } }) => {
                return (
                  <span>
                    <span className="flex gap-x-2 items-end">
                      <TextField
                        classNames={{ wrapper: "flex-1" }}
                        id="previewVideo"
                        placeholder="https://..."
                        label="Preview Video (URL)"
                        field={field}
                      />
                      {isDirty && (
                        <Button
                          type="reset"
                          onPress={e => {
                            setValue("previewVideo", currPreview);
                          }}
                          variant="flat"
                          color="danger"
                          size="sm"
                          className="text-red-600 bouncy-button cursor-pointer mb-0.5 min-w-fit">
                          <LuUndo2 />
                        </Button>
                      )}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Use youtube url e.g https://youtu.be/dQw4w9WgXcQ</p>
                  </span>
                );
              }}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default MediaForm;
