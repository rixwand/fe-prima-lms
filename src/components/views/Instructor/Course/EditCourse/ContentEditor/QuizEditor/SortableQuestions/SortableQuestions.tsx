import NormalCkbox from "@/components/commons/NormalCkbox";
import { useEditModeContext } from "@/libs/context/EditModeContext";
import { hasDirty } from "@/libs/utils/rhf";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@heroui/react";
import { Fragment } from "react";
import { LuCheckCheck, LuPencil, LuTrash2, LuUndo2, LuX } from "react-icons/lu";
import useEditableQuestions from "../EditableQuestions/useEditableQuestions";
import { QuizQuestionFieldArray } from "../QuizEditor.types";
import SortableQuestionItems from "./SortableQuestionItem";
import useSortableQuestion from "./useSortableQuestion";

const SortableQuestions = ({ fieldArray: { fields }, fieldArray }: { fieldArray: QuizQuestionFieldArray }) => {
  const { handleDeleteQuestion } = useEditableQuestions(fieldArray);
  const {
    questionFieldIds,
    sidebarQuestions,
    isQuestionSelected,
    handleToggleSelectQuestion,
    onDragEnd,
    sensors,
    editModeActionHandler: { save, deleteMany, discard, restore },
    handleEnterEditMode,
    handleToggleAllQuestionSelection,
    isEveryQuestionSelected,
    dirtyFields,
    selectedQuestion,
  } = useSortableQuestion(fieldArray);
  const { isEditMode } = useEditModeContext();
  return sidebarQuestions.length == 0 ? (
    <p className="self-center my-auto text-slate-500">No Questions Found</p>
  ) : (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="sticky top-0 right-2 left-3 rounded-xl border border-blue-200 py-1.5 px-2 flex items-center bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 justify-between">
        <div className="flex gap-x-2 items-center">
          <Button
            onPress={isEditMode ? save : handleEnterEditMode}
            isIconOnly
            radius="sm"
            {...(isEditMode
              ? {
                  color: "success",
                  variant: "flat",
                }
              : {
                  color: "primary",
                  variant: "light",
                })}
            disableRipple
            className="reset-button bouncy-button p-1.5">
            {isEditMode ? <LuCheckCheck size={18} /> : <LuPencil size={18} />}
          </Button>
          {isEditMode && (
            <NormalCkbox
              onValueChange={handleToggleAllQuestionSelection}
              isSelected={isEveryQuestionSelected}
              size="md"
              className="-m-2"
            />
          )}
        </div>
        <div className="flex gap-x-3 items-center">
          {isEditMode && (
            <Fragment>
              <Button
                isDisabled={!hasDirty(dirtyFields)}
                onPress={restore}
                isIconOnly
                radius="sm"
                color="warning"
                variant="flat"
                disableRipple
                className="reset-button bouncy-button p-1.5">
                <LuUndo2 size={18} />
              </Button>
              <Button
                onPress={deleteMany}
                isIconOnly
                isDisabled={!(selectedQuestion.size > 0)}
                radius="sm"
                color="danger"
                variant="flat"
                disableRipple
                className="reset-button bouncy-button p-1.5">
                <LuTrash2 size={18} />
              </Button>
              <Button
                onPress={discard}
                isIconOnly
                radius="sm"
                color="danger"
                variant="flat"
                disableRipple
                className="reset-button bouncy-button p-1.5">
                <LuX size={18} />
              </Button>
            </Fragment>
          )}
        </div>
      </div>
      <SortableContext items={questionFieldIds} strategy={verticalListSortingStrategy}>
        {fields.map((question, idx) => (
          <SortableQuestionItems
            key={question.questionId}
            {...{
              question: {
                id: question.questionId,
                title: sidebarQuestions[idx].title,
                quizType: sidebarQuestions[idx].quizType,
              },
              idx,
              isEditMode,
              onRemoveQuestion() {
                question.id
                  ? handleDeleteQuestion({ id: question.id })
                  : handleDeleteQuestion({ questionId: question.questionId });
              },
              isSelected: isQuestionSelected(question.id!),
              handleToggleSelect: () => handleToggleSelectQuestion(question.id!),
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
export default SortableQuestions;
