import cn from "@/libs/utils/cn";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import Image from "next/image";
import {
  LuChevronRight,
  LuCircleCheck,
  LuClipboardList,
  LuClock,
  LuFileQuestion,
  LuFileText,
  LuHistory,
  LuPlay,
  LuStar,
  LuTarget,
  LuTrendingUp,
  LuTriangleAlert,
} from "react-icons/lu";
import { VscChevronDown } from "react-icons/vsc";
import QuizTopicsCovered from "../QuizTopicsCovered";

export default function QuizContent({
  quizAttemptsHistory,
  estimatedTimeMinutes,
  totalPoints,
  onStart,
  hasNextPageAttemptHistory,
  fetchNextPageAttemptHistory,
  handleShowHistoryDetail,
  ...data
}: PublishedQuizData & {
  title: string;
  handleShowHistoryDetail: (id: number) => Promise<void>;
  onStart: () => void;
  estimatedTimeMinutes: number;
  totalPoints: number;
  quizAttemptsHistory: QuizAttemptHistoryResponse["attempts"];
  fetchNextPageAttemptHistory: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<QuizAttemptHistoryResponse, unknown>, Error>>;
  hasNextPageAttemptHistory: boolean;
}) {
  return (
    <div className="w-full flex justify-center">
      <div className={cn("mx-8 max-w-4xl h-fit", "bg-white shadow-xs rounded-xl p-5")}>
        <div className="flex gap-x-7 h-fit mb-8">
          <div className="bg-primary-100 text-primary h-fit rounded-xl p-4 shrink-0">
            <LuClipboardList size={28} />
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <p className="text-sm text-slate-600">KUIS</p>
            <h1 className="text-xl font-semibold text-slate-700">{data.title}</h1>
            <p className="text-sm text-slate-600">{data.description}</p>
          </div>
        </div>
        <Divider />
        <div className="flex justify-evenly py-5 h-44">
          <div className="flex flex-col gap-y-2 w-40 pt-4 items-center">
            <LuFileQuestion size={24} className="text-primary" />
            <span className="text-xl font-semibold">{data.questions.length}</span>
            <span className="text-sm text-slate-600">Soal</span>
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-col gap-y-2 w-40 pt-4 items-center">
            <LuStar size={24} className="text-primary" />
            <span className="text-xl font-semibold">{totalPoints}</span>
            <span className="text-sm text-slate-600">Total Poin</span>
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-col gap-y-2 w-40 pt-4 items-center">
            <LuClock size={24} className="text-primary" />
            <span className="text-xl font-semibold">{estimatedTimeMinutes}</span>
            <span className="text-sm text-slate-600 text-center">
              Menit <br /> Waktu Estimasi
            </span>
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-col gap-y-2 w-40 pt-4 items-center">
            <LuTarget size={24} className="text-primary" />
            <span className="text-xl font-semibold">{data.passingScorePercent}%</span>
            <span className="text-sm text-slate-600">Skor Minimum</span>
          </div>
        </div>
        <div className="flex gap-x-3 mt-2">
          <div className="p-5 border border-gray-200 w-full rounded-lg">
            <div className="flex gap-x-2.5 items-center">
              <LuFileText size={18} className="text-primary" />
              <span className="text-base font-semibold text-slate-700">Petunjuk</span>
            </div>
            <ul className="space-y-3 mt-3.5">
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Jawab semua soal sebelum menyelesaikan kuis.</span>
              </li>
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Kuis akan otomatis selesai setelah waktu habis</span>
              </li>
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Gunakan Navigator Soal untuk berpindah soal.</span>
              </li>
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Progres akan hilang jika tab ditutup.</span>
              </li>
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Tinjau jawaban sebelum menyelesaikan kuis.</span>
              </li>
              <li className="flex gap-x-2.5 items-center">
                <LuCircleCheck className="text-primary" />
                <span className="text-sm text-slate-600">Hasil ditampilkan setelah kuis selesai.</span>
              </li>
            </ul>
          </div>
        </div>
        <Button
          className="mt-6 w-full font-medium"
          onPress={onStart}
          radius="sm"
          variant="solid"
          color="primary"
          startContent={<LuPlay size={18} />}>
          Mulai Kuis
        </Button>
        <div className="text-slate-500 flex gap-x-2 w-full py-1.5 mt-2 text-xs justify-center items-center">
          <LuTriangleAlert />
          <span>Setelah kuis dimulai, timer akan berjalan</span>
        </div>
      </div>
      <aside className="flex flex-col gap-y-4">
        <div className="bg-white shadow-xs rounded-xl px-7 w-sm h-fit flex flex-col gap-y-7 pb-9 pt-6">
          <QuizTopicsCovered {...{ topics: data.topics }} />
          <Divider />
          <QuizStatisticCard />
          <Divider />
          <QuizAttemptHistory
            {...{
              quizAttemptsHistory,
              fetchNextPageAttemptHistory,
              hasNextPageAttemptHistory,
              handleShowHistoryDetail,
            }}
          />
        </div>
        <SectionProgressCard {...{ passingScorePercent: data.passingScorePercent }} />
      </aside>
    </div>
  );
}

