import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { hasDirty } from "@/libs/utils/rhf";
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo } from "react";
import {
  Control,
  UseFieldArrayUpdate,
  UseFormSetValue,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ChoiceTypeKey, Question, QuizEditorForm, QuizTypeKey, SelectionKeys } from "../../QuizEditor.types";
import { choicesTypeOptions, quizTypeOptions } from "../../useQuizEditor";

const parseSelectionKey = (keys: SelectionKeys) => {
  if (keys === "all") return null;
  const [selected] = Array.from(keys);
  return typeof selected === "string" ? selected : null;
};

export default function useQuestion({
  control,
  setValue,
  questionIndex,
  defaultQuestion,
  updateQuestion,
}: {
  control: Control<QuizEditorForm>;
  setValue: UseFormSetValue<QuizEditorForm>;
  questionIndex: number;
  defaultQuestion: IQuizQuestion;
  updateQuestion: UseFieldArrayUpdate<QuizEditorForm, "questions">;
}) {
  const {
    fields: options,
    append,
    move,
    replace,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
    keyName: "fieldId",
  });
  const {
    formState: { dirtyFields },
    resetField,
  } = useFormContext<QuizEditorForm>();
  const selectedQuizType =
    useWatch({ control, name: `questions.${questionIndex}.quizType` as const }) || "multiple-choices";
  const selectedChoicesType = useWatch({ control, name: `questions.${questionIndex}.choiceType` as const }) || "text";
  const liveOptions = useWatch({ control, name: `questions.${questionIndex}.options` });

  const setQuizTypeFromSelection = (keys: SelectionKeys) => {
    const value = parseSelectionKey(keys) as QuizTypeKey | null;
    if (!value) return;
    setValue(`questions.${questionIndex}.quizType`, value, { shouldDirty: true });
  };

  const setChoicesTypeFromSelection = (keys: SelectionKeys) => {
    const value = parseSelectionKey(keys) as ChoiceTypeKey | null;
    if (!value) return;
    setValue(`questions.${questionIndex}.choiceType`, value, { shouldDirty: true });
  };

  const appendOption = () => append({ value: "", isCorrect: false });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = useMemo(() => options.map(s => s.fieldId!), [options]);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = options.findIndex(s => s.fieldId === active.id);
    const to = options.findIndex(s => s.fieldId === over.id);
    if (from === -1 || to === -1) return;
    move(from, to);
  };
  const multipleAnswer = useWatch({ control, name: `questions.${questionIndex}.multipleAnswer` });

  const onMarkCorrectAnswer = (e: boolean) => {
    if (!multipleAnswer) {
      replace(liveOptions.map(a => ({ value: a.value, isCorrect: false })));
    }
  };

  const isDirty = hasDirty(dirtyFields.questions?.[questionIndex]);
  const executeRestore = () => {
    const defQ: Question = {
      ...defaultQuestion,
      choiceType: "text",
      quizType: "multiple-choices",
      durationMins: defaultQuestion.estimatedTimesSecond / 60,
      options: defaultQuestion.options.map(o => ({ value: o.value, isCorrect: o.isCorrect })),
    };
    updateQuestion(questionIndex, defQ);
    resetField(`questions.${questionIndex}`, { defaultValue: defQ });
  };

  const handleRestore = () => {
    confirmDialog({
      title: "Restore question?",
      desc: "Unsaved changes for this question will be lost.",
      isDestructive: true,
      confirmLabel: "Restore",
      onConfirmed: executeRestore,
    });
  };

  // useEffect(() => {
  //   const newAnswer = options.at(-1);
  //   if (newAnswer?.value == "") {
  //     const el = document.querySelector(`input[data-answer-fieldId="${newAnswer.fieldId}"]`);
  //     if (el instanceof HTMLInputElement) el.focus();
  //   }
  // }, [options]);

  return {
    options,
    quizTypeOptions,
    choicesTypeOptions,
    selectedQuizType,
    selectedChoicesType,
    setQuizTypeFromSelection,
    setChoicesTypeFromSelection,
    appendOption,
    onDragEnd,
    ids,
    sensors,
    onMarkCorrectAnswer,
    removeOption,
    restore: handleRestore,
    isDirty,
  };
}
