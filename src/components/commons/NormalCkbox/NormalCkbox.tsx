import { cn } from "@/libs/tiptap/tiptap-utils";
import { Checkbox, CheckboxProps } from "@heroui/react";
import { MouseEventHandler } from "react";

type Props = {
  onClick?: MouseEventHandler<HTMLInputElement>;
  isSelected?: boolean;
  onValueChange?: (v: boolean) => void;
  className?: string;
  size?: CheckboxProps["size"];
};
export default function NormalCkbox({ className, ...props }: Props) {
  return (
    <Checkbox
      radius="sm"
      size={"sm"}
      aria-label="check-all"
      className={cn("w-fit h-fit", className)}
      classNames={{
        hiddenInput: "w-0",
        wrapper: "me-0 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0",
        base: "static m-0",
      }}
      {...props}
    />
  );
}
