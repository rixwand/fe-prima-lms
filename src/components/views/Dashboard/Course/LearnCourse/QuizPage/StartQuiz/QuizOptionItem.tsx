import { IconWrapper } from "@/libs/utils/icon";
import { Checkbox, Radio } from "@heroui/react";
import { FaCheck } from "react-icons/fa";

type Props = PublishedQuizOption & {
  multipleAnswer: boolean;
};

const classNames = {
  base: "w-full max-w-none m-0 py-4 px-5 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-50",
  wrapper: "mr-4",
  label: "text-base",
};

export default function QuizOptionItem({ id, value, multipleAnswer }: Props) {
  if (multipleAnswer) {
    return (
      <Checkbox
        value={id.toString()}
        radius="full"
        size="md"
        icon={<IconWrapper as={FaCheck} />}
        classNames={classNames}>
        {value}
      </Checkbox>
    );
  }

  return (
    <Radio value={id.toString()} size="md" classNames={classNames}>
      {value}
    </Radio>
  );
}
