import UserCourseCard from "@/components/commons/Cards/UserCourseCard";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { SUPABASE_BUCKET, SUPABASE_URL } from "@/config/env";
import useCourse from "@/hooks/course/useCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { EditCourseContext } from "@/libs/context/EditCourseContext";
import { storageClient } from "@/libs/supabase/client";
import cn from "@/libs/utils/cn";
import { getDirtyData } from "@/libs/utils/rhf";
import { toSlug } from "@/libs/utils/string";
import { StateType } from "@/types/Helper";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  addToast,
} from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { Key, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuEye, LuSave, LuText, LuX } from "react-icons/lu";
import BasicsForm from "./Forms/BasicForm";
import CategoriesTagsForm from "./Forms/CategoriesTagsForm";
import CurriculumForm from "./Forms/CurriculumForm";
import MediaForm from "./Forms/MediaForm";
import PricingPanel from "./Forms/PricingPanel";
import { EditCourseForm } from "./Forms/form.type";

export type EditCourseTabsType = "basic" | "tags" | "media" | "pricing" | "curriculum";

export default function EditCourse({
  id,
  tabsState: [selectedKey, setSelectedKey],
}: {
  id: number;
  tabsState: StateType<EditCourseTabsType>;
}) {
  const {
    updateCourse,
    updateTags,
    course: data,
    hasPending,
    updateCategories,
  } = useCourse(id, { refetchOnMutateSuccess: true });
  const { ownerId: _o, slug: _s, tags: _approvedTags, sections, categories: _c, metaDraft: draft, ...course } = data!;
  const {
    draftTags: tags,
    draftDiscounts: discounts,
    draftCategories: categories,
    ...metaDraft
  } = { ...draft, draftDiscounts: draft.draftDiscounts || [] };
  const defaultValues = {
    ...course,
    ...metaDraft,
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
    sections,
    categories,
    // descriptionJson: descriptionJson || undefined,
    // previewVideo: previewVideo || undefined,
    fileList: undefined,
    removeDiscount: undefined,
    addDiscount: undefined,
  };
  const [loading, setLoading] = useState(false);
  const showPreviewState = useState(true);
  const pendingKeyRef = useRef<EditCourseTabsType | null>(null);

  const methods = useForm<EditCourseForm>({
    defaultValues,
  });

  const fileList = methods.watch("fileImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;

  const [title, price, discount] = methods.watch(["title", "priceAmount", "discount"]);

  const saveChanges = async () => {
    const dirty = methods.formState.dirtyFields;
    if (Object.keys(dirty).length == 0) return;
    try {
      const values = methods.getValues();
      const dirtyData = getDirtyData(dirty, values);
      if (Object.keys(dirtyData).length == 0) return;
      // addToast({ title: "dirtyData", description: JSON.stringify(dirtyData, null, 2) });
      if (dirtyData.tags || (dirtyData.categories && dirtyData.categories.length > 0)) {
        if (dirtyData.tags) updateTags({ id, tags: dirtyData.tags });
        if (dirtyData.categories) {
          const currentField = methods.getValues("categories");
          const ids = currentField!.map(c => c.id);
          const primaryId = currentField![0].id;
          updateCategories({ id: course.id, categories: { ids, primaryId } });
        }
        return;
      }
      if (dirtyData.fileImage) {
        setLoading(true);
        const fileImage = dirtyData.fileImage[0];
        const ext = fileImage.name.split(".").pop();
        const path = `courses/${toSlug(dirtyData.title || metaDraft.title)}.${ext}`;
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
      return updateCourse({ id, data: dirtyData });
    } catch (error) {
      setLoading(false);
      const err = error as Error;
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  };

  const actuallySwitch = (key: EditCourseTabsType) => {
    setSelectedKey(key);
    pendingKeyRef.current = null;
  };

  const handleSelectionChange = (nextKey: Key) => {
    if (!Object.hasOwn(methods.formState.dirtyFields, "tags")) {
      actuallySwitch(nextKey as EditCourseTabsType);
      return;
    }
    pendingKeyRef.current = nextKey as EditCourseTabsType;
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

  const { data: user } = useSession();

  const [popOpen, setPopOpen] = useState(false);
  useNProgress(loading);
  useEffect(() => {
    methods.reset(defaultValues);
  }, [data]);

  return (
    <EditCourseContext.Provider value={{ showCoursePreviewState: showPreviewState, courseId: id }}>
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 @container">
        <div
          className={cn(
            showPreviewState[0] || selectedKey != "curriculum" ? "lg:col-span-8" : "lg:col-span-12",
            "space-y-4 relative",
          )}>
          <FormProvider {...methods}>
            <div className="flex gap-x-4 items-center @xl:hidden mx-2">
              <Popover placement="right-start" isOpen={popOpen} onOpenChange={o => setPopOpen(o)}>
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    className="reset-button p-1.5 text-xl bg-blue-600 text-white rounded-md"
                    size="lg"
                    radius="none"
                    variant="solid">
                    <LuText />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 border-small px-1 py-2 rounded-xl border-default-200 dark:border-default-100">
                  <Listbox
                    aria-label="Tabs list box"
                    disallowEmptySelection
                    selectedKeys={[selectedKey]}
                    selectionMode="single"
                    variant="flat"
                    hideSelectedIcon
                    selectionBehavior="replace"
                    onSelectionChange={keys => {
                      setSelectedKey([...keys][0] as EditCourseTabsType);
                      setPopOpen(false);
                    }}
                    itemClasses={{
                      base: "font-medium data-[selected=true]:text-white data-[selected=true]:bg-blue-700 data-[selectable=true]:focus:text-white data-[selectable=true]:focus:bg-blue-700",
                    }}>
                    <ListboxItem aria-label="basic" key="basic">
                      Basic
                    </ListboxItem>
                    <ListboxItem aria-label="categories and tags" key="categories_tags">
                      Categories & Tags
                    </ListboxItem>
                    <ListboxItem aria-label="media" key="media">
                      Media
                    </ListboxItem>
                    <ListboxItem aria-label="pricing" key="pricing">
                      Pricing
                    </ListboxItem>
                    <ListboxItem aria-label="curriculum" key="curriculum">
                      Curriculum
                    </ListboxItem>
                  </Listbox>
                </PopoverContent>
              </Popover>
              <h3 className="font-semibold text-lg text-slate-700">
                {selectedKey.replace(/^./, c => c.toUpperCase())}
              </h3>
            </div>
            <Tabs
              selectedKey={selectedKey}
              onSelectionChange={handleSelectionChange}
              aria-label="Tabs edit course"
              color="primary"
              radius="lg"
              classNames={{
                tab: "w-30 px-4 font-semibold h-[34px] @xl:flex hidden",
                cursor: "bg-blue-700",
                tabList: "shadow-none border-slate-300 border @xl:flex hidden",
                tabContent: "text-slate-700",
                base: "@xl:flex hidden",
              }}
              variant="bordered">
              <Tab key="basic" title="Basic">
                <BasicsForm defaultValues={{ ...metaDraft }} />
              </Tab>
              <Tab key="categories_tags" title="Category/Tag">
                <CategoriesTagsForm categories={categories} tags={tags} />
              </Tab>
              <Tab key="media" title="Media">
                <MediaForm defaultValues={{ ...metaDraft, previewVideo: metaDraft.previewVideo! }} />
              </Tab>
              <Tab key="pricing" title="Pricing">
                <PricingPanel discountId={discounts[0]?.id} courseId={id} />
              </Tab>
              <Tab key="curriculum" title="Curriculum">
                <CurriculumForm courseId={id} defaultValue={sections} />
              </Tab>
            </Tabs>
          </FormProvider>
          {selectedKey !== "curriculum" && (
            <div className={cn("@7xl:absolute", " top-1 right-1 flex gap-x-4")}>
              <Button size="md" radius="sm" className="text-white bg-danger-500 font-medium flex gap-x-2 h-9">
                <LuX /> Cancel
              </Button>
              <Button
                isDisabled={hasPending}
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
              <div className="p-6 grid">
                <UserCourseCard
                  course={{
                    metaApproved: {
                      ...metaDraft,
                      title,
                      priceAmount: price,
                      ...(preview && { coverImage: preview }),
                    },
                    owner: {
                      fullName: user?.user.fullName || "instructor Name",
                      profilePict: user?.user.image || "/images/user.jpg",
                      username: user?.user.name || "instructor Name",
                    },
                    discounts: discounts[0] && [
                      {
                        id: discounts[0].id,
                        courseId: discounts[0].courseId,
                        endAt: discount?.endAt?.toString() || discounts[0].endAt || "",
                        startAt: discount?.startAt?.toString() || discounts[0].startAt || "",
                        isActive: discount?.isActive == undefined ? discounts[0].isActive : discount.isActive,
                        label: discount?.label || discounts[0].label,
                        type: discount?.type || discounts[0].type,
                        value: discount?.value || discounts[0].value,
                      },
                    ],
                  }}
                />
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
