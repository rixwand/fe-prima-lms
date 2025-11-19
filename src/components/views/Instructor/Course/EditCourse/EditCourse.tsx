import { confirmDialog } from "@/components/commons/Dialong/confirmDialog";
import { SUPABASE_BUCKET, SUPABASE_URL } from "@/config/env";
import { EditCourseContext } from "@/libs/context/EditCourseContext";
import NProgress from "@/libs/loader/nprogress-setup";
import { storageClient } from "@/libs/supabase/client";
import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { getDirtyData } from "@/libs/utils/rhf";
import { toSlug } from "@/libs/utils/string";
import courseService from "@/services/course.service";
import { Button, Select, SelectItem, Tab, Tabs, addToast } from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Key, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuChevronDown, LuEye, LuImage, LuSave, LuStar, LuUsers, LuX } from "react-icons/lu";
import { PiMoneyWavyLight } from "react-icons/pi";
import dummy from "../../../../../../dummy-course.json";
import BasicsForm from "./Forms/BasicForm";
import CurriculumForm from "./Forms/CurriculumForm";
import MediaForm from "./Forms/MediaForm";
import PricingPanel from "./Forms/PricingPanel";
import TagsForm from "./Forms/TagsForm";

export default function EditCourse({
  data: { previewVideo, ownerId, slug, tags, descriptionJson, id, sections, discount: discounts, ...course },
  refetch,
  data,
}: {
  data: Course;
  refetch: () => Promise<QueryObserverResult>;
}) {
  const defaultValues = {
    ...course,
    ...(discounts[0]
      ? {
          discount: {
            ...discounts[0],
            startAt: discounts[0].startAt
              ? (parseAbsoluteToLocal(discounts[0].startAt) as unknown as CalendarDate)
              : null,
            endAt: discounts[0].endAt ? (parseAbsoluteToLocal(discounts[0].endAt) as unknown as CalendarDate) : null,
          },
        }
      : {}),
    descriptionJson: descriptionJson || undefined,
    previewVideo: previewVideo || undefined,
    fileList: undefined,
    removeDiscount: undefined,
    addDiscount: undefined,
  };

  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("basic");
  const showPreviewState = useState(true);
  const pendingKeyRef = useRef<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: courseService.update,
    onError: e => {
      console.log(e);
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      await refetch();
    },
  });

  const { mutate: mutateTags, isPending: isPendingTags } = useMutation({
    mutationFn: courseService.updateTags,
    onError: e => {
      addToast({ title: "Erorr", description: e.message, color: "danger" });
    },
    onSuccess: async () => {
      addToast({ title: "Success", description: "Success save changes", color: "success" });
      await refetch();
    },
  });

  useEffect(() => {
    if (isPending || loading || isPendingTags) NProgress.start();
    else NProgress.done();
  }, [isPending, loading, isPendingTags]);

  const methods = useForm<EditCourseForm>({
    defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [data, methods]);

  const fileList = methods.watch("fileImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;

  const [title, subtitle, status, price, discount, discountType, discountActive] = methods.watch([
    "title",
    "shortDescription",
    "status",
    "priceAmount",
    "discount.value",
    "discount.type",
    "discount.isActive",
  ]);

  const saveChanges = async () => {
    const dirty = methods.formState.dirtyFields;
    if (Object.keys(dirty).length == 0) return;
    try {
      const values = methods.getValues();
      const dirtyData = getDirtyData(dirty, values);
      if (dirtyData.tags) {
        return mutateTags({ id, tags: dirtyData.tags });
      }
      if (dirtyData.fileImage) {
        setLoading(true);
        const fileImage = dirtyData.fileImage[0];
        const ext = fileImage.name.split(".").pop();
        const path = `courses/${toSlug(dirtyData.title || course.title)}.${ext}`;
        const { error, data } = await storageClient.from(SUPABASE_BUCKET).upload(path, fileImage, { upsert: true });
        if (error) {
          addToast({ color: "danger", title: "Error uploading image", description: error.message });
          setLoading(false);
          console.log(error);
          return;
        }
        const urlImg = SUPABASE_URL + "/object/public/" + data.fullPath;
        dirtyData.coverImage = urlImg;
        setLoading(false);
      }
      if (dirtyData.discount && values.discount) {
        if (!values.discount.id) dirtyData.discounts = [values.discount];
        else dirtyData.discounts = [{ ...dirtyData.discount, id: values.discount.id }];
      }
      return mutate({ id, data: dirtyData });
    } catch (error) {
      setLoading(false);
      const err = error as Error;
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  };

  const actuallySwitch = (key: Key) => {
    setSelectedKey(key as string);
    pendingKeyRef.current = null;
  };

  const handleSelectionChange = (nextKey: Key) => {
    console.log(methods.formState.dirtyFields);
    if (!Object.hasOwn(methods.formState.dirtyFields, "tags")) {
      actuallySwitch(nextKey);
      return;
    }
    pendingKeyRef.current = nextKey as string;
    confirmDialog({
      title: "Discard changes?",
      desc: "Unsaved changes will be lost if you leave this tab.",
      onConfirmed: () => {
        methods.setValue("tags", undefined, { shouldDirty: true }); // reset RHF form
        if (pendingKeyRef.current != null) {
          actuallySwitch(pendingKeyRef.current);
        }
      },
      onCancel: () => {
        pendingKeyRef.current = null;
      },
    });
  };

  useEffect(() => {
    console.log(showPreviewState[0], selectedKey);
  }, [showPreviewState, selectedKey]);

  return (
    <EditCourseContext.Provider value={{ showCoursePreviewState: showPreviewState }}>
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 @container">
        <div
          className={cn(
            showPreviewState[0] || selectedKey != "curriculum" ? "lg:col-span-8" : "lg:col-span-12",
            "space-y-4 relative"
          )}>
          <FormProvider {...methods}>
            <Select
              defaultSelectedKeys={[selectedKey]}
              onChange={e => setSelectedKey(e.target.value)}
              className="max-w-full @xl:hidden"
              radius="sm"
              classNames={{
                base: "p-1 border-slate-300 border rounded-xl",
                trigger:
                  "bg-blue-700 text-white group-data-[focus=true]:bg-blue-600 data-[hover=true]:bg-blue-600 min-h-[2.125rem] h-[2.125rem]",
                innerWrapper: "px-2",
                value: "group-data-[has-value=true]:text-white font-semibold",
              }}
              selectorIcon={<LuChevronDown />}>
              <SelectItem key={"basic"}>Basic</SelectItem>
              <SelectItem key={"tags"}>Tags</SelectItem>
              <SelectItem key={"media"}>Media</SelectItem>
              <SelectItem key={"pricing"}>Pricing</SelectItem>
              <SelectItem key={"curriculum"}>Curriculum</SelectItem>
            </Select>
            <Tabs
              selectedKey={selectedKey}
              onSelectionChange={handleSelectionChange}
              aria-label="Tabs edit course"
              color="primary"
              radius="lg"
              classNames={{
                tab: "w-28 px-4 font-semibold h-[34px] @xl:flex hidden",
                cursor: "bg-blue-700",
                tabList: "shadow-none border-slate-300 border @xl:flex hidden",
                tabContent: "text-slate-700",
                base: "@xl:flex hidden",
              }}
              variant="bordered">
              <Tab key="basic" title="Basic">
                <BasicsForm
                  defaultValues={{ descriptionJson, shortDescription: course.shortDescription, title: course.title }}
                />
              </Tab>
              <Tab key="tags" title="Tags">
                <TagsForm tags={tags} />
              </Tab>
              <Tab key="media" title="Media">
                <MediaForm defaultValues={{ coverImage: course.coverImage, previewVideo }} />
              </Tab>
              <Tab key="pricing" title="Pricing">
                <PricingPanel discountId={discounts[0]?.id} refetch={refetch} courseId={id} />
              </Tab>
              <Tab key="curriculum" title="Curriculum">
                <CurriculumForm courseId={id} sections={dummy} refetch={refetch} />
              </Tab>
            </Tabs>
          </FormProvider>
          {selectedKey !== "curriculum" && (
            <div className={cn("@7xl:absolute", " top-1 right-1 flex gap-x-4")}>
              <Button size="md" radius="sm" className="text-white bg-danger-500 font-medium flex gap-x-2 h-9">
                <LuX /> Cancel
              </Button>
              <Button
                isDisabled={isPending || isPendingTags || loading}
                onClick={methods.handleSubmit(saveChanges)}
                size="md"
                radius="sm"
                className="text-white bg-success-600 font-medium flex gap-x-2 h-9">
                <LuSave /> Save
              </Button>
            </div>
          )}
        </div>
        {/* Live Preview / Help */}
        {showPreviewState[0] || selectedKey != "curriculum" ? (
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <LuEye className="w-4 h-4" /> Live Preview
              </div>
              <div className="p-4">
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="relative aspect-video bg-slate-100 grid place-items-center">
                    {preview ? (
                      <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
                        <Image src={preview} alt="course image" fill objectFit="cover" />
                      </div>
                    ) : course.coverImage ? (
                      <div className="w-full h-fit aspect-video rounded-lg overflow-hidden relative">
                        <Image src={course.coverImage} alt="course image" fill objectFit="cover" />
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm flex flex-col items-center">
                        <LuImage className="w-8 h-8 mb-1" />
                        Thumbnail
                      </div>
                    )}
                    <span className="absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white">
                      {status}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="font-semibold">{title || "Course title"}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {subtitle || "Write a compelling subtitle or description."}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <LuStar className="w-3.5 h-3.5" /> 0.0
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <LuUsers className="w-3.5 h-3.5" /> 0
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <PiMoneyWavyLight size={16} />{" "}
                        {(discount && discountActive
                          ? finalPrice(price!, discount, discountType)
                          : price || 0
                        ).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-sm font-medium mb-2">Tips</p>
              <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                <li>Use actionable titles (e.g., “Build a REST API with Express & Prisma”).</li>
                <li>Each lesson should have a clear outcome in 5–10 minutes.</li>
                <li>Mark 1–2 lessons as preview to attract learners.</li>
              </ul>
            </div>
          </aside>
        ) : null}
      </section>
    </EditCourseContext.Provider>
  );
}
