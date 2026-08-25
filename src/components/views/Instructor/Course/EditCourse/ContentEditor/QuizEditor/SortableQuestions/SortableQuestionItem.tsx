import NormalCkbox from "@/components/commons/NormalCkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { CSSProperties } from "react";
import { LuCopyCheck, LuEllipsis, LuGripVertical } from "react-icons/lu";
import { QuizTypeKey } from "../QuizEditor.types";
import QuizEditorPopover from "../QuizEditorPopover";

const SortableQuestionItems = ({
  question,
  isEditMode,
  idx,
  onRemoveQuestion,
  isSelected,
  handleToggleSelect,
}: {
  question: {
    id: string;
    title: string;
    quizType: QuizTypeKey;
  };
  idx: number;
  isEditMode: boolean;
  onRemoveQuestion: () => void;
  isSelected: boolean;
  handleToggleSelect: () => void;
}) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: question.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as CSSProperties;
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode && { ...listeners, attributes })}
      // href={`#${question.questionId}`}
      // onClick={() => document.location.href}
      className={`w-full rounded-2xl border p-4 text-left transition-colors border-zinc-200 bg-white hover:bg-gray-50 hover:border-zinc-300 cursor-pointer inline-block`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <NormalCkbox onValueChange={handleToggleSelect} size="md" className="-m-2" isSelected={isSelected} />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600">
              {idx + 1}
            </div>
          )}
          <p className="line-clamp-1 text-sm font-medium">{question.title}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-x-2 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
          <LuCopyCheck />
          <p>{question.quizType === "fill-blank" ? "Fill in the blank" : "Multiple choices"}</p>
        </span>
        {!isEditMode ? (
          <QuizEditorPopover menuState={menuState} onRemoveQuestion={onRemoveQuestion}>
            <Button className="reset-button p-1.5 bouncy-button" radius="sm" isIconOnly variant="light" disableRipple>
              <LuEllipsis size={16} />
            </Button>
          </QuizEditorPopover>
        ) : (
          <button
            className="rounded-full p-1.5 h-fit mt-1 cursor-grab active:cursor-grabbing"
            // {...{ ...listeners, ...attributes }}
          >
            <LuGripVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SortableQuestionItems;
