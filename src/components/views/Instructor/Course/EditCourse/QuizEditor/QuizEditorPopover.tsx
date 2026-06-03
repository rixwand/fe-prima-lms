import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { OverlayTriggerState } from "@react-stately/overlays";
import { ReactNode } from "react";
import { LuTrash2 } from "react-icons/lu";

const QuizEditorPopover = ({
  children,
  menuState,
  onRemoveQuestion,
}: {
  children: ReactNode;
  menuState: OverlayTriggerState;
  onRemoveQuestion: () => void;
}) => {
  return (
    <Popover state={menuState} triggerType="listbox" placement="bottom-end">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="p-0.5 w-32">
        <Listbox variant="flat" color="primary" aria-label="Actions" onAction={menuState.close}>
          <ListboxItem
            color="danger"
            className="text-danger"
            onPress={onRemoveQuestion}
            startContent={<LuTrash2 />}
            key="notes">
            Remove
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
};

export default QuizEditorPopover;
