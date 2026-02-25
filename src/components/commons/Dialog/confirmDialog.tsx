import cn from "@/libs/utils/cn";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { LuOctagonAlert } from "react-icons/lu";

type ConfirmProps = {
  title: string;
  desc: string;
  onConfirmed: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  isLoading?: boolean;
  // color?: ThemeColors
  isDestructive?: boolean;
  confirmLabel?: string;
};

function ConfirmModal({
  title,
  desc,
  onConfirmed,
  close,
  onCancel,
  isLoading: externalLoading = false,
  isDestructive = false,
  confirmLabel = "Confirm",
}: ConfirmProps & { close: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(externalLoading);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirmed();
    } finally {
      setLoading(false);
      setIsOpen(false);
      close();
    }
  };

  const handleCancel = async () => {
    if (loading) return; // prevent canceling while loading
    try {
      if (onCancel) await onCancel(); // ✅ invoke optional callback
    } finally {
      setIsOpen(false);
      close();
    }
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
          {!loading && (
            <Button
              // color={isDestructive ? "primary" : "danger"}
              // variant={isDestructive ? "flat" : "light"}
              variant="light"
              onPress={handleCancel}
              isDisabled={loading}>
              Cancel
            </Button>
          )}
          <Button color={isDestructive ? "danger" : "primary"} onPress={handleConfirm} isDisabled={loading}>
            {loading ? <Spinner color="white" size="sm" /> : confirmLabel}
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
