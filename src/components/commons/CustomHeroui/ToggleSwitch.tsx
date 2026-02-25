import cn from "@/libs/utils/cn";
import { SwitchProps, VisuallyHidden, useSwitch } from "@heroui/react";
import { IconType } from "react-icons";
import { ClassNameValue } from "tailwind-merge";

export const ToggleSwitch = ({
  OffIcon,
  OnIcon,
  wrapperClassName,
  ...props
}: SwitchProps & { OnIcon: IconType; OffIcon: IconType; wrapperClassName?: ClassNameValue }) => {
  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch(props);

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: cn(["flex w-fit h-fit items-center justify-center", "rounded-lg", wrapperClassName]),
          })}>
          {isSelected ? <OnIcon /> : <OffIcon />}
        </div>
      </Component>
    </div>
  );
};
