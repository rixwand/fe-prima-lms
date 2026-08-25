import SimpleAlert from "@/components/commons/Alert/SimpleAlert";
import cn from "@/libs/utils/cn";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Divider, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { Controller, FieldArrayWithId, UseFieldArrayUpdate, useFormContext } from "react-hook-form";
import { CgEditBlackPoint } from "react-icons/cg";
import {
  LuCodeXml,
  LuEllipsis,
  LuImage,
  LuMessageCircleQuestion,
  LuPlus,
  LuTimer,
  LuTrash2,
  LuUndo2,
} from "react-icons/lu";
import { QuizEditorForm } from "../../QuizEditor.types";
import QuizEditorPopover from "../../QuizEditorPopover";
import AnswerItem from "./OptionItem";
import useQuestion from "./useQuestion";

const QuestionItem = ({
  question,
  idx,
  defaultQuestion,
  updateQuestion,
  isEditMode,
  removeQuestion,
  popoverHandleRemoveQuestion,
}: {
  question: FieldArrayWithId<QuizEditorForm, "questions", "questionId">;
  defaultQuestion: IQuizQuestion;
  idx: number;
  updateQuestion: UseFieldArrayUpdate<QuizEditorForm, "questions">;
  isEditMode: boolean;
  removeQuestion: (props: { questionId: string }) => void;
  popoverHandleRemoveQuestion: () => void;
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QuizEditorForm>();
  const {
    options,
    quizTypeOptions,
    choicesTypeOptions,
    selectedQuizType,
    selectedChoicesType,
    setQuizTypeFromSelection,
    setChoicesTypeFromSelection,
    appendOption,
    ids,
    onDragEnd,
    sensors,
    onMarkCorrectAnswer,
    removeOption,
    restore,
    isDirty,
  } = useQuestion({
    control,
    setValue,
    questionIndex: idx,
    defaultQuestion,
    updateQuestion,
  });
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  return (
    <div className="flex gap-x-2 w-full" id={`${question.questionId}`}>
      <div
        className={cn(
          "p-5 rounded-lg shadow-sm border-1 space-y-5 w-full text-start",
          errors.questions?.[idx] ? "border-danger" : "border-gray-200",
        )}>
        <div className="flex justify-between">
          <Select
            aria-label="Question type"
            size="sm"
            items={quizTypeOptions}
            radius="none"
            className="w-44 h-fit"
            selectedKeys={selectedQuizType ? [selectedQuizType] : undefined}
            onSelectionChange={setQuizTypeFromSelection}
            classNames={{ trigger: "rounded-md" }}
            renderValue={items =>
              items.map(({ data, key }) =>
                data ? (
                  <span key={key} className="flex items-center gap-x-1 text-slate-700">
                    <data.icon size={16} />
                    {data.label}
                  </span>
                ) : null,
              )
            }>
            {({ icon: Icon, key, label }) => (
              <SelectItem aria-label={label} key={key}>
                <span className="flex items-center gap-x-1 text-slate-700">
                  <Icon size={16} />
                  {label}
                </span>
              </SelectItem>
            )}
          </Select>
          <QuizEditorPopover menuState={menuState} onRemoveQuestion={popoverHandleRemoveQuestion}>
            <Button
              className="reset-button p-1.5 border border-gray-200 shadow-sm rounded-md"
              radius="none"
              isIconOnly
              variant="light">
              <LuEllipsis size={18} />
            </Button>
          </QuizEditorPopover>
        </div>
        <Divider />
        <div className="flex justify-between -mb-1 px-1">
          <span className="flex gap-x-1">
            <LuMessageCircleQuestion size={20} className="text-primary" />
            <h2>Question {idx + 1}</h2>
          </span>
          <span className="flex gap-x-2">
            <Button
              className="reset-button p-1 text-slate-700 bouncy-button data-[hover=true]:bg-transparent"
              disableRipple
              radius="none"
              isIconOnly
              variant="light">
              <LuImage size={20} />
            </Button>
            <Button
              className="reset-button p-1 bouncy-button data-[hover=true]:bg-transparent text-slate-700"
              disableRipple
              radius="none"
              isIconOnly
              variant="light">
              <LuCodeXml size={20} />
            </Button>
          </span>
        </div>
        <Controller
          control={control}
          name={`questions.${idx}.question` as const}
          rules={{ required: "Please input question", minLength: { message: "min 10 character", value: 10 } }}
          render={({ field, fieldState: { error } }) => (
            <Textarea
              errorMessage={error?.message}
              isInvalid={!!error?.message}
              disableAnimation
              disableAutosize
              value={field.value}
              onValueChange={field.onChange}
              classNames={{
                base: "max-w-full",
                input: "resize-y min-h-3/4 py-2",
              }}
              labelPlacement="outside-top"
              label={<></>}
              placeholder="Enter your description"
              variant="flat"
              radius="sm"
            />
          )}
        />
        <div className="flex gap-x-4 px-1 items-center h-8">
          <p>Choices</p>
          <Divider orientation="vertical" />
          <Select
            aria-label="Choices type"
            size="sm"
            items={choicesTypeOptions}
            radius="none"
            className="w-24 h-fit"
            selectedKeys={selectedChoicesType ? [selectedChoicesType] : undefined}
            onSelectionChange={setChoicesTypeFromSelection}
            classNames={{ trigger: "rounded-md", popoverContent: "p-px  rounded-md" }}
            renderValue={items =>
              items.map(({ data, key }) =>
                data ? (
                  <span key={key} className="flex items-center gap-x-1 text-slate-700">
                    <data.icon size={16} />
                    {data.label}
                  </span>
                ) : null,
              )
            }>
            {({ icon: Icon, key, label }) => (
              <SelectItem aria-label={label} key={key}>
                <span className="flex items-center gap-x-1 text-slate-700">
                  <Icon size={16} />
                  {label}
                </span>
              </SelectItem>
            )}
          </Select>
          <Controller
            control={control}
            name={`questions.${idx}.multipleAnswer` as const}
            render={({ field }) => (
              <Switch
                classNames={{ label: "text-slate-700" }}
                size="sm"
                isSelected={field.value}
                onValueChange={field.onChange}>
                Multiple Answer
              </Switch>
            )}
          />
        </div>
        <div className="space-y-2">
          <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              {options.map((option, index) => (
                <AnswerItem
                  onMarkCorrectAnswer={onMarkCorrectAnswer}
                  key={option.fieldId}
                  option={option}
                  questionIdx={idx}
                  optionIdx={index}
                  control={control}
                  removeOption={removeOption}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Controller
          name={`questions.${idx}.options`}
          control={control}
          rules={{
            validate: {
              minOptions: value => value?.length >= 2 || "Add minimal 2 answer options",
              maxOptions: value => value?.length <= 5 || "Maximal 5 answer options",
              correctAnswer: value => value.some(v => v.isCorrect == true) || "Please pick the correct answer",
            },
          }}
          render={({ fieldState: { error } }) => {
            return error?.root?.message ? <SimpleAlert>{error.root.message}</SimpleAlert> : <></>;
          }}
        />
        <Button
          onPress={appendOption}
          className="reset-button bouncy-button border-1.5 border-dashed border-gray-500 px-3 py-2 rounded-md text-gray-700"
          startContent={<LuPlus className="mr-2" />}
          isIconOnly
          variant="light"
          disableRipple
          radius="none">
          Add Answer
        </Button>
        <Divider />
        <div className="flex gap-x-5">
          <Controller
            control={control}
            name={`questions.${idx}.durationMins`}
            rules={{ min: { value: 1, message: "Minimal 1 minutes" } }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm" htmlFor="quiz-time">
                  Estimated times
                </label>
                <span
                  className={cn(
                    "flex py-1.5 rounded-md border ",
                    error ? "border-danger-100 bg-danger-50" : "border-gray-200 bg-gray-100",
                  )}>
                  <input
                    id="quiz-time"
                    type="number"
                    value={value}
                    onChange={onChange}
                    className={cn(
                      "w-[4.5rem] bg-transparent px-3 font-medium outline-none",
                      error ? "text-danger" : "text-slate-700",
                    )}
                  />
                  <Divider orientation="vertical" />
                  <div className="flex flex-1 items-center justify-between pl-3 pr-2.5 gap-x-2">
                    <span className={cn(error ? "text-danger" : "text-slate-700")}>Mins</span>
                    <LuTimer size={17} className={error ? "text-danger-500" : "text-gray-500"} />
                  </div>
                </span>
                {error && <p className="text-xs text-danger ml-0.5 -mt-0.5">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            control={control}
            name={`questions.${idx}.points`}
            rules={{
              min: { value: 5, message: "Minimal 5 point" },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm" htmlFor="quiz-point">
                  Mark as point
                </label>
                <span
                  className={cn(
                    "flex py-1.5 rounded-md border ",
                    error ? "border-danger-100 bg-danger-50" : "border-gray-200 bg-gray-100",
                  )}>
                  <input
                    id="quiz-point"
                    type="number"
                    value={value}
                    onChange={onChange}
                    className={cn(
                      "w-[4.5rem] bg-transparent px-3 font-medium outline-none",
                      error ? "text-danger" : "text-slate-700",
                    )}
                  />
                  <Divider orientation="vertical" />
                  <div className="flex flex-1 items-center justify-between pl-3 pr-2.5 gap-x-2">
                    <span className={cn(error ? "text-danger" : "text-slate-700")}>Points</span>
                    <CgEditBlackPoint size={18} className={error ? "text-danger-500" : "text-gray-500"} />
                  </div>
                </span>
                {error && <p className="text-xs text-danger ml-0.5 -mt-0.5">{error.message}</p>}
              </div>
            )}
          />

          <div className="ml-auto mt-auto flex gap-x-3">
            {isDirty &&
              !isEditMode &&
              (question.id ? (
                <Button
                  startContent={<LuUndo2 />}
                  variant="flat"
                  onPress={restore}
                  isDisabled={!isDirty}
                  radius="sm"
                  className="reset-button px-3 py-2"
                  color="danger">
                  Restore
                </Button>
              ) : (
                <Button
                  startContent={<LuTrash2 />}
                  variant="flat"
                  onPress={() => removeQuestion({ questionId: question.questionId })}
                  isDisabled={!isDirty}
                  radius="sm"
                  className="reset-button px-3 py-2"
                  color="danger">
                  Remove
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
