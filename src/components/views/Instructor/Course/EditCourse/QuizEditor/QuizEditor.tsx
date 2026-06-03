import { MySwitch } from "@/components/commons/CustomHeroui/MySwitch";
import NormalCkbox from "@/components/commons/NormalCkbox";
import cn from "@/libs/utils/cn";
import { hasDirty } from "@/libs/utils/rhf";
import { StateType } from "@/types/Helper";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Tooltip } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { CSSProperties, Fragment } from "react";
import { FormProvider } from "react-hook-form";
import {
  LuAlignRight,
  LuBookmark,
  LuCheckCheck,
  LuChevronsRight,
  LuCloudUpload,
  LuCopyCheck,
  LuEllipsis,
  LuGlobe,
  LuGripVertical,
  LuPencil,
  LuPlus,
  LuSave,
  LuTrash2,
  LuUndo2,
  LuX,
} from "react-icons/lu";
import QuestionItem from "./QuestionItem";
import PublishedQuestionItem from "./QuestionItem/PublishedQuestion";
import { QuizTypeKey } from "./QuizEditor.types";
import QuizEditorPopover from "./QuizEditorPopover";
import useQuizEditor from "./useQuizEditor";

export default function QuizEditor() {
  const {
    methods,
    methods: {
      control,
      register,
      setValue,
      formState: { dirtyFields },
    },
    sidebarQuestions,
    questions,
    ids,
    sensors,
    onDragEnd,
    defaultQuiz,
    updateQuestion,
    editModeActionHandler: { deleteMany, discard, restore, save },
    drawerState: { isOpen, onClose, onOpen },
    visibilityState: [showPublished, setShowPublished],
    isEditMode,
    updatedQuestionPositions,
    handleAddQuestion,
    handleEnterEditMode,
    handleDeleteQuestion,
    handleSaveQuiz,
    handleUpdateAndPublishQuiz,
    handleRestoreQuiz,
  } = useQuizEditor();

  return (
    <FormProvider {...methods}>
      <div className="grid @5xl:grid-cols-[1fr_400px] text-slate-700 gap-x-6">
        <div className="text-center space-y-6 relative">
          <div className="sticky top-28 z-10 -mt-2 flex justify-between border-b-1 border-gray-200 bg-white/95 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-white/80 px-3">
            <span className="flex items-center gap-x-3 ">
              <SwitchMode state={[showPublished, setShowPublished]} />
            </span>
            <span className="flex items-center gap-x-2">
              <Button
                onPress={handleUpdateAndPublishQuiz}
                // isIconOnly
                isDisabled={isEditMode}
                radius="none"
                color="success"
                variant="flat"
                startContent={hasDirty(dirtyFields) ? <LuCloudUpload /> : <LuGlobe />}
                className="reset-button bouncy-button px-3 py-2 rounded-lg">
                {hasDirty(dirtyFields) && !isEditMode ? "Save & Publish" : "Publish"}
              </Button>
              <Button
                onPress={handleRestoreQuiz}
                // isIconOnly
                isDisabled={!hasDirty(dirtyFields)}
                radius="none"
                color="danger"
                variant="flat"
                startContent={<LuUndo2 />}
                className="reset-button bouncy-button px-3 py-2 rounded-lg">
                Restore
              </Button>
              <Button
                onPress={handleSaveQuiz}
                // isIconOnly
                isDisabled={!hasDirty(dirtyFields) || isEditMode}
                radius="none"
                color="primary"
                variant="flat"
                startContent={<LuSave />}
                className="reset-button bouncy-button px-3 py-2 rounded-lg">
                Save
              </Button>
            </span>
          </div>
          {showPublished && defaultQuiz?.publishedData ? (
            defaultQuiz.publishedData.questions.map((q, i) => <PublishedQuestionItem question={q} idx={i} key={i} />)
          ) : (
            <Fragment>
              {questions.map((question, idx) => (
                <QuestionItem
                  key={question.fieldId}
                  control={control}
                  register={register}
                  setValue={setValue}
                  idx={idx}
                  question={question}
                  updateQuestion={updateQuestion}
                  defaultQuestion={defaultQuiz?.questions[idx]!}
                  isEditMode={isEditMode}
                  removeQuestion={handleDeleteQuestion}
                />
              ))}
              {!isEditMode && (
                <Button
                  onPress={handleAddQuestion}
                  className="reset-button bouncy-button border-1.5 border-dashed border-gray-500 px-3 py-2 rounded-md text-slate-700"
                  startContent={<LuPlus className="mr-2" />}
                  isIconOnly
                  variant="light"
                  disableRipple
                  radius="none">
                  Add New Question
                </Button>
              )}
            </Fragment>
          )}
        </div>
        <button
          onClick={onOpen}
          className={cn([
            isOpen ? "translate-x-12" : "translate-x-0",
            "absolute @5xl:hidden cursor-pointer delay-700 duration-300 transition-transform top-28 bg-primary pl-3 pr-2 rounded-l-full py-2 right-0 z-20 ",
          ])}>
          <LuAlignRight className="text-xl text-white" />
        </button>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <aside className="@5xl:flex hidden">
            <div
              className={cn([
                "h-[calc(100svh-140px)] overflow-y-scroll overflow-x-hidden @5xl:sticky top-28 right-4",
                `flex flex-col gap-4 border rounded-xl shadow-sm w-full p-3`,
                isEditMode ? "border-blue-300 bg-white-50 shadow-blue-200" : "border-gray-300 bg-gray-50",
              ])}>
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
                  <Button
                    isDisabled={updatedQuestionPositions.length == 0}
                    onPress={() => console.log(updatedQuestionPositions)}
                    isIconOnly
                    radius="sm"
                    color="primary"
                    variant="flat"
                    disableRipple
                    className="reset-button bouncy-button p-1.5">
                    <LuCloudUpload size={18} />
                  </Button>
                  {isEditMode && <NormalCkbox size="md" className="-m-2" />}
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

              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {questions.map((question, idx) => (
                  <SidebarQuestions
                    key={question.fieldId}
                    {...{
                      question: {
                        id: question.fieldId,
                        title: sidebarQuestions[idx].title,
                        quizType: sidebarQuestions[idx].quizType,
                      },
                      idx,
                      isEditMode,
                      onRemoveQuestion() {
                        question.id
                          ? handleDeleteQuestion({ id: question.id })
                          : handleDeleteQuestion({ fieldId: question.fieldId });
                      },
                    }}
                  />
                ))}
              </SortableContext>
            </div>
          </aside>
        </DndContext>
        <Drawer
          classNames={{
            base: "sm:data-[placement=right]:m-2 sm:data-[placement=left]:m-2  rounded-medium",
          }}
          backdrop="transparent"
          className="@5xl:hidden"
          size="xs"
          isOpen={isOpen}
          onClose={onClose}>
          <DrawerContent className="bg-gray-50">
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
              <Tooltip content="Close">
                <Button
                  isIconOnly
                  className="text-default-400 reset-button p-1"
                  size="sm"
                  variant="light"
                  onPress={onClose}>
                  <LuChevronsRight size={20} />
                </Button>
              </Tooltip>
              <h3 className="font-semibold mr-3">Question Lists</h3>
            </DrawerHeader>
            <DrawerBody className="pt-[3.75rem] px-3">
              {questions.map((question, idx) => (
                <SidebarQuestions
                  key={question.fieldId}
                  {...{
                    question: {
                      id: question.fieldId,
                      title: sidebarQuestions[idx].title,
                      quizType: sidebarQuestions[idx].quizType,
                    },
                    idx,
                    isEditMode,
                    onRemoveQuestion() {
                      question.id
                        ? handleDeleteQuestion({ id: question.id })
                        : handleDeleteQuestion({ fieldId: question.fieldId });
                    },
                  }}
                />
              ))}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </FormProvider>
  );
}

