import { IconWrapper } from "@/libs/utils/icon";
import { Button, Checkbox, Divider } from "@heroui/react";
import { CgEditBlackPoint } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { LuCodeXml, LuCopyCheck, LuEllipsis, LuImage, LuMessageCircleQuestion, LuTimer, LuType } from "react-icons/lu";

const PublishedQuestionItem = ({ question, idx }: { question: PublishedQuestion; idx: number }) => {
  const sortedOptions = [...question.options].sort((a, b) => a.position - b.position);

  return (
    <div className="flex gap-x-2 w-full">
      <div className="p-5 rounded-lg shadow-sm border-gray-200 border-1 space-y-5 w-full text-start">
        <div className="flex justify-between">
          <div className="px-2.5 pr-3 rounded-md text-sm py-1 bg-default-50 flex space-x-2 items-center border-gray-300 border">
            <LuCopyCheck size={16} />
            <span>Multiple Choices</span>
          </div>
          <Button
            className="reset-button p-1.5 border border-gray-200 shadow-sm rounded-md"
            radius="none"
            isIconOnly
            variant="light">
            <LuEllipsis size={18} />
          </Button>
        </div>
        <Divider />
        <div className="flex justify-between -mb-1 px-1">
          <span className="flex gap-x-1">
            <LuMessageCircleQuestion size={20} />
            <h2>Question {idx + 1}</h2>
          </span>
          <span className="flex gap-x-2">
            <Button
              className="reset-button p-1 text-slate-700 data-[hover=true]:bg-transparent"
              disableRipple
              radius="none"
              isIconOnly
              variant="light">
              <LuImage size={20} />
            </Button>
            <Button
              className="reset-button p-1 data-[hover=true]:bg-transparent text-slate-700"
              disableRipple
              radius="none"
              isIconOnly
              variant="light">
              <LuCodeXml size={20} />
            </Button>
          </span>
        </div>
        <div className="py-2 px-3 bg-default-50 border border-gray-300 rounded-lg mt-2 min-h-14">
          <p className="text-slate-700 text-sm whitespace-pre-wrap">{question.question}</p>
        </div>
        <div className="flex gap-x-4 px-1 items-center h-8">
          <p>Choices</p>
          <Divider orientation="vertical" />
          <div className="px-2.5 pr-3 rounded-md text-sm py-1 bg-default-50 flex space-x-2 items-center border-gray-300 border">
            <LuType size={16} />
            <span>Text</span>
          </div>
          {question.multipleAnswer && (
            <div className="px-3 rounded-md text-sm py-1 bg-default-50 flex space-x-2 items-center border-gray-300 border">
              <span>Multiple Answer</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {sortedOptions.map(option => (
            <div key={`${question.position}-${option.position}`} className="flex items-center gap-x-1 py-[0.3rem]">
              <Checkbox
                radius="full"
                size="md"
                icon={<IconWrapper as={FaCheck} />}
                isSelected={option.isCorrect}
                aria-label="Answer checkbox"
                disabled
              />
              <div className="w-full rounded-lg border border-gray-300 bg-default-50 px-3 text-sm py-1.5 text-slate-700">
                {option.value}
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="flex gap-x-5">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-sm">Estimated times</p>
            <span className="flex py-1.5 rounded-md border border-gray-300 bg-default-50">
              <span className="w-[4.5rem] px-3 font-medium text-gray-800">{question.estimatedTimesSecond / 60}</span>
              <Divider orientation="vertical" />
              <span className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                <span className="text-gray-700">Mins</span>
                <LuTimer size={17} />
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-y-1.5">
            <p className="text-sm">Mark as point</p>
            <span className="flex py-1.5 rounded-md border border-gray-300 bg-default-50">
              <span className="w-[4.5rem] px-3 font-medium text-gray-800">{question.points}</span>
              <Divider orientation="vertical" />
              <span className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                <span className="text-gray-700">Points</span>
                <CgEditBlackPoint size={18} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedQuestionItem;
