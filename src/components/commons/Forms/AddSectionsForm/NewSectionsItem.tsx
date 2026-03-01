import NormalCkbox from "@/components/commons/NormalCkbox";
import { cn } from "@/libs/tiptap/tiptap-utils";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@heroui/react";
import { CSSProperties } from "react";
import { Controller } from "react-hook-form";
import { LuChevronsDownUp, LuX } from "react-icons/lu";
import { RhfMethods, SelectState, ToggleSelect } from "./AddSectionsForm";
export default function NewSectionsItem({
  control,
  idx,
  id,
  selected,
  toggleSelect,
  remove,
  addSection,
}: {
  idx: number;
  control: RhfMethods["control"];
  id: UniqueIdentifier;
  selected: SelectState[0];
  toggleSelect: ToggleSelect;
  remove: () => void;
  addSection: () => void;
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
      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center ml-[14px] mr-1.5")}>
        <NormalCkbox isSelected={selected.has(id)} onValueChange={() => toggleSelect(id)} />
      </span>
      <Controller
        control={control}
        name={`sections.${idx}.title`}
        render={({ field }) => (
          <input
            {...field}
            data-new-section-id={id}
            type="text"
            className="w-full text-medium px-3 py-1.5 focus:outline-0 text-[var(--tt-theme-text)] font-medium rounded-r-md"
            onKeyDown={e => {
              if (e.key == "Enter") {
                e.preventDefault();
                addSection();
              }
            }}
            onFocus={e => e.currentTarget.select()}
          />
        )}
      />
      <Button
        onPress={remove}
        variant="shadow"
        color="danger"
        className="absolute reset-button p-0.5 -top-1.5 -right-1.5"
        radius="full"
        isIconOnly>
        <LuX size={12} />
      </Button>
    </li>
  );
}
