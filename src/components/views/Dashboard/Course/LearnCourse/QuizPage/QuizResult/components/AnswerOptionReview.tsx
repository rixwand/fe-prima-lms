import { IconWrapper } from "@/libs/utils/icon";
import { Checkbox } from "@heroui/react";
import clsx from "clsx";
import { FaCheck, FaCircleCheck, FaCircleDot, FaCircleXmark, FaX } from "react-icons/fa6";
import { QuestionReview } from "./QuizReviewSection";

interface OptionProps {
  option: QuestionReview["options"][number];
  multipleAnswer: boolean;
}

export default function AnswerOptionReview({ option, multipleAnswer }: OptionProps) {
  const isCorrectSelection = option.selected && option.correct;
  const isWrongSelection = option.selected && !option.correct;

  return (
    <div
      className={clsx("flex items-center justify-between rounded-xl border p-3.5 transition", {
        "border-success bg-success-50": isCorrectSelection,
        "border-danger bg-danger-50": isWrongSelection,
        "border-default-200": !option.selected,
      })}>
      <div className="flex items-center gap-4">
        <Checkbox
          radius="full"
          color={isCorrectSelection ? "success" : isWrongSelection ? "danger" : "default"}
          icon={
            multipleAnswer ? (
              <IconWrapper as={isCorrectSelection ? FaCheck : FaX} />
            ) : (
              <IconWrapper className={isCorrectSelection ? "text-success" : "text-danger"} as={FaCircleDot} />
            )
          }
          isSelected={option.selected}
          isDisabled
        />

        <span>{option.text}</span>
      </div>

      <div className="flex items-center gap-2">
        {isCorrectSelection && (
          <>
            <span className="font-medium text-success">Correct</span>
            <FaCircleCheck className="text-success" />
          </>
        )}

        {isWrongSelection && (
          <>
            <span className="font-medium text-danger">Your Answer</span>
            <FaCircleXmark className="text-danger" />
          </>
        )}
      </div>
    </div>
  );
}
