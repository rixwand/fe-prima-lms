import { Badge, Button, Input, Spinner, Textarea } from "@heroui/react";
import Image from "next/image";
import { Fragment } from "react";
import { Control, Controller, UseFormGetValues, useFormContext } from "react-hook-form";
import { LuImagePlus, LuSearch, LuX } from "react-icons/lu";
import { TbMessageCircleFilled } from "react-icons/tb";
import { CreateThreadForm } from "../forum.type";
import useForumThread from "./useForumThread";

export default function () {
  const methods = useFormContext<CreateThreadForm>();
  const {
    control,
    setValue,
    getValues,
    formState: { isValid },
  } = methods;
  const {
    handleSubmitNewThread,
    handleSearchOnKeyDown,
    liveImagesUrl,
    mode,
    setMode,
    inputTitleRef,
    search,
    setSearch,
    isPendingCreateNewThread,
    isUploadImagesPending,
  } = useForumThread({ methods });
  return (
    <div className="flex bg-default-100 items-center rounded-lg p-1.5 border-1 border-gray-200">
      {mode == "search" ? (
        <Fragment>
          <LuSearch size={20} className="ml-1.5" />
          <Input
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleSearchOnKeyDown}
            variant="flat"
            classNames={{
              inputWrapper:
                "!bg-transparent !shadow-none !border-none hover:!bg-transparent group-data-[focus=true]:!bg-transparent h-fit min-h-fit",
            }}
            className="w-full"
            placeholder="Search for thread"
          />
          <Button
            color="primary"
            isIconOnly
            onPress={() => setMode("create")}
            className="ml-auto reset-button px-3 py-2 rounded-xl font-medium"
            radius="none"
            startContent={<TbMessageCircleFilled size={16} className="mr-2" />}>
            New Thread
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <Button
            onPress={() => setMode("search")}
            isIconOnly
            disableRipple
            className="reset-button mb-auto text-default-500 pt-1.5 pl-1.5 data-[hover=true]:text-default-700 data-[hover=true]:bg-transparent"
            variant="light"
            radius="none">
            <LuX size={18} />
          </Button>
          <div className="w-full mb-auto">
            <Controller
              control={control}
              name="title"
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  ref={inputTitleRef}
                  onKeyDown={e => {
                    if (e.key == "Escape") setMode("search");
                  }}
                  variant="flat"
                  classNames={{
                    inputWrapper:
                      "!bg-transparent !shadow-none !border-none hover:!bg-transparent group-data-[focus=true]:!bg-transparent h-fit min-h-fit py-0.5 group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-0",
                    input: "text-base font-semibold",
                  }}
                  className="w-full"
                  placeholder="Thread Title"
                />
              )}
            />
            <Controller
              control={control}
              name="message"
              rules={{
                validate: value => {
                  const images = getValues("images");

                  return !!value?.trim() || (images?.length ?? 0) > 0 || "Provide a message or at least one image";
                },
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  variant="flat"
                  onKeyDown={e => {
                    if (e.key == "Escape") setMode("search");
                  }}
                  classNames={{
                    inputWrapper:
                      "!bg-transparent !shadow-none !border-none hover:!bg-transparent group-data-[focus=true]:!bg-transparent group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-0",
                  }}
                  className="w-full"
                  placeholder="Enter message..."
                />
              )}
            />
          </div>
          <div className="mb-auto p-0.5 space-y-6">
            <div className="relative group overflow-visible">
              {liveImagesUrl && liveImagesUrl[0] && (
                <Badge
                  color="primary"
                  size="md"
                  content={liveImagesUrl.length}
                  className="group-hover:hidden"
                  showOutline={false}>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={URL.createObjectURL(liveImagesUrl[0])}
                      alt={`Image Preview`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </Badge>
              )}
              {liveImagesUrl.length == 0 ? (
                <ImageInput control={control} getValues={getValues} />
              ) : (
                <div className="hidden group-hover:flex absolute gap-2 overflow-visible bg-white border-gray-300 p-3 -right-3 -top-3 -bottom-2 rounded-xl border group">
                  {liveImagesUrl.map((f, i) => (
                    <div key={i} className="relative size-20 shrink-0 group/image">
                      <Button
                        onPress={() =>
                          setValue(
                            "images",
                            liveImagesUrl.filter((f, idx) => i != idx),
                            { shouldValidate: true },
                          )
                        }
                        isIconOnly
                        disableRipple
                        variant="solid"
                        color="danger"
                        radius="full"
                        size="sm"
                        className="reset-button absolute z-50 p-0.5 -top-1 -right-1 hidden group-hover/image:flex">
                        <LuX />
                      </Button>
                      <Image
                        src={URL.createObjectURL(f)}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  <ImageInput control={control} getValues={getValues} />
                </div>
              )}
            </div>
            <Button
              isDisabled={!isValid || isPendingCreateNewThread || isUploadImagesPending}
              onPress={handleSubmitNewThread}
              color="primary"
              variant="solid"
              isIconOnly
              className="ml-auto reset-button px-3 py-1.5 rounded-lg font-medium"
              radius="none"
              startContent={
                isPendingCreateNewThread || isUploadImagesPending ? (
                  <Spinner size="sm" color="white" className="mr-1.5" />
                ) : (
                  <TbMessageCircleFilled size={18} className="mr-1.5" />
                )
              }>
              Post
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
}

const ImageInput = ({
  control,
  getValues,
}: {
  control: Control<CreateThreadForm, any, CreateThreadForm>;
  getValues: UseFormGetValues<CreateThreadForm>;
}) => {
  return (
    <label className="relative flex size-20 cursor-pointer items-center justify-center  bg-default-50 transition-colors border-gray-300 border hover:bg-default rounded-lg">
      {/* <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files} /> */}
      <Controller
        control={control}
        name="images"
        rules={{
          validate: files => {
            const message = getValues("message");

            return !!message?.trim() || (files?.length ?? 0) > 0 || "Provide a message or at least one image";
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            accept="image/*"
            className="hidden"
            type="file"
            multiple
            onChange={e => {
              const newFiles = Array.from(e.target.files ?? []);
              onChange([...(value ?? []), ...newFiles]);
              e.target.value = "";
            }}
          />
        )}
      />
      <LuImagePlus size={24} />
    </label>
  );
};
