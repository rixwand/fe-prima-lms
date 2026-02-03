import SortableChip from "@/components/commons/Chip/SortableChip";
import TextField from "@/components/commons/TextField";
import useCourseCategories from "@/hooks/course/useCourseCategories";
import cn from "@/libs/utils/cn";
import { hasDirty } from "@/libs/utils/rhf";
import { toSlug } from "@/libs/utils/string";
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
  Button,
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
import { Key, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuChevronDown, LuInfo, LuUndo2 } from "react-icons/lu";
import { EditCourseForm } from "./form.type";
export default function CategoriesTagsForm({
  tags: defaultTags,
  categories: defaultCateories,
}: {
  tags: Tag[];
  categories: Category[];
}) {
  const { categories } = useCourseCategories();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Omit<Tag, "id">[]>(defaultTags.map(({ id: _id, ...tag }) => tag));
  const {
    formState: { errors, dirtyFields },
    watch,
    setValue,
    control,
  } = useFormContext<EditCourseForm>();

  const reset = () => {
    setTags(defaultTags.map(({ id: _, ...tag }) => tag));
    setValue("tags", undefined, { shouldDirty: true });
    setValue("categories", defaultCateories, { shouldDirty: true });
    setTagInput("");
  };

  const [tagsObj, c, d] = watch(["tags", "tags.createOrConnect", "tags.disconnectSlugs"]);
  useEffect(() => {
    if (!tagsObj) return;
    if (d && d.length == 0) {
      Reflect.deleteProperty(tagsObj, "disconnectSlugs");
    }
    if (c && c.length == 0) {
      Reflect.deleteProperty(tagsObj, "createOrConnect");
    }
    if (Reflect.ownKeys(tagsObj).length == 0) {
      setValue("tags", undefined, { shouldDirty: true });
    }
  }, [tagsObj, setValue, c, d]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.filter(tag => tag.slug === toSlug(t)).length > 0) return setTagInput("");
    if (tagsObj?.disconnectSlugs && tagsObj.disconnectSlugs.includes(toSlug(t))) {
      setValue(
        "tags.disconnectSlugs",
        tagsObj.disconnectSlugs.filter(s => s !== toSlug(t)),
        { shouldDirty: true },
      );
    }
    setTags(tags => [...tags, { name: t, slug: toSlug(t) }]);
    if (defaultTags.filter(dt => dt.name === t).length === 0) {
      setValue("tags.createOrConnect", [...(tagsObj?.createOrConnect ? tagsObj.createOrConnect : []), t], {
        shouldDirty: true,
      });
    }
    setTagInput("");
  };

  const removeTag = ({ title, slug }: { title: string; slug: string }) => {
    if (tagsObj?.createOrConnect && tagsObj.createOrConnect.includes(title)) {
      setValue(
        "tags.createOrConnect",
        tagsObj.createOrConnect.filter(t => t !== title),
        { shouldDirty: true },
      );
    } else {
      setValue("tags.disconnectSlugs", [...(tagsObj?.disconnectSlugs ? tagsObj.disconnectSlugs : []), slug], {
        shouldDirty: true,
      });
    }

    setTags(tags => tags.filter(t => t.slug !== slug));
  };

  const [dragState, setDragState] = useState<{ id: number; width: number; height: number } | null>(null);
  const { fields, move, remove, append } = useFieldArray({ control, name: "categories", keyName: "fieldId" });
  const ids = useMemo(() => fields.map(f => f.id), [fields]);
  const selectedKeys = useMemo(() => new Set(fields.map(f => String(f.id))), [fields]);
  const handleSelectionChange = (key: Key) => {
    if (fields.some(f => f.id == Number(key))) remove(fields.findIndex(f => f.id == Number(key)));
    else if (fields.length >= 3) return addToast({ color: "danger", title: "Cannot add more than 3 Categories" });
    else append(categories[categories.findIndex(c => c.id == Number(key))]);
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

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
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
          {tags.map(({ name, slug }) => (
            <Chip
              className="mb-1"
              variant="bordered"
              color="primary"
              key={slug}
              onClose={() => removeTag({ slug: slug, title: name })}>
              {name}
            </Chip>
          ))}
        </span>
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

      {(["tags", "categories"] as const).some(key => hasDirty(dirtyFields?.[key])) && (
        <Button color="danger" onPress={reset} className="h-9" variant="flat" radius="sm">
          <LuUndo2 /> Reset
        </Button>
      )}
    </div>
  );
}
