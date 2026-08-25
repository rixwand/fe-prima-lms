import { Code } from "@heroui/react";

export default function DumpObj({ object }: { object: any }) {
  return (
    <div className="flex w-full">
      <Code className="whitespace-pre-wrap">{JSON.stringify(object, null, 4)}</Code>
    </div>
  );
}
