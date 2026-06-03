import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Alert, Button, Divider, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayUpdate,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
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
import { QuizEditorForm } from "../QuizEditor.types";
import AnswerItem from "./OptionItem";
import useQuestion from "./useQuestion";

const QuestionItem = ({
  control,
  register,
  setValue,
  question,
  idx,
  defaultQuestion,
  updateQuestion,
  isEditMode,
  removeQuestion,
}: {
  control: Control<QuizEditorForm>;
  register: UseFormRegister<QuizEditorForm>;
  setValue: UseFormSetValue<QuizEditorForm>;
  question: FieldArrayWithId<QuizEditorForm, "questions", "fieldId">;
  defaultQuestion: IQuizQuestion;
  idx: number;
  updateQuestion: UseFieldArrayUpdate<QuizEditorForm, "questions">;
  isEditMode: boolean;
  removeQuestion: (props: { fieldId: string }) => void;
}) => {
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

  // (Object.keys(watch(`questions.${idx}`) ?? {}) as (keyof Question)[]).some(key =>
  //   hasDirty(dirtyFields.questions?.[idx]?.[key]),
  // );

  // register(`questions.${idx}.options`, );

  return (
    <div className="flex gap-x-2 w-full" id={`${question.fieldId}`}>
      <div className="p-5 rounded-lg shadow-sm border-gray-200 border-1 space-y-5 w-full text-start">
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
          <Button
            className="reset-button p-1.5 border border-gray-200 shadow-sm rounded-md"
            radius="none"
            isIconOnly
            variant="light">
            <LuEllipsis size={18} />
          </Button>
        </div>
        <Divider />
        <div className="flex justify-between -mb-1 px-1">
          <span className="flex gap-x-1">
            <LuMessageCircleQuestion size={20} />
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
          rules={{ required: "Please input question", minLength: { message: "min 20 character", value: 20 } }}
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
            return error?.root?.message ? <Alert color="danger" title={error.root.message} variant="flat" /> : <></>;
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
          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm" htmlFor="quiz-time">
              Estimated times
            </label>
            <span className="flex py-1.5 rounded-md border border-gray-100 bg-gray-100">
              <input
                id="quiz-time"
                type="number"
                {...register(`questions.${idx}.durationMins` as const, { valueAsNumber: true, min: 0 })}
                className="w-[4.5rem] bg-transparent px-3 font-medium text-gray-800 outline-none"
              />
              <Divider orientation="vertical" />
              <div className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                <span className="text-gray-700">Mins</span>
                <LuTimer size={17} />
              </div>
            </span>
          </div>
          <div className="flex flex-col gap-y-1.5">
            <label className="text-sm" htmlFor="quiz-point">
              Mark as point
            </label>
            <span className="flex py-1.5 rounded-md border border-gray-100 bg-gray-100">
              <input
                id="quiz-point"
                type="number"
                {...register(`questions.${idx}.points` as const, { valueAsNumber: true, min: 0 })}
                className="w-[4.5rem] bg-transparent px-3 font-medium text-gray-800 outline-none"
              />
              <Divider orientation="vertical" />
              <div className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                <span className="text-gray-700">Points</span>
                <CgEditBlackPoint size={18} />
              </div>
            </span>
          </div>
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
                  onPress={() => removeQuestion({ fieldId: question.fieldId })}
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
