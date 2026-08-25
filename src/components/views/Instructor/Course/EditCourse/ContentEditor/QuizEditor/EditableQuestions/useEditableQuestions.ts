import useEditQuiz from "@/hooks/course/useEditQuiz";
import { useLessonEditorContext } from "@/libs/context/LessonEditorContext";
import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { QuizQuestionFieldArray, RemoveQuestionParams } from "../QuizEditor.types";

export default function useEditableQuestions({ remove, fields }: QuizQuestionFieldArray) {
  const { ids: idsPath } = useLessonEditorContext();
  const { deleteQuestion, quizContent } = useEditQuiz({
    idsPath: idsPath!,
  });

  const handleDeleteQuestion = ({ questionId, id }: RemoveQuestionParams) => {
    confirmDialog({
      title: "Delete question?",
      desc: "This question will be removed from the quiz.",
      isDestructive: true,
      confirmLabel: "Delete",
      onConfirmed: () => {
        if (id) deleteQuestion(id);
        else remove(fields.findIndex(q => q.questionId == questionId));
      },
    });
  };

  return { handleDeleteQuestion, quizContent };
}
