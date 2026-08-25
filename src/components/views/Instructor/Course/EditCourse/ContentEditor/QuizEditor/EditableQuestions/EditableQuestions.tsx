import { useEditModeContext } from "@/libs/context/EditModeContext";
import { QuizQuestionFieldArray } from "../QuizEditor.types";
import QuestionItem from "./QuestionItem";
import useEditableQuestions from "./useEditableQuestions";

export default function EditableQuestions({
  fieldArray: { fields, update },
  fieldArray,
}: {
  fieldArray: QuizQuestionFieldArray;
}) {
  const { handleDeleteQuestion, quizContent } = useEditableQuestions(fieldArray);
  const { isEditMode } = useEditModeContext();
  return fields.map((question, idx) => (
    <QuestionItem
      key={question.questionId}
      idx={idx}
      question={question}
      updateQuestion={update}
      defaultQuestion={quizContent?.questions[idx]!}
      isEditMode={isEditMode}
      removeQuestion={handleDeleteQuestion}
      popoverHandleRemoveQuestion={() =>
        question.id
          ? handleDeleteQuestion({ id: question.id })
          : handleDeleteQuestion({ questionId: question.questionId })
      }
    />
  ));
}