const SidebarQuestions = ({
  question,
  isEditMode,
  idx,
  onRemoveQuestion,
}: {
  question: {
    id: string;
    title: string;
    quizType: QuizTypeKey;
  };
  idx: number;
  isEditMode: boolean;
  onRemoveQuestion: () => void;
}) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: question.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as CSSProperties;
  const menuState = useOverlayTriggerState({ defaultOpen: false });
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode && { ...listeners, attributes })}
      // href={`#${question.fieldId}`}
      // onClick={() => document.location.href}
      className={`w-full rounded-2xl border p-4 text-left transition-colors border-zinc-200 bg-white hover:bg-gray-50 hover:border-zinc-300 cursor-pointer inline-block`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <NormalCkbox size="md" className="-m-2" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600">
              {idx + 1}
            </div>
          )}
          <p className="line-clamp-1 text-sm font-medium">{question.title}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-x-2 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
          <LuCopyCheck />
          <p>{question.quizType === "fill-blank" ? "Fill in the blank" : "Multiple choices"}</p>
        </span>
        {!isEditMode ? (
          <QuizEditorPopover menuState={menuState} onRemoveQuestion={onRemoveQuestion}>
            <Button className="reset-button p-1.5 bouncy-button" radius="sm" isIconOnly variant="light" disableRipple>
              <LuEllipsis size={16} />
            </Button>
          </QuizEditorPopover>
        ) : (
          <button
            className="rounded-full p-1.5 h-fit mt-1 cursor-grab active:cursor-grabbing"
            // {...{ ...listeners, ...attributes }}
          >
            <LuGripVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
const SwitchMode = ({ state: [showPublished, setShowPublished] }: { state: StateType<boolean> }) => (
  <span className={cn("flex items-center gap-x-1.5 py-1 px-1.5 rounded-full")}>
    <MySwitch
      classNames={{ wrapper: cn(showPublished ? "bg-success" : "bg-primary", "transition-background") }}
      color="white"
      defaultSelected
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <LuGlobe
            {...{
              className: cn([className, "text-success"]),
            }}
          />
        ) : (
          <LuBookmark
            {...{
              className: cn([className, "text-primary"]),
            }}
          />
        )
      }
      isSelected={showPublished}
      onValueChange={setShowPublished}
      endContent={<LuGlobe color="white" />}
      size="md"
      startContent={<LuBookmark color="white" />}
    />
    <p className="text-slate-700 text-sm mr-2 ml-1 text-nowrap">{showPublished ? "Live Content" : "Draft Content"}</p>
  </span>
);
