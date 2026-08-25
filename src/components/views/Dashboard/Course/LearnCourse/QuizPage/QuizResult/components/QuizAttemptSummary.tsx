import { Card, CardBody, Chip } from "@heroui/react";
import {
  LuBadgeCheck,
  LuCalendarCheck,
  LuCalendarClock,
  LuChartColumn,
  LuClipboardCheck,
  LuClipboardList,
  LuClock3,
  LuHistory,
} from "react-icons/lu";
import SidebarRow from "./SideBarRow";

type AttemptSummaryCardProps = {
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  timeSpentSecond: number;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  status: QuizAttemptStatus;
};

export default function QuizAttemptSummary({
  attemptNumber,
  startedAt,
  submittedAt,
  timeSpentSecond,
  score,
  status,
  totalPoints,
  percentage,
  passed,
}: AttemptSummaryCardProps) {
  const minutes = Math.floor(timeSpentSecond / 60);
  const seconds = timeSpentSecond % 60;
  return (
    <Card shadow="none" className="rounded-2xl shadow-xs h-fit">
      <CardBody className="p-0">
        <div className="flex items-center gap-3 px-6 pt-6 pb-3">
          <LuHistory size={24} className="text-primary" />

          <h2 className="text-lg font-semibold">Ringakasan Percobaan</h2>
        </div>

        <SidebarRow icon={<LuClipboardList />} label="Percobaan" value={<span>#{attemptNumber}</span>} />

        <SidebarRow
          icon={<LuClipboardCheck />}
          label="Status"
          value={
            <Chip
              color="success"
              variant="flat"
              radius="sm"
              classNames={{
                content: "font-semibold",
              }}>
              {status}
            </Chip>
          }
        />

        <SidebarRow icon={<LuCalendarClock />} label="Mulai" value={startedAt} />

        <SidebarRow icon={<LuCalendarCheck />} label="Selesai" value={submittedAt} />

        <SidebarRow
          icon={<LuClock3 />}
          label="Waktu Terpakai"
          value={`${minutes} menit ${seconds.toString().padStart(2, "0")} detik`}
        />

        <SidebarRow icon={<LuChartColumn />} label="Skor" value={`${score} / ${totalPoints} (${percentage}%)`} />

        <SidebarRow
          last
          icon={<LuBadgeCheck />}
          label="Hasil"
          value={
            <Chip
              color={passed ? "success" : "danger"}
              variant="flat"
              radius="sm"
              classNames={{
                content: "font-semibold",
              }}>
              {passed ? "PASSED" : "FAILED"}
            </Chip>
          }
        />
      </CardBody>
    </Card>
  );
}
