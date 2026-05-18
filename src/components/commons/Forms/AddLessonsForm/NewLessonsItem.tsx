import NormalCkbox from "@/components/commons/NormalCkbox";
import { itemTypeSelect } from "@/components/views/Instructor/Course/EditCourse/Forms/FolderTree/SectionItem/SectionItem";
import { cn } from "@/libs/tiptap/tiptap-utils";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Select, SelectItem } from "@heroui/react";
import { CSSProperties } from "react";
import { Controller } from "react-hook-form";
import { LuChevronsDownUp, LuX } from "react-icons/lu";
import { RhfMethods, SelectState, ToggleSelect } from "./AddLessonsForm";
export default function NewLessonItem({
  control,
  idx,
  id,
  selected,
  toggleSelect,
  remove,
  addLesson,
}: {
  idx: number;
  control: RhfMethods["control"];
  id: UniqueIdentifier;
  selected: SelectState[0];
  toggleSelect: ToggleSelect;
  remove: () => void;
  addLesson: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as CSSProperties;
  return (
    <li
      {...{ ...attributes, ...listeners }}
      ref={setNodeRef}
      style={style}
      role="treeitem"
      aria-selected={selected.has(id)}
      className={cn(
        "flex w-full group focus-within:border-blue-500 focus-within:bg-blue-50 focus-within:hover:bg-blue-100 items-center rounded-md text-left transition-colors duration-150 cursor-pointer hover:bg-gray-100 text-[var(--tt-theme-text)] pl-2 bg-white border border-gray-100 relative",
      )}>
      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center")}>
        <LuChevronsDownUp />
      </span>
      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center ml-[10px] mr-2")}>
        <NormalCkbox isSelected={selected.has(id)} onValueChange={() => toggleSelect(id)} />
      </span>
      <Controller
        control={control}
        name={`items.${idx}.type`}
        render={({ field }) => (
          <Select
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={keys => {
              field.onChange(Array.from(keys)[0]);
            }}
            aria-label="Select Item type"
            items={itemTypeSelect}
            className="max-w-[6.7rem]"
            size="sm"
            radius="none"
            classNames={{
              selectorIcon: "-mr-1.5",
              trigger:
                "bg-transparent shadow-none focus-within:ring-blue-500 focus-within:ring-1 h-9 rounded-md border-1 border-gray-100 data-[hover=true]:border-gray-200 data-[hover=true]:bg-transparent",
              popoverContent: "rounded-lg p-0",
            }}
            renderValue={items => {
              return items.map(({ data, key }) =>
                data ? (
                  <span key={key} className="flex items-center gap-x-1">
                    <data.icon size={16} />
                    {data.label}
                  </span>
                ) : null,
              );
            }}>
            {({ icon: Icon, key, label }) => (
              <SelectItem aria-label={label} key={key}>
                <span className="flex items-center gap-x-1">
                  <Icon size={16} />
                  {label}
                </span>
              </SelectItem>
            )}
          </Select>
        )}
      />

      <Controller
        control={control}
        name={`items.${idx}.title`}
        render={({ field }) => (
          <input
            {...field}
            data-new-lesson-id={id}
            type="text"
            className="w-full text-medium px-2.5 py-1.5 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-r-md"
            onKeyDown={e => {
              if (e.key == "Enter") {
                e.preventDefault();
                addLesson();
              }
            }}
            onFocus={e => e.currentTarget.select()}
          />
        )}
      />
      <Button
        onPress={remove}
        variant="solid"
        color="danger"
        className="absolute reset-button p-0.5 -top-1.5 -right-1.5"
        radius="full"
        isIconOnly>
        <LuX size={12} />
      </Button>
    </li>
  );
}
