import { Switch, extendVariants } from "@heroui/react";

export const MySwitch = extendVariants(Switch, {
  variants: {
    color: {
      white: {
        // base: "bg-white",
        // label: "bg-white",
        wrapper: "bg-white",
      },
    },
  },
});
