import { Button } from "@heroui/react";
import { FaCheck, FaCircleXmark } from "react-icons/fa6";
import { QuestionReview } from "./QuizReviewSection";

interface NavigatorProps {
  questions: QuestionReview[];
  currentQuestion: number;
  onSelectQuestion: (index: number) => void;
}

export default function QuestionReviewNav({ questions, currentQuestion, onSelectQuestion }: NavigatorProps) {
  return (
    <div className="flex flex-col gap-3">
      {questions.map((question, index) => {
        const correct = question.points === question.earnedPoints;

        return (
          <Button
            key={question.id}
            isIconOnly={false}
            variant={"flat"}
            className="reset-button py-3 px-5 flex-col rounded-xl"
            color={currentQuestion === index ? "success" : "default"}
            onPress={() => onSelectQuestion(index)}>
            <span>{index + 1}</span>

            {correct ? <FaCheck className="text-success" /> : <FaCircleXmark className="text-danger" />}
          </Button>
        );
      })}
    </div>
  );
}
