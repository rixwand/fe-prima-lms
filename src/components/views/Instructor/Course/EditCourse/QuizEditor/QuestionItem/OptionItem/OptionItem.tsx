import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox, Input } from "@heroui/react";
import { CSSProperties } from "react";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { LuGripVertical } from "react-icons/lu";
import { QuizEditorForm } from "../../QuizEditor.types";

const OptionItem = ({
  option,
  optionIdx,
  control,
  questionIdx,
  onMarkCorrectAnswer,
  removeOption,
}: {
  option: FieldArrayWithId<QuizEditorForm, `questions.${number}.options`, "fieldId">;
  optionIdx: number;
  questionIdx: number;
  control: Control<QuizEditorForm>;
  onMarkCorrectAnswer: (e: boolean) => void;
  removeOption: (idx: number) => void;
}) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: option.fieldId!,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as CSSProperties;
  return (
    <div style={style} ref={setNodeRef} className="flex gap-x-1 items-center py-[0.3rem]">
      <Controller
        control={control}
        name={`questions.${questionIdx}.options.${optionIdx}.isCorrect`}
        render={({ field }) => (
          <Checkbox
            radius="full"
            size="md"
            icon={<CheckIcon />}
            isSelected={field.value}
            aria-label="Answer checkbox"
            onValueChange={e => {
              onMarkCorrectAnswer(e);
              return field.onChange(e);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={`questions.${questionIdx}.options.${optionIdx}.value` as const}
        rules={{ required: "Please input option" }}
        render={({ field, fieldState: { error } }) => (
          <Input
            data-option-fieldid={option.fieldId}
            radius="sm"
            value={field.value}
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            onValueChange={field.onChange}
            classNames={{
              inputWrapper: "h-fit min-h-fit py-1.5",
              errorMessage: "absolute",
              helperWrapper: "absolute w-full -bottom-1",
            }}
            onBlur={() => (field.value == "" ? removeOption(optionIdx) : null)}
          />
        )}
      />
      <span className="cursor-grabbing p-1.5 ml-1 rounded-lg bg-gray-200" {...{ ...attributes, ...listeners }}>
        <LuGripVertical size={18} />
      </span>
    </div>
  );
};

export default OptionItem;

const CheckIcon = ({ isSelected, isIndeterminate, disableAnimation, ...props }: any) => <FaCheck {...props} />;
