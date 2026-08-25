import useEditQuiz from "@/hooks/course/useEditQuiz";
import { useEditModeContext } from "@/libs/context/EditModeContext";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { hasDirty } from "@/libs/utils/rhf";
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { addToast } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Question, QuizEditorForm, QuizQuestionFieldArray } from "../QuizEditor.types";
import { confirmDiscardChanges, restoreQuiz } from "../useQuizEditor";

type UpdatedQuestionPosition = { id: number; position: number } | Omit<Question, "id">;

export default function ({ fields, move }: QuizQuestionFieldArray) {
  const { ids: idsPath } = useLessonEditorContext();
  const { setEditMode } = useEditModeContext();
  const { deleteManyQuestion, updateQuiz, quizContent } = useEditQuiz({
    idsPath: idsPath!,
  });
  const {
    control,
    getValues,
    reset,
    formState: { dirtyFields },
  } = useFormContext<QuizEditorForm>();
  const [selectedQuestion, setSelectedQuestion] = useState<Set<number>>(new Set());
  const [updatedQuestionPositions, setUpdatedQuestionPositions] = useState<UpdatedQuestionPosition[]>([]);
  const questionFieldIds = useMemo(() => fields.map(s => s.questionId!), [fields]);
  const watchedQuestions = useWatch({ control, name: "questions" });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const sidebarQuestions = useMemo(
    () =>
      fields.map((question, index) => ({
        id: question.questionId,
        title: watchedQuestions?.[index]?.question?.trim() || `Question ${index + 1}`,
        quizType: watchedQuestions?.[index]?.quizType || "multiple-choices",
      })),
    [fields, watchedQuestions],
  );
  const questionIds = useMemo(() => fields.map(q => q.id).filter((id): id is number => id !== undefined), [fields]);
  const isEveryQuestionSelected = questionIds.every(id => selectedQuestion.has(id));
  const isQuestionSelected = (id: number) => selectedQuestion.has(id);
  const handleToggleSelectQuestion = (id: number) => {
    setSelectedQuestion(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAllQuestionSelection = () => {
    setSelectedQuestion(prev => {
      const next = new Set(prev);
      const allChecked = questionIds.every(id => next.has(id));
      return allChecked ? new Set() : new Set(questionIds);
    });
  };
  const editModeActionHandler = {
    save: () => {
      if (updatedQuestionPositions.length > 0) updateQuiz({ questions: updatedQuestionPositions });
      setEditMode(false);
    },
    restore: () => {
      confirmDiscardChanges(() => {
        restoreQuiz(reset, quizContent);
        setUpdatedQuestionPositions([]);
      });
    },
    deleteMany: () => {
      console.log([...selectedQuestion]);
      confirmDialog({
        title: "Delete batch question?",
        desc: "The selected question will be removed from the quiz.",
        isDestructive: true,
        confirmLabel: "Delete",
        onConfirmed: () => {
          deleteManyQuestion([...selectedQuestion]);
        },
      });
    },
    discard: () => {
      if (updatedQuestionPositions.length > 0)
        confirmDiscardChanges(() => {
          restoreQuiz(reset, quizContent);
          setEditMode(false);
          setUpdatedQuestionPositions([]);
        });
      else {
        setEditMode(false);
        setUpdatedQuestionPositions([]);
      }
    },
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = fields.findIndex(s => s.questionId === active.id);
    const to = fields.findIndex(s => s.questionId === over.id);
    if (from === -1 || to === -1) return;
    const reorderedQuestions = getValues().questions.slice();
    const [reorderedQuestion] = reorderedQuestions.splice(from, 1);
    if (!reorderedQuestion) return;
    reorderedQuestions.splice(to, 0, reorderedQuestion);
    move(from, to);

    const changedPositions = reorderedQuestions.reduce<UpdatedQuestionPosition[]>((acc, question, index) => {
      const position = index + 1;
      if (question.position === position) return acc;

      if (question.id) {
        acc.push({ id: question.id, position });
        return acc;
      }

      const { id: _id, ...newQuestion } = question;
      acc.push({ ...newQuestion, position });
      return acc;
    }, []);
    setUpdatedQuestionPositions(changedPositions);
  };
  const handleEnterEditMode = () => {
    if (hasDirty(dirtyFields)) {
      addToast({
        title: "Warning Unsaved Change",
        description: "Save or discard change before entering edit mode",
        color: "warning",
      });
      return;
    }
    setEditMode(true);
  };
  useEffect(() => {
    setUpdatedQuestionPositions([]);
  }, [quizContent]);
  return {
    questionFieldIds,
    sidebarQuestions,
    editModeActionHandler,
    isEveryQuestionSelected,
    onDragEnd,
    isQuestionSelected,
    handleToggleAllQuestionSelection,
    handleToggleSelectQuestion,
    handleEnterEditMode,
    dirtyFields,
    selectedQuestion,
    sensors,
  };
}