function QuizAttemptHistory({
  quizAttemptsHistory,
  fetchNextPageAttemptHistory,
  hasNextPageAttemptHistory,
  handleShowHistoryDetail,
}: {
  quizAttemptsHistory: QuizAttemptHistoryResponse["attempts"];
  handleShowHistoryDetail: (id: number) => Promise<void>;
  fetchNextPageAttemptHistory: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<QuizAttemptHistoryResponse, unknown>, Error>>;
  hasNextPageAttemptHistory: boolean;
}) {
  const { onClose, onOpen, isOpen } = useDisclosure({ defaultOpen: false });
  const handleShowAllHistory = async () => {
    await fetchNextPageAttemptHistory();
    return onOpen();
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <LuHistory className="text-primary" />
        <h3 className="font-semibold">Riwayat Percobaan</h3>
        <Button
          hidden={!(hasNextPageAttemptHistory || quizAttemptsHistory.length > 5)}
          onPress={handleShowAllHistory}
          isIconOnly
          disableAnimation
          radius="none"
          endContent={<LuChevronRight />}
          className="reset-button data-[hover=true]:bg-transparent hover:underline text-slate-500 border-slate-200 ml-auto"
          variant="light">
          Semua
        </Button>
      </div>

      <div className="flex flex-col gap-y-1.5">
        {!quizAttemptsHistory || quizAttemptsHistory.length == 0 ? (
          <div className="flex justify-between w-full">
            <p className="mx-auto my-3 text-slate-400 text-sm">Belum ada</p>
          </div>
        ) : (
          quizAttemptsHistory
            .slice(0, 5)
            .map(attempt => <QuizAttemptHistoryItem {...{ attempt, onClick: handleShowHistoryDetail }} />)
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur" size="lg">
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">Semua Riwayat Percobaan</ModalHeader>

          <ModalBody className="text-slate-600">
            <div className="flex flex-col gap-y-1.5">
              {!quizAttemptsHistory || quizAttemptsHistory.length == 0 ? (
                <div className="flex justify-between w-full">
                  <p className="mx-auto my-3 text-slate-400 text-sm">Belum ada</p>
                </div>
              ) : (
                quizAttemptsHistory.map(attempt => (
                  <QuizAttemptHistoryItem attempt={attempt} onClick={handleShowHistoryDetail} />
                ))
              )}
              <Button
                hidden={!hasNextPageAttemptHistory}
                onPress={async () => fetchNextPageAttemptHistory()}
                variant="light"
                isIconOnly
                className="reset-button text-slate-500 mx-auto data-[hover=true]:bg-transparent mt-1"
                disableRipple>
                <span className="flex flex-col items-center">
                  <span className="-mb-1.5">Lebih</span>
                  <VscChevronDown size={24} />
                </span>
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function QuizStatisticCard() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <LuTrendingUp className="text-primary" />
        <h3 className="font-semibold">Statistik</h3>
      </div>

      <div className="space-y-4">
        <InfoRow label="Percobaan" value="2" />
        <InfoRow label="Skor Terbaik" value="80%" />
        <InfoRow label="Perolehan Poin" value="25" />
      </div>
    </div>
  );
}

function SectionProgressCard({ passingScorePercent }: { passingScorePercent: number }) {
  return (
    <div className="bg-warning-50/50 border border-warning-200 p-5 flex gap-x-5 rounded-lg items-center w-sm h-fit">
      <Image src={"/images/bulb.png"} width={20} height={20} alt="light bulb" className="mb-1" />
      <p className="text-sm text-warning tracking-wide">
        Raih skor minimal {passingScorePercent}% untuk lulus dan membuka bagian berikutnya.
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-default-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function QuizAttemptHistoryItem({
  attempt,
  onClick,
}: {
  attempt: Omit<QuizAttempt, "quizSnapshot">;
  onClick: (id: number) => Promise<void>;
}) {
  return (
    <div
      onClick={async () => onClick(attempt.id)}
      key={attempt.id}
      className="flex items-center justify-between text-sm text-slate-500 hover:bg-gray-100 py-1 px-1.5 rounded-md cursor-pointer">
      <span className="ml-1">Percobaan {attempt.attemptNumber}</span>
      <span className="flex items-center gap-x-2">
        <span className={"text-slate-500"}>{attempt.percentage}%</span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-md font-medium text-xs",
            attempt.passed ? "bg-success-100 text-success" : "bg-danger-100 text-danger",
          )}>
          {attempt.passed ? "PASSED" : "FAILED"}
        </span>
        <LuChevronRight />
      </span>
    </div>
  );
}
