import cn from "@/libs/utils/cn";
import { intoLocalTimeWithTz } from "@/libs/utils/moment";
import {
  Button,
  CheckboxGroup,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Progress,
  RadioGroup,
  Tooltip,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import { CgEditBlackPoint } from "react-icons/cg";
import {
  LuAlignRight,
  LuBookmark,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsRight,
  LuCirclePercent,
  LuClock,
  LuFileQuestion,
  LuLayoutGrid,
  LuSendHorizontal,
  LuTimer,
} from "react-icons/lu";
import QuizNavigator from "./QuizNavigator";
import QuizOptionItem from "./QuizOptionItem";
import QuizProgress from "./QuizProgress";
import useStartQuiz from "./useStartQuiz";
export default function ({
  title,
  totalPoints,
  estimatedTimeMinutes,
  estimatedTimeSecond,
  questions,
  quizStartAt,
  handleFinishedQuiz,
  submitQuizHandler,
  handleCancelQuiz,
}: PublishedQuizData & {
  title: string;
  totalPoints: number;
  estimatedTimeMinutes: number;
  estimatedTimeSecond: number;
  quizStartAt: string;
  handleCancelQuiz: (fn: VoidFn) => void;
  handleFinishedQuiz: () => void;
  submitQuizHandler: (form: QuizSubmissionForm, showresult?: boolean) => Promise<void>;
}) {
  const {
    currentQuestionIdx,
    handleSetCurrentQuestion,
    isAnswered,
    drawerState: { isOpen, onOpen, onClose },
    watchedAnswers,
    answeredCount,
    handleNextQuestion,
    handlePrevQuestion,
    formMethods: { control },
    quizTimerSecond,
    handleOnSubmitQuiz,
    setQuizTimerSecond,
  } = useStartQuiz({ questions, estimatedTimeSecond, handleFinishedQuiz, submitQuizHandler });

  return (
    <section className="w-full flex flex-wrap justify-center gap-x-3 @container relative overflow-hidden">
      <div className="flex flex-col">
        <div
          className={cn(
            "min-w-sm max-w-3xl min-h-[40rem]",
            "bg-white shadow-xs rounded-xl p-5",
            "@5xl:min-w-2xl mt-12 @3xl:mt-0",
            "flex flex-col",
          )}>
          <div className="w-full flex justify-between items-center mb-5">
            <Button
              onPress={() => handleCancelQuiz(() => setQuizTimerSecond(0))}
              variant="light"
              color="danger"
              isIconOnly
              disableRipple
              className="reset-button -ml-1 data-[hover=true]:bg-transparent bouncy-button"
              startContent={<LuChevronLeft size={20} className="mr-2" />}>
              Batalkan Kuis
            </Button>
            <Chip classNames={{ content: "font-medium" }} radius="sm" variant="flat" color="primary">
              In Progress
            </Chip>
          </div>

          <h1 className="mb-3 font-semibold text-xl text-slate-700">Kuis: {title}</h1>
          <div className="flex gap-x-5 items-center text-sm text-slate-500 mb-5">
            <span className="flex gap-x-1 items-center">
              <LuClock />
              <p>Waktu Mulai {intoLocalTimeWithTz(new Date(quizStartAt), { pick: ["hour", "minute", "tz"] })}</p>
            </span>
            <span className="flex gap-x-1 items-center">
              <LuFileQuestion />
              <p>{questions.length} Soal</p>
            </span>
            <span className="flex gap-x-1 items-center">
              <CgEditBlackPoint size={16} />
              <p>{totalPoints} Poin</p>
            </span>
            <span className="flex gap-x-1 items-center">
              <LuTimer />
              <p>{estimatedTimeMinutes} Menit</p>
            </span>
          </div>
          <QuizTimer {...{ estimatedTimeSecond, quizTimerSecond }} />
          <div className="border border-slate-200 bg-white rounded-xl p-5 pb-6 shadow-xs">
            <div className="w-full flex justify-start text-slate-600 text-sm mb-5">
              <span className="flex gap-x-2 items-center">
                <LuBookmark size={16} />
                <p>{questions[currentQuestionIdx].points} Poin</p>
              </span>
            </div>
            <h2 className="text-lg font-medium text-slate-700">{questions[currentQuestionIdx].question}</h2>
            <Controller
              control={control}
              name={`answers.${currentQuestionIdx}.selectedOptionIds`}
              rules={{
                validate: {
                  answerAllQuestion: val => val?.length > 0 || "Answer all questions",
                },
              }}
              render={({ field }) =>
                watchedAnswers[currentQuestionIdx].multipleAnswer ? (
                  <CheckboxGroup
                    value={field.value.map(String)}
                    onValueChange={values => field.onChange(values.map(Number))}>
                    <div className="flex flex-col gap-y-3 mt-5">
                      {questions[currentQuestionIdx].options.map(opt => (
                        <QuizOptionItem {...opt} key={opt.id} multipleAnswer />
                      ))}
                    </div>
                  </CheckboxGroup>
                ) : (
                  <RadioGroup
                    value={field.value[0]?.toString()}
                    onValueChange={value => field.onChange([Number(value)])}>
                    <div className="flex flex-col gap-y-3 mt-5">
                      {questions[currentQuestionIdx].options.map(opt => (
                        <QuizOptionItem {...opt} key={opt.id} multipleAnswer={false} />
                      ))}
                    </div>
                  </RadioGroup>
                )
              }
            />
          </div>
          <div className="flex w-full items-center justify-between mt-auto mb-1">
            <Button
              onPress={handlePrevQuestion}
              isDisabled={currentQuestionIdx <= 0}
              variant="bordered"
              isIconOnly
              className="reset-button p-2 font-medium rounded-lg border"
              color="primary"
              radius="none"
              startContent={
                <LuChevronLeft
                  //  className="mr-1 -ml-1.5"
                  size={24}
                />
              }>
              {/* Sebelumnya */}
            </Button>
            <p className="text-sm text-slate-500">Soal 1 dari 5</p>
            <Button
              onPress={handleNextQuestion}
              isDisabled={currentQuestionIdx >= watchedAnswers.length - 1}
              variant="solid"
              isIconOnly
              className="reset-button p-2 font-medium rounded-lg border border-primary"
              color="primary"
              radius="none"
              endContent={
                <LuChevronRight
                  //  className="ml-1 -mr-1.5"
                  size={24}
                />
              }>
              {/* Berikutnya */}
            </Button>
          </div>
        </div>
        <Button
          className="w-48 border font-medium text-base h-11 flex items-center rounded-lg p-0 bg-white text-primary shadow-xs gap-0 border-blue-200 mt-4 ml-auto @4xl:hidden"
          radius="none"
          variant="bordered"
          // color="primary"
          onPress={handleOnSubmitQuiz}>
          <span className="w-full">Submit</span>
          <span className="px-5 h-full border-l border-blue-200 flex items-center">
            <LuSendHorizontal className="-rotate-45" size={18} />
          </span>
        </Button>
      </div>
      <button
        onClick={onOpen}
        className={cn([
          isOpen ? "translate-x-12" : "translate-x-0",
          "absolute @4xl:hidden cursor-pointer delay-700 duration-300 transition-transform top-12 bg-primary pl-3 pr-2 rounded-l-full py-2 right-0 z-20 ",
        ])}>
        <LuAlignRight className="text-xl text-white" />
      </button>
      <aside className="hidden @4xl:flex flex-col gap-y-3.5">
        <div className="bg-white rounded-xl shadow-xs p-3.5 pb-6 min-w-xs">
          <span className="flex gap-x-2 items-center mb-5">
            <LuLayoutGrid size={18} className="text-primary" />
            <p className="font-semibold">Soal</p>
          </span>
          <QuizNavigator {...{ currentQuestionIdx, handleSetCurrentQuestion, isAnswered, questions }} />
          <Divider />
          <QuizLegend />
        </div>
        <div className="bg-white rounded-xl shadow-xs p-3.5 pb-6 min-w-xs">
          <span className="flex gap-x-2 items-center mb-5">
            <LuCirclePercent size={20} className="text-primary" />
            <p className="font-semibold">Kemajuan Kuis</p>
          </span>
          <QuizProgress answeredCount={answeredCount} totalQuestions={questions.length} />
        </div>
        <Button
          className="max-w-48 border font-medium text-base h-11 flex items-center rounded-lg p-0 bg-white text-primary shadow-xs gap-0 border-blue-200"
          radius="none"
          variant="bordered"
          onPress={handleOnSubmitQuiz}
          // color="primary"
        >
          <span className="w-full">Submit</span>
          <span className="px-5 h-full border-l border-blue-200 flex items-center">
            <LuSendHorizontal className="-rotate-45" size={18} />
          </span>
        </Button>
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
            <h3 className="font-semibold mr-3">Kuis Navigator</h3>
          </DrawerHeader>
          <DrawerBody className="pt-[3.75rem] px-3.5 bg-white">
            <div className="space-y-3.5">
              <span className="flex gap-x-2 items-center mb-5">
                <LuLayoutGrid size={18} className="text-primary" />
                <p className="font-semibold">Soal</p>
              </span>
              <QuizNavigator {...{ currentQuestionIdx, handleSetCurrentQuestion, isAnswered, questions }} />
              <Divider />
              <QuizLegend />
              <Divider />
              <span className="flex gap-x-2 items-center mb-5">
                <LuCirclePercent size={20} className="text-primary" />
                <p className="font-semibold">Kemajuan Kuis</p>
              </span>
              <QuizProgress answeredCount={answeredCount} totalQuestions={questions.length} />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

type QuizTimerProps = {
  estimatedTimeSecond: number;
  quizTimerSecond: number;
};

function QuizTimer({ estimatedTimeSecond, quizTimerSecond }: QuizTimerProps) {
  const remainingSecond = quizTimerSecond ?? estimatedTimeSecond;
  const progress = estimatedTimeSecond > 0 ? (remainingSecond / estimatedTimeSecond) * 100 : 0;
  const minutes = Math.floor(remainingSecond / 60);
  const seconds = remainingSecond % 60;
  return (
    <>
      <Progress aria-label="Sisa waktu" className="mb-2 h-2 w-full" value={progress} />

      <div className="mb-6 flex justify-end text-sm text-slate-500">
        Sisa Waktu: {minutes} menit {seconds.toString().padStart(2, "0")} detik
      </div>
    </>
  );
}

const QuizLegend = () => (
  <div className="space-y-4 mt-5">
    <div className="flex gap-x-5 items-center">
      <span className="w-10 h-10 font-medium rounded-md flex justify-center items-center border-slate-300 border bg-white"></span>
      <p className="text-slate-700 text-sm font-medium">Belum Dijawab</p>
    </div>
    <div className="flex gap-x-5 items-center">
      <span className="w-10 h-10 font-medium rounded-md flex justify-center items-center border border-primary bg-primary"></span>
      <p className="text-slate-700 text-sm font-medium">Soal Saat ini</p>
    </div>
    <div className="flex gap-x-5 items-center">
      <span className="w-10 h-10 font-medium rounded-md flex justify-center items-center border border-success bg-success"></span>
      <p className="text-slate-700 text-sm font-medium">Telah Dijawab</p>
    </div>
  </div>
);
