import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chip } from "@heroui/react";
import { CSSProperties } from "react";

const SortableChip = ({ id, name, index }: { name: string; id: number; index: number }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    border: 1,
  } as CSSProperties;
  return (
    <span ref={setNodeRef} style={style} {...{ ...listeners, ...attributes }} data-chip-sortable={id}>
      <Chip size="md" key={id} radius="sm" color="primary" variant={index == 0 ? "solid" : "flat"}>
        {name}
      </Chip>
    </span>
  );
};

export default SortableChip;
