import { Button, Checkbox, Divider, Input, Select, SelectItem, Switch, Textarea } from "@heroui/react";
import { useState } from "react";
import { CgEditBlackPoint } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import {
  LuCodeXml,
  LuCopyCheck,
  LuEllipsis,
  LuGripVertical,
  LuImage,
  LuMessageCircleQuestion,
  LuPencilLine,
  LuPlus,
  LuTimer,
  LuType,
} from "react-icons/lu";

const quizType = [
  {
    key: "multiple-choices",
    label: "Multiple Choices",
    icon: LuCopyCheck,
  },
  {
    key: "fill-blank",
    label: "Fill in the Blank",
    icon: LuPencilLine,
  },
];

const choicesType = [
  {
    key: "text",
    label: "Text",
    icon: LuType,
  },
  {
    key: "code",
    label: "Code",
    icon: LuCodeXml,
  },
  {
    key: "image",
    label: "Image",
    icon: LuImage,
  },
];
export default function QuizEditor() {
  const [selectedQuizType, setSelectedQuizType] = useState<string>("multiple-choices");
  const [selectedChoicesType, setSelectedChoicesType] = useState<string>("text");

  return (
    <div className="grid @xl:grid-cols-[1fr_400px] text-slate-700 gap-x-6">
      <div className="text-center space-y-4">
        <div className="flex gap-x-2 w-full">
          <div className="bg-gray-200 rounded-full p-1.5 h-fit mt-1">
            <LuGripVertical size={16} />
          </div>
          <div className="p-4 rounded-lg shadow-sm border-gray-200 border-1 space-y-5 w-full text-start">
            <div className="flex justify-between">
              <Select
                size="sm"
                items={quizType}
                radius="none"
                className="w-44 h-fit"
                selectedKeys={selectedQuizType ? [selectedQuizType] : undefined}
                onSelectionChange={keys => {
                  const value = Array.from(keys)[0] as SectionItemType;
                  if (!value) return;
                  setSelectedQuizType(value);
                }}
                classNames={{ trigger: "rounded-md" }}
                renderValue={items =>
                  items.map(({ data, key }) =>
                    data ? (
                      <span key={key} className="flex items-center gap-x-1 text-slate-700">
                        <data.icon size={16} />
                        {data.label}
                      </span>
                    ) : null,
                  )
                }>
                {({ icon: Icon, key, label }) => (
                  <SelectItem aria-label={label} key={key}>
                    <span className="flex items-center gap-x-1 text-slate-700">
                      <Icon size={16} />
                      {label}
                    </span>
                  </SelectItem>
                )}
              </Select>
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
                <h2>Question 1</h2>
              </span>
              <span className="flex gap-x-2">
                <Button
                  className="reset-button p-1 text-slate-700 bouncy-button data-[hover=true]:bg-transparent"
                  disableRipple
                  radius="none"
                  isIconOnly
                  variant="light">
                  <LuImage size={20} />
                </Button>
                <Button
                  className="reset-button p-1 bouncy-button data-[hover=true]:bg-transparent text-slate-700"
                  disableRipple
                  radius="none"
                  isIconOnly
                  variant="light">
                  <LuCodeXml size={20} />
                </Button>
              </span>
            </div>
            <Textarea
              disableAnimation
              disableAutosize
              classNames={{
                base: "max-w-full",
                input: "resize-y min-h-3/4 py-2",
              }}
              labelPlacement="outside-top"
              label={<></>}
              placeholder="Enter your description"
              variant="flat"
              radius="sm"
            />
            <div className="flex gap-x-4 px-1 items-center h-8">
              <p>Choices</p>
              <Divider orientation="vertical" />
              <Select
                size="sm"
                items={choicesType}
                radius="none"
                className="w-24 h-fit"
                selectedKeys={selectedChoicesType ? [selectedChoicesType] : undefined}
                onSelectionChange={keys => {
                  const value = Array.from(keys)[0] as SectionItemType;
                  if (!value) return;
                  setSelectedChoicesType(value);
                }}
                classNames={{ trigger: "rounded-md" }}
                renderValue={items =>
                  items.map(({ data, key }) =>
                    data ? (
                      <span key={key} className="flex items-center gap-x-1 text-slate-700">
                        <data.icon size={16} />
                        {data.label}
                      </span>
                    ) : null,
                  )
                }>
                {({ icon: Icon, key, label }) => (
                  <SelectItem aria-label={label} key={key}>
                    <span className="flex items-center gap-x-1 text-slate-700">
                      <Icon size={16} />
                      {label}
                    </span>
                  </SelectItem>
                )}
              </Select>
              <Switch classNames={{ label: "text-slate-700" }} size="sm">
                Multiple Answer
              </Switch>
            </div>
            <div className="space-y-2">
              <div className="flex gap-x-1 items-center">
                <Checkbox radius="full" size="md" icon={<FaCheck />} />
                <Input radius="sm" classNames={{ inputWrapper: "h-fit min-h-fit py-1.5" }} />
                <span className="cursor-grabbing p-1.5 ml-1 rounded-lg bg-gray-200">
                  <LuGripVertical size={18} />
                </span>
              </div>
            </div>
            <Button
              className="reset-button bouncy-button border-1.5 border-dashed border-gray-500 px-3 py-2 rounded-md text-gray-700"
              startContent={<LuPlus className="mr-2" />}
              isIconOnly
              variant="light"
              disableRipple
              radius="none">
              Add Answer
            </Button>
            <Divider />
            <div className="flex gap-x-5">
              <div className="flex py-1.5 rounded-md border border-gray-200 bg-gray-100">
                <input
                  type="number"
                  defaultValue={2}
                  className="w-[4.5rem] bg-transparent px-3 font-medium text-gray-800 outline-none"
                />
                <Divider orientation="vertical" />
                <div className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                  <span className="text-gray-700">Mins</span>
                  <LuTimer size={17} />
                </div>
              </div>
              <div className="flex py-1.5 rounded-md border border-gray-200 bg-gray-100">
                <input
                  type="number"
                  defaultValue={5}
                  className="w-[4.5rem] bg-transparent px-3 font-medium text-gray-800 outline-none"
                />
                <Divider orientation="vertical" />
                <div className="flex flex-1 text-gray-500 items-center justify-between pl-3 pr-2.5 gap-x-2">
                  <span className="text-gray-700">Points</span>
                  <CgEditBlackPoint size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          className="reset-button bouncy-button border-1.5 border-dashed border-gray-500 px-3 py-2 rounded-md text-slate-700"
          startContent={<LuPlus className="mr-2" />}
          isIconOnly
          variant="light"
          disableRipple
          radius="none">
          Add New Question
        </Button>
      </div>
      <div className="space-y-4 min-h-[calc(100vh-140px)] border rounded-xl shadow-sm border-gray-300 overflow-y-scroll sticky p-3 bg-gray-50">
        <button
          // key={question.id}
          className={`w-full rounded-2xl border p-4 text-left transition ${
            // question.active
            //   ? "border-zinc-400 bg-white shadow-sm"
            "border-zinc-200 bg-white hover:bg-gray-50 hover:border-zinc-300 cursor-pointer"
          }`}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600">
                1
              </div>
              <p className="line-clamp-1 text-sm font-medium">Lorem ipsum dolor sit amet</p>
            </div>
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-x-2 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
              <LuCopyCheck />
              <p>Multiple choices</p>
            </span>
            <Button className="reset-button p-1.5 bouncy-button" radius="sm" isIconOnly variant="light" disableRipple>
              <LuEllipsis size={18} />
            </Button>
          </div>
        </button>
      </div>
    </div>
  );
}
