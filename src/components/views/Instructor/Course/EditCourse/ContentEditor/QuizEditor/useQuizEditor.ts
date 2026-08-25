import useEditQuiz from "@/hooks/course/useEditQuiz";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { extractDirtyFields, hasDirty } from "@/libs/utils/rhf";
import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { UseFormReset, useFieldArray, useForm, useWatch } from "react-hook-form";
import { LuCopyCheck, LuType } from "react-icons/lu";
import { ChoiceOption, IUpdateQuiz, Question, QuizEditorForm, QuizOption } from "./QuizEditor.types";

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
  topics: [],
  description: "",
  passingScorePercent: 80,
};

export default function useQuizEditor() {
  const { ids: idsPath } = useLessonEditorContext();
  const { quizContent, updateQuiz, publishQuiz } = useEditQuiz({
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
    formState: { dirtyFields, errors },
  } = methods;
  const questionFieldArray = useFieldArray({
    control,
    name: "questions",
    keyName: "questionId",
  });
  const { fields: questions, append: appendQuestion, update: updateQuestion } = questionFieldArray;

  const {
    fields: topics,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "topics",
    keyName: "topicId",
    rules: {
      validate: value => value?.length >= 1 || "Add minimal 1 topic",
    },
  });

  const watchedQuestions = useWatch({ control, name: "questions" });
  const drawerState = useDisclosure();
  const visibilityState = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [topicInput, setTopicInput] = useState("");

  const publishedTotalPoints = useMemo(
    () => quizContent?.publishedData?.questions.reduce((acc, curr) => acc + curr.points, 0) ?? 0,
    [quizContent],
  );

  useEffect(() => {
    restoreQuiz(reset, quizContent);
  }, [quizContent]);

  // Handler

  const handleAddTopic = () => {
    const name = topicInput.trim();
    if (name.length < 1) return; // i just add this line and it work idk why
    appendTopic({ name });
    setTopicInput("");
  };
  const handleRemoveTopic = (topicId: string) => removeTopic(topics.findIndex(v => v.topicId == topicId));

  const executeUpdateAndPublishQuiz = async () => {
    try {
      if (hasDirty(dirtyFields)) {
        const valid = await trigger();
        if (!valid) return;
        const questions = extractDirtyFields(getValues().questions, dirtyFields.questions!);
        const quizUpdate = {
          ...(dirtyFields.topics && { topics: getValues().topics.map(t => t.name) }),
          ...(dirtyFields.description == true && { description: getValues().description }),
          ...(dirtyFields.passingScorePercent == true && { passingScorePercent: getValues().passingScorePercent }),
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

  const handleRestoreQuiz = () => confirmDiscardChanges(() => restoreQuiz(reset, quizContent));

  const handleSaveQuiz = async () => {
    try {
      const valid = await trigger();
      if (!valid) return;
      const questions = extractDirtyFields(getValues().questions, dirtyFields.questions!);
      const quizUpdate = {
        ...(dirtyFields.topics && { topics: getValues().topics.map(t => t.name) }),
        ...(dirtyFields.description == true && { description: getValues().description }),
        ...(dirtyFields.passingScorePercent == true && { passingScorePercent: getValues().passingScorePercent }),
        questions: questions?.map(q => ({
          ...q,
          ...(q.durationMins && {
            estimatedTimesSecond: q.durationMins * 60,
          }),
        })),
      } satisfies IUpdateQuiz;
      console.log("update Quiz: ", quizUpdate);
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

  const handleAddQuestion = () => {
    appendQuestion(getDefaultQuestion(watchedQuestions.length + 1));
  };

  return {
    choicesTypeOptions,
    questions,
    quizTypeOptions,
    handleAddQuestion,
    handleSaveQuiz,
    methods,
    defaultQuiz: quizContent,
    updateQuestion,
    handleUpdateAndPublishQuiz,
    drawerState,
    visibilityState,
    isEditMode,
    handleRestoreQuiz,
    topics,
    handleAddTopic,
    handleRemoveTopic,
    topicInput,
    setTopicInput,
    topicsError: errors.topics?.root,
    setEditMode,
    questionFieldArray,
    publishedTotalPoints,
  };
}

export const restoreQuiz = (reset: UseFormReset<QuizEditorForm>, quiz?: IQuiz) =>
  reset({
    topics: quiz?.topics.map(name => ({ name })),
    passingScorePercent: quiz?.passingScorePercent,
    description: quiz?.description,
    questions: quiz?.questions.map(({ estimatedTimesSecond, ...q }) => ({
      ...q,
      options: q.options.map(o => ({ value: o.value, isCorrect: o.isCorrect })),
      durationMins: estimatedTimesSecond / 60,
    })),
  });

export const confirmDiscardChanges = (onConfirmed: () => void) =>
  confirmDialog({
    title: "Discard changes?",
    desc: "Unsaved quiz changes will be lost.",
    isDestructive: true,
    confirmLabel: "Discard",
    onConfirmed,
  });
