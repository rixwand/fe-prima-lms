import cn from "@/libs/utils/cn";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { LuOctagonAlert } from "react-icons/lu";

type ConfirmProps = {
  title: string;
  desc: string;
  onConfirmed: () => void | Promise<unknown>;
  onCancel?: () => void;
  isDestructive?: boolean;
  confirmLabel?: string;
};

function ConfirmModal({
  title,
  desc,
  onConfirmed,
  close,
  onCancel,
  isDestructive = false,
  confirmLabel = "Confirm",
}: ConfirmProps & { close: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await Promise.resolve(onConfirmed());
    } finally {
      setIsOpen(false);
      close();
    }
  };

  const handleCancel = () => {
    if (isProcessing) return;
    onCancel?.();
    setIsOpen(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} placement="center" size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader className={cn(["text-lg font-semibold items-center gap-x-2.5", isDestructive && "text-danger"])}>
          {isDestructive && (
            <span className="text-xl bg-danger-50 p-2 rounded-full">
              <LuOctagonAlert color="danger" />
            </span>
          )}
          <span>{title}</span>
        </ModalHeader>
        <ModalBody className={cn(isDestructive ? "text-danger-600" : "text-slate-600")}>
          <p className="whitespace-pre-line">{desc}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleCancel} isDisabled={isProcessing}>
            Cancel
          </Button>
          <Button color={isDestructive ? "danger" : "primary"} onPress={handleConfirm} isDisabled={isProcessing}>
            {isProcessing ? <Spinner color="white" size="sm" /> : confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function confirmDialog(props: ConfirmProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<ConfirmModal {...{ ...props, close }} />);
}
