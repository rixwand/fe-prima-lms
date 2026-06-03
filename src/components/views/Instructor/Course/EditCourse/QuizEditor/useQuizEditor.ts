import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import useEditQuiz from "@/hooks/course/useEditQuiz";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { extractDirtyFields, hasDirty } from "@/libs/utils/rhf";
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { addToast, useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { LuCopyCheck, LuType } from "react-icons/lu";
import {
  ChoiceOption,
  IUpdateQuiz,
  Question,
  QuizEditorForm,
  QuizOption,
  RemoveQuestionParams,
} from "./QuizEditor.types";

export const quizTypeOptions: QuizOption[] = [
  {
    key: "multiple-choices",
    label: "Multiple Choices",
    icon: LuCopyCheck,
  },
  // {
  //   key: "fill-blank",
  //   label: "Fill in the Blank",
  //   icon: LuPencilLine,
  // },
];

export const choicesTypeOptions: ChoiceOption[] = [
  {
    key: "text",
    label: "Text",
    icon: LuType,
  },
  // {
  //   key: "code",
  //   label: "Code",
  //   icon: LuCodeXml,
  // },
  // {
  //   key: "image",
  //   label: "Image",
  //   icon: LuImage,
  // },
];

export const getDefaultQuestion = (position: number): Question => ({
  quizType: "multiple-choices",
  choiceType: "text",
  question: "",
  multipleAnswer: false,
  options: [],
  durationMins: 2,
  points: 5,
  position,
});

const defaultValues: QuizEditorForm = {
  questions: [],
};

type UpdatedQuestionPosition = { id: number; position: number } | Omit<Question, "id">;

export default function useQuizEditor() {
  const { ids: idsPath } = useLessonEditorContext();
  const { quizContent, updateQuiz, publishQuiz, deleteQuestion, deleteManyQuestion } = useEditQuiz({
    idsPath: idsPath!,
  });
  const methods = useForm<QuizEditorForm>({
    defaultValues,
  });
  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { dirtyFields },
  } = methods;
  const {
    fields: questions,
    append,
    move: moveQuestion,
    update: updateQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });
  const watchedQuestions = useWatch({ control, name: "questions" });
  const drawerState = useDisclosure();
  const visibilityState = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [updatedQuestionPositions, setUpdatedQuestionPositions] = useState<UpdatedQuestionPosition[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Set<number>>(new Set());
  const sidebarQuestions = useMemo(
    () =>
      questions.map((question, index) => ({
        id: question.fieldId,
        title: watchedQuestions?.[index]?.question?.trim() || `Question ${index + 1}`,
        quizType: watchedQuestions?.[index]?.quizType || "multiple-choices",
      })),
    [questions, watchedQuestions],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ids = useMemo(() => questions.map(s => s.fieldId!), [questions]);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = questions.findIndex(s => s.fieldId === active.id);
    const to = questions.findIndex(s => s.fieldId === over.id);
    if (from === -1 || to === -1) return;
    const reorderedQuestions = getValues().questions.slice();
    const [reorderedQuestion] = reorderedQuestions.splice(from, 1);
    if (!reorderedQuestion) return;
    reorderedQuestions.splice(to, 0, reorderedQuestion);
    moveQuestion(from, to);

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

  const restoreQuiz = (quiz?: IQuiz) =>
    reset({
      questions: quiz?.questions.map(({ estimatedTimesSecond, ...q }) => ({
        ...q,
        options: q.options.map(o => ({ value: o.value, isCorrect: o.isCorrect })),
        durationMins: estimatedTimesSecond / 60,
      })),
    });

  useEffect(() => {
    restoreQuiz(quizContent);
    setUpdatedQuestionPositions([]);
  }, [quizContent]);

  // Handler
  const executeUpdateAndPublishQuiz = async () => {
    try {
      if (hasDirty(dirtyFields)) {
        const valid = await trigger();
        if (!valid) return;
        const questions = extractDirtyFields(getValues().questions, dirtyFields.questions!);
        console.log(dirtyFields.questions);
        console.log(questions);
        const quizUpdate = {
          questions: questions?.map(q => ({
            // options: q.options?.map(({ value, isCorrect }) => ({ name: "fak", isCorrect })),
            ...q,
            ...(q.durationMins && {
              estimatedTimesSecond: q.durationMins * 60,
            }),
          })),
        } satisfies IUpdateQuiz;
        publishQuiz(quizUpdate);
      } else {
        publishQuiz(undefined);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDiscardChanges = (onConfirmed: () => void) =>
    confirmDialog({
      title: "Discard changes?",
      desc: "Unsaved quiz changes will be lost.",
      isDestructive: true,
      confirmLabel: "Discard",
      onConfirmed,
    });

  const editModeActionHandler = {
    save: () => {
      if (updatedQuestionPositions.length > 0) updateQuiz({ questions: updatedQuestionPositions });
      setEditMode(false);
    },
    restore: () => {
      confirmDiscardChanges(() => {
        restoreQuiz(quizContent);
        setUpdatedQuestionPositions([]);
      });
    },
    deleteMany: () => {},
    discard: () => {
      confirmDiscardChanges(() => {
        restoreQuiz(quizContent);
        setEditMode(false);
        setUpdatedQuestionPositions([]);
      });
    },
  };

  const handleRestoreQuiz = () => confirmDiscardChanges(() => restoreQuiz(quizContent));

  const handleSaveQuiz = async () => {
    try {
      const valid = await trigger();
      if (!valid) return;
      const questions = extractDirtyFields(getValues().questions, dirtyFields.questions!);
      console.log(dirtyFields.questions);
      console.log(questions);
      const quizUpdate = {
        questions: questions?.map(q => ({
          ...q,
          ...(q.durationMins && {
            estimatedTimesSecond: q.durationMins * 60,
          }),
        })),
      } satisfies IUpdateQuiz;
      updateQuiz(quizUpdate);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateAndPublishQuiz = () =>
    confirmDialog({
      title: hasDirty(dirtyFields) ? "Save and publish quiz?" : "Publish quiz?",
      desc: hasDirty(dirtyFields)
        ? "Your quiz changes will be saved and published for learners."
        : "The current quiz draft will be published for learners.",
      confirmLabel: hasDirty(dirtyFields) ? "Save & Publish" : "Publish",
      onConfirmed: executeUpdateAndPublishQuiz,
    });

  const handleDeleteQuestion = ({ fieldId, id }: RemoveQuestionParams) => {
    confirmDialog({
      title: "Delete question?",
      desc: "This question will be removed from the quiz.",
      isDestructive: true,
      confirmLabel: "Delete",
      onConfirmed: () => {
        if (id) deleteQuestion(id);
        else removeQuestion(questions.findIndex(q => q.fieldId == fieldId));
      },
    });
  };

  const handleAddQuestion = () => {
    append(getDefaultQuestion(watchedQuestions.length + 1));
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
  return {
    choicesTypeOptions,
    questions,
    quizTypeOptions,
    sidebarQuestions,
    handleAddQuestion,
    sensors,
    onDragEnd,
    ids,
    handleSaveQuiz,
    methods,
    defaultQuiz: quizContent,
    updateQuestion,
    handleUpdateAndPublishQuiz,
    editModeActionHandler,
    drawerState,
    visibilityState,
    isEditMode,
    updatedQuestionPositions,
    handleEnterEditMode,
    handleDeleteQuestion,
    handleRestoreQuiz,
  };
}
