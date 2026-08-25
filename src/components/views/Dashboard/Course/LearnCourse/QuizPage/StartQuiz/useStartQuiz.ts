import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { informationDialog } from "@/libs/utils/information-dialog";
import { addToast, useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function ({
  questions,
  estimatedTimeSecond,
  handleFinishedQuiz,
  submitQuizHandler,
}: {
  questions: PublishedQuizQuestion[];
  estimatedTimeSecond: number;
  handleFinishedQuiz: () => void;
  submitQuizHandler: (form: QuizSubmissionForm, showresult?: boolean) => Promise<void>;
}) {
  const formMethods = useForm<QuizSubmissionForm>({
    defaultValues: {
      answers: questions.map(q => ({
        questionId: q.id,
        multipleAnswer: q.multipleAnswer,
        selectedOptionIds: [],
      })),
    },
  });
  const {
    control,
    formState: { isValid, errors },
    getValues,
  } = formMethods;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizTimerSecond, setQuizTimerSecond] = useState<number>(
    // estimatedTimeSecond
    5,
  );
  const drawerState = useDisclosure({ defaultOpen: false });
  const watchedAnswers = useWatch({ control, name: "answers" });
  const answeredCount = watchedAnswers.filter(answer => answer.selectedOptionIds.length > 0).length;
  const isAnswered = (id: number) =>
    watchedAnswers.some(answer => answer.questionId === id && answer.selectedOptionIds.length > 0);
  const handleSetCurrentQuestion = (id: number) => {
    setCurrentQuestionIdx(questions.findIndex(v => v.id == id));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIdx(v => (v < watchedAnswers.length - 1 ? v + 1 : 0));
  };
  const handlePrevQuestion = () => {
    setCurrentQuestionIdx(v => (v > 0 ? v - 1 : watchedAnswers.length - 1));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setQuizTimerSecond(prev => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOnSubmitQuiz = () =>
    confirmDialog({
      title: "Submit Quiz",
      desc: "Apakah anda yakin ingin menyelesaikan kuis?",
      async onConfirmed() {
        if (!isValid)
          return addToast({
            title: "Belum Terjawab",
            description: "Silahkan jawab semua pertanyaan",
            color: "warning",
          });
        return submitQuizHandler(getValues());
      },
    });
  const submittedRef = useRef(false);

  useEffect(() => {
    if (quizTimerSecond !== 0 || submittedRef.current) return;

    submittedRef.current = true;

    void (async () => {
      console.log("Submit Quiz TimeOut");
      await submitQuizHandler(getValues(), false);
      console.log("Submit Quiz TimeOut Success");

      informationDialog({
        title: "Waktu Habis",
        desc: "Jawaban akan otomatis di submit",
        loaderDelay: 5000,
        onClose: handleFinishedQuiz,
      });
    })();
  }, [quizTimerSecond]);

  return {
    drawerState,
    currentQuestionIdx,
    handleSetCurrentQuestion,
    formMethods,
    isAnswered,
    answeredCount,
    watchedAnswers,
    handleNextQuestion,
    handlePrevQuestion,
    quizTimerSecond,
    handleOnSubmitQuiz,
    setQuizTimerSecond,
  };
}
