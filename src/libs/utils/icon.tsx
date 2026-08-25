import { CheckboxProps } from "@heroui/react";
import { IconBaseProps, IconType } from "react-icons";

export const IconWrapper = ({
  as: Icon,
  isSelected,
  isIndeterminate,
  disableAnimation,
  ...props
}: { as: IconType } & IconBaseProps & Pick<CheckboxProps, "isSelected" | "isIndeterminate" | "disableAnimation">) => (
  <Icon {...props} />
);
