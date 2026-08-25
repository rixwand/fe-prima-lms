import { Card, CardBody } from "@heroui/react";
import AnswerOptionReview from "./AnswerOptionReview";
import QuestionReviewHeader from "./QuestionReviewHeader";
import { QuestionReview } from "./QuizReviewSection";

interface CardProps {
  question: QuestionReview;
  idx: number;
}

export default function QuestionReviewCard({ question, idx }: CardProps) {
  const correct = question.points === question.earnedPoints;

  return (
    <Card shadow="none" className="border border-default-200">
      <CardBody className="space-y-6 p-6">
        <QuestionReviewHeader idx={idx} question={question} />

        <p className="leading-relaxed">{question.question}</p>

        <div className="space-y-3">
          {question.options.map(option => (
            <AnswerOptionReview multipleAnswer={question.multipleAnswer} key={option.id} option={option} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
