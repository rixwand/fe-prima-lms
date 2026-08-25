import { Chip } from "@heroui/react";
import { FaCheck, FaCircleXmark } from "react-icons/fa6";
import { QuestionReview } from "./QuizReviewSection";

interface HeaderProps {
  question: QuestionReview;
  idx: number;
}

export default function QuestionReviewHeader({ question, idx }: HeaderProps) {
  const correct = question.points === question.earnedPoints;

  return (
    <div className="flex items-start justify-between">
      <div className="space-x-2 flex">
        <h2 className="text-lg font-semibold">Soal {idx + 1}</h2>
        <Chip
          color={correct ? "success" : "danger"}
          variant="flat"
          radius="none"
          className="rounded-md"
          startContent={<span className="mr-1 ml-1.5">{correct ? <FaCheck /> : <FaCircleXmark />}</span>}>
          {correct ? "Benar" : "Salah"}
        </Chip>
      </div>

      <div className="text-right">
        <p className={`text-sm font-medium ${correct ? "text-success" : "text-danger"}`}>
          {question.earnedPoints} / {question.points} poin
        </p>
      </div>
    </div>
  );
}
