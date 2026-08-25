import { MySwitch } from "@/components/commons/CustomHeroui/MySwitch";
import { EditModeContext } from "@/libs/context/EditModeContext";
import cn from "@/libs/utils/cn";
import { hasDirty } from "@/libs/utils/rhf";
import { StateType } from "@/types/Helper";
import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  Slider,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { Fragment } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  LuAlignRight,
  LuBadgePercent,
  LuBookmark,
  LuChevronsRight,
  LuCloudUpload,
  LuCornerDownLeft,
  LuGlobe,
  LuPlus,
  LuSave,
  LuUndo2,
  LuX,
} from "react-icons/lu";
import EditableQuestions from "./EditableQuestions";
import PublishedQuestionItem from "./EditableQuestions/QuestionItem/PublishedQuestion";
import SortableQuestions from "./SortableQuestions";
import useQuizEditor from "./useQuizEditor";

export default function QuizEditor() {
  const {
    methods,
    methods: {
      control,
      formState: { dirtyFields },
    },
    defaultQuiz,
    drawerState: { isOpen, onClose, onOpen },
    visibilityState: [showPublished, setShowPublished],
    isEditMode,
    handleAddQuestion,
    handleSaveQuiz,
    handleUpdateAndPublishQuiz,
    handleRestoreQuiz,
    topics,
    handleAddTopic,
    handleRemoveTopic,
    topicInput,
    setTopicInput,
    topicsError,
    setEditMode,
    questionFieldArray,
    publishedTotalPoints,
  } = useQuizEditor();
  return (
    <FormProvider {...methods}>
      <EditModeContext.Provider value={{ isEditMode, setEditMode }}>
        <div className="grid @5xl:grid-cols-[1fr_400px] text-slate-700 gap-x-6">
          <div className="text-center space-y-6 relative @container">
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
                  startContent={<LuCloudUpload size={16} />}
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
              <Fragment>
                <Card shadow="sm" radius="sm" className="mb-6">
                  <CardBody className="gap-6 p-6">
                    <section>
                      <div className="mb-3 space-y-1 ">
                        <div className="flex items-center gap-x-1">
                          <HiOutlineDocumentText className="text-xl text-primary" />
                          <h3 className="font-semibold">Quiz Description</h3>
                        </div>
                        <p className="text-sm text-default-500">
                          This description will be shown before students start the quiz.
                        </p>
                      </div>
                      <Textarea
                        isDisabled
                        disableAnimation
                        disableAutosize
                        classNames={{
                          base: "max-w-full",
                          input: "resize-y min-h-24 py-2",
                          inputWrapper:
                            "border-medium data-[hover=true]:border-default-300 group-data-[focus=true]:border-default-300",
                        }}
                        labelPlacement="outside-top"
                        label={<></>}
                        placeholder="No Description"
                        variant="bordered"
                        radius="sm"
                        value={defaultQuiz.publishedData.description}
                      />
                    </section>
                  </CardBody>
                </Card>
                <div className="grid grid-cols-1 @4xl:grid-cols-12 gap-4">
                  <Card shadow="sm" radius="sm" className="@4xl:col-span-5">
                    <CardBody className="p-[1.10rem]">
                      <div>
                        <div className="space-y-1 -mb-1">
                          <div className="flex items-center gap-x-1">
                            <LuBadgePercent size={22} className="text-primary" />
                            <h3 className="font-semibold">Passing Score</h3>
                          </div>
                          <p className="text-sm text-default-500">
                            The minimum score percentage required to pass this quiz.
                          </p>
                          <div className="w-full flex px-2.5 gap-x-5 justify-around mt-2.5">
                            <CircularProgress
                              value={defaultQuiz.publishedData.passingScorePercent}
                              showValueLabel
                              classNames={{
                                svg: "w-28 h-28 drop-shadow-md",
                                indicator: "stroke-primary",
                                track: "stroke-primary-200/30",
                                value: "text-xl font-semibold text-slate-700",
                              }}
                            />
                            <div className="flex w-full flex-col gap-y-2.5 justify-center pr-2.5">
                              <span className="w-full flex justify-between">
                                <span className="text-slate-600">Total Points:</span>
                                <span className="text-slate-700 font-medium">{publishedTotalPoints}</span>
                              </span>
                              <span className="w-full flex justify-between">
                                <span className="text-slate-600">Passing Points: </span>
                                <span className="text-slate-700 font-medium">
                                  {Math.ceil(
                                    publishedTotalPoints * (defaultQuiz.publishedData.passingScorePercent / 100),
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card shadow="sm" radius="sm" className="@4xl:col-span-7">
                    <CardBody className="p-[1.10rem]">
                      <div>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-x-1">
                            <LuBookmark className="text-xl text-primary" />
                            <h3 className="font-semibold">Topics Covered</h3>
                          </div>
                          <p className="text-sm text-default-500">
                            The following topics will be covered and assessed in this quiz.
                          </p>
                        </div>
                      </div>
                      {defaultQuiz.publishedData.topics.length < 1 ? (
                        <span className="w-full h-full flex justify-center items-center">
                          <p className="text-sm text-slate-500">No Topics</p>
                        </span>
                      ) : (
                        <div className="flex gap-3 flex-wrap">
                          {topics.map(topic => (
                            <div
                              key={topic.topicId}
                              className="p-3 py-2.5 bg-primary-50 rounded-lg text-primary border border-primary-200 text-sm font-medium flex items-center gap-x-1.5 relative">
                              <span>{topic.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
                {defaultQuiz.publishedData.questions.map((q, i) => (
                  <PublishedQuestionItem question={q} idx={i} key={i} />
                ))}
              </Fragment>
            ) : (
              <Fragment>
                <Controller
                  control={control}
                  name="description"
                  rules={{
                    required: "Please input quiz description",
                    minLength: { message: "min 10 character", value: 20 },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Card shadow="sm" className={error && "border-danger border"} radius="sm">
                      <CardBody className="p-[1.10rem]">
                        <section>
                          <div className="mb-3 space-y-1 ">
                            <div className="flex items-center gap-x-1">
                              <HiOutlineDocumentText className="text-xl text-primary" />
                              <h3 className="font-semibold">Quiz Description</h3>
                            </div>
                            <p className="text-sm text-default-500">
                              This description will be shown before students start the quiz.
                            </p>
                          </div>
                          <Textarea
                            disableAnimation
                            disableAutosize
                            classNames={{
                              base: "max-w-full",
                              input: "resize-y min-h-24 py-2 font-medium text-slate-700",
                              inputWrapper:
                                "border-medium data-[hover=true]:border-default-300 group-data-[focus=true]:border-default-300",
                            }}
                            labelPlacement="outside-top"
                            label={<></>}
                            placeholder="Enter your description"
                            variant="bordered"
                            radius="sm"
                            onValueChange={onChange}
                            value={value}
                          />
                        </section>
                        {error && <p className="text-xs text-danger font-medium">{error.message}</p>}
                      </CardBody>
                    </Card>
                  )}
                />
                <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="passingScorePercent"
                    rules={{
                      min: { value: 50, message: "The minimum passing score 50% or above" },
                      max: { value: 100, message: "The passing score cannot higher than 100%" },
                    }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <Card className={error && "border border-danger"} shadow="sm" radius="sm">
                        <CardBody className="p-[1.10rem]">
                          <div>
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center gap-x-1">
                                <LuBadgePercent size={22} className="text-primary" />
                                <h3 className="font-semibold">Passing Score</h3>
                              </div>
                              <p className="text-sm text-default-500">
                                The minimum score percentage required to pass this quiz.
                              </p>
                            </div>
                            <span className="mt-3.5">
                              <Slider
                                className="max-w-md"
                                color="primary"
                                value={value}
                                onChange={onChange}
                                label="Score"
                                maxValue={100}
                                minValue={50}
                                showSteps={true}
                                size="md"
                                step={5}
                                renderValue={({ children }) => <>{children}%</>}
                              />
                            </span>
                          </div>
                          {error && <p className="text-xs text-danger font-medium">{error.message}</p>}
                        </CardBody>
                      </Card>
                    )}
                  />

                  <Card className={topicsError && "border border-danger"} shadow="sm" radius="sm">
                    <CardBody className="p-[1.10rem]">
                      <div>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-x-1">
                            <LuBookmark className="text-xl text-primary" />
                            <h3 className="font-semibold">Topics Covered</h3>
                          </div>
                          <p className="text-sm text-default-500">
                            The following topics will be covered and assessed in this quiz.
                          </p>
                        </div>
                        <span className="flex gap-x-1 items-center">
                          <Input
                            value={topicInput}
                            onKeyDown={e => e.key == "Enter" && handleAddTopic()}
                            onValueChange={setTopicInput}
                            placeholder="Enter a topic..."
                            variant="bordered"
                            radius="sm"
                            classNames={{
                              input: "font-medium text-slate-700",
                              inputWrapper:
                                "border-medium data-[hover=true]:border-default-300 group-data-[focus=true]:border-default-300",
                            }}
                          />
                          <Button
                            isDisabled={topicInput.trim().length < 1}
                            radius="sm"
                            className="reset-button p-[0.7rem] bouncy-button"
                            onPress={handleAddTopic}
                            isIconOnly
                            variant="flat"
                            color="primary">
                            <LuCornerDownLeft size={16} />
                          </Button>
                        </span>
                      </div>
                      {topics.length < 1 ? (
                        <span className="w-full h-full flex justify-center items-center">
                          <p className="text-sm text-slate-500">No Topics</p>
                        </span>
                      ) : (
                        <div className="flex gap-3 mt-3.5 flex-wrap">
                          {topics.map(topic => (
                            <div
                              key={topic.topicId}
                              className="p-3 py-2.5 bg-primary-50 rounded-lg text-primary border border-primary-200 text-sm font-medium flex items-center gap-x-1.5 relative">
                              <span>{topic.name}</span>
                              <Button
                                className="reset-button absolute p-0.5 -top-1.5 -right-1.5"
                                isIconOnly
                                onPress={() => handleRemoveTopic(topic.topicId)}
                                radius="full"
                                disableRipple
                                color="danger"
                                variant="shadow">
                                <LuX size={11} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {topicsError && <p className="text-xs text-danger font-medium">{topicsError.message}</p>}
                    </CardBody>
                  </Card>
                </div>
                <Divider />
                <EditableQuestions fieldArray={questionFieldArray} />
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
          <aside className="@5xl:flex hidden">
            <div
              className={cn([
                "h-[calc(100svh-140px)] overflow-y-scroll overflow-x-hidden @5xl:sticky top-28 right-4",
                `flex flex-col gap-4 border rounded-xl shadow-sm w-full p-3`,
                isEditMode ? "border-blue-300 bg-white-50 shadow-blue-200" : "border-gray-300 bg-gray-50",
              ])}>
              <SortableQuestions fieldArray={questionFieldArray} />
            </div>
          </aside>
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
                <SortableQuestions fieldArray={questionFieldArray} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </EditModeContext.Provider>
    </FormProvider>
  );
}

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
