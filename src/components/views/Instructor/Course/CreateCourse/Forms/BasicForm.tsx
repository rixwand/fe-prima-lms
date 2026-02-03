import SortableChip from "@/components/commons/Chip/SortableChip";
import TextField from "@/components/commons/TextField";
import useCourseCategories from "@/hooks/course/useCourseCategories";
import cn from "@/libs/utils/cn";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  addToast,
} from "@heroui/react";
import { Key, useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { LuChevronDown, LuImage, LuInfo, LuUpload } from "react-icons/lu";
import { CourseForm } from "../form.type";
import Field from "./Field";

export default function BasicsForm() {
  const [tagInput, setTagInput] = useState("");
  const [dragState, setDragState] = useState<{ id: number; width: number; height: number } | null>(null);
  const { categories } = useCourseCategories();
  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CourseForm>();

  const { move, fields, append, remove } = useFieldArray({ control, name: "categories", keyName: "fieldId" });
  const ids = useMemo(() => fields.map(c => c.id), [fields]);

  register("tags", { minLength: { value: 1, message: "Add at least 1 tag" }, required: "Add at least 1 tag" });
  register("categories", {
    minLength: { value: 1, message: "Add at least 1 categories" },
    required: "Add at least 1 categories",
  });

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragState(null);
    if (!over || active.id === over.id) return;

    const from = fields.findIndex(s => s.id === active.id);
    const to = fields.findIndex(s => s.id === over.id);
    if (from === -1 || to === -1) return;
    move(from, to);
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    const element = document.querySelector<HTMLElement>(`[data-chip-sortable="${active.id}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setDragState({
        width: rect.width,
        height: rect.height,
        id: parseInt(active.id.toString()),
      });
    }
  };
  const selectedKeys = useMemo(() => new Set(fields.map(f => String(f.id))), [fields]);

  const handleSelectionChange = (key: Key) => {
    if (fields.some(f => f.id == Number(key))) remove(fields.findIndex(f => f.id == Number(key)));
    else if (fields.length >= 3) return addToast({ color: "danger", title: "Cannot add more than 3 Categories" });
    else append(categories[categories.findIndex(c => c.id == Number(key))]);
  };

  return (
    <div className="space-y-6 @container">
      <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5">
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
              // <Input
              //   labelPlacement={"outside-top"}
              //   label="Title"
              //   placeholder="e.g., Build a Full-Stack LMS with Next.js"
              //   type="text"
              //   errorMessage={error?.message}
              //   isInvalid={!!error?.message}
              //   {...field}
              // />
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
      <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
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
        </div>
        <div className="flex flex-col gap-y-1">
          <span className="text-sm font-medium flex items-center gap-x-1">
            Categories
            <Popover showArrow>
              <PopoverTrigger>
                <span className="">
                  <LuInfo />
                </span>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-sm font-semibold text-slate-700">Drag untuk mengurutkan kategori</div>
                  <div className="text-sm text-slate-600">Kategori urutan pertama akan menjadi kategori utama</div>
                </div>
              </PopoverContent>
            </Popover>
          </span>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <div
                  className={cn(
                    errors.categories?.root ? "border-danger" : "border-slate-200 ",
                    "w-full py-1 rounded-xl border-1 h-fit focus:ring-2 focus:ring-blue-100 flex items-center justify-between focus-visible:outline-0",
                  )}>
                  <span className="flex gap-x-1.5 px-1.5 overflow-x-scroll scrollbar-hide">
                    <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                      {fields.length > 0 ? (
                        fields.map((c, i) => <SortableChip id={c.id} name={c.name} key={c.id} index={i} />)
                      ) : (
                        <p
                          className={cn(
                            errors.categories?.root ? "text-danger" : "text-slate-400",
                            "text-sm py-1 px-1.5",
                          )}>
                          Choose Categories
                        </p>
                      )}
                    </SortableContext>
                  </span>
                  <span className="pr-1.5 pl-1 flex rounded-r-xl">
                    <LuChevronDown className="text-slate-300 text-xl my-auto" />
                  </span>
                  {dragState && (
                    <DragOverlay>
                      <span style={{ width: dragState.width, height: dragState.height }}>
                        <Chip
                          size="md"
                          radius="sm"
                          color="primary"
                          variant={fields.findIndex(c => c.id == dragState.id) == 0 ? "solid" : "flat"}>
                          {categories[categories.findIndex(c => c.id == dragState.id)]["name"]}
                        </Chip>
                      </span>
                    </DragOverlay>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                closeOnSelect={false}
                classNames={{ list: "" }}
                onAction={handleSelectionChange}>
                {categories.map(c => (
                  <DropdownItem key={c.id}>{c.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </DndContext>
          {errors.categories?.root ? (
            <p className="mt-0.5 text-xs text-rose-600">{errors.categories.root?.message}</p>
          ) : null}
        </div>
      </div>

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
                // endContent={<IoClose />}
                onClose={() =>
                  setValue(
                    "tags",
                    tags.filter(tag => tag != t),
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
