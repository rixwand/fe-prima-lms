import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
}

const initial: TreeNode[] = [
  {
    id: "1",
    title: "Fruits",
    children: [
      { id: "1-1", title: "Apple" },
      { id: "1-2", title: "Orange" },
      { id: "1-3", title: "Banana" },
    ],
  },
  {
    id: "2",
    title: "Vegetables",
    children: [
      { id: "2-1", title: "Carrot" },
      { id: "2-2", title: "Cucumber" },
    ],
  },
  {
    id: "3",
    title: "Grains",
    children: [],
  },
];

const SortableItem = ({ title, id, description }: { description?: string; title: string; id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li key={id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        className="w-full min-w-[300px] flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        aria-label={`Open ${title}`}>
        <span className="flex-none rounded-lg bg-green-50 p-2">
          <span className="block text-green-600">
            <FolderIcon />
          </span>
        </span>

        <span className="flex-1 text-left text-sm font-medium text-gray-800">
          {title}
          {description ? <div className="text-xs text-gray-500 font-normal">{description}</div> : null}
        </span>

        <span className="flex-none text-gray-400">
          <HandleIcon />
        </span>
      </button>
    </li>
  );
};

export default function Sortable() {
  const [items, setItems] = useState(initial);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id.toString());
      const newIndex = items.findIndex(item => item.id === over.id.toString());
      if (oldIndex === -1 || newIndex === -1) return;
      setItems(items => arrayMove(items, oldIndex, newIndex));
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <section className="min-h-screen w-full grid place-content-center">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className={"max-w-sm bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden "} role="list">
          <div className="p-3">
            <ul className="space-y-2">
              <SortableContext items={initial} strategy={verticalListSortingStrategy}>
                {items.map(item => (
                  <SortableItem key={item.id} {...item} />
                ))}
              </SortableContext>
            </ul>
          </div>
        </div>
      </DndContext>
      <button
        className="
    relative inline-flex items-center justify-center
    rounded-md bg-primary-500 text-white font-medium
    transition-all duration-200 ease-in-out
    hover:bg-primary-600
    active:scale-[0.97] active:bg-primary-700
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500
    disabled:opacity-50 disabled:pointer-events-none
    px-4 py-2
  ">
        Click me
      </button>
    </section>
  );
}

export type FolderItem = {
  id: string;
  title: string;
  description?: string;
};

// Simple folder SVG used on the left
const FolderIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V7Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hamburger / handle icon on the right
const HandleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 9H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 15H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
