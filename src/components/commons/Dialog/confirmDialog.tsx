import cn from "@/libs/utils/cn";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LuOctagonAlert } from "react-icons/lu";

type LoadingSource = boolean | (() => boolean);

type ConfirmProps = {
  title: string;
  desc: string;
  onConfirmed: () => void;
  onCancel?: () => void;
  isLoading?: LoadingSource;
  // color?: ThemeColors
  isDestructive?: boolean;
  confirmLabel?: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const readLoading = (loading: LoadingSource | undefined) => Boolean(typeof loading === "function" ? loading() : loading);

function ConfirmModal({
  title,
  desc,
  onConfirmed,
  close,
  onCancel,
  isLoading: externalLoading,
  isDestructive = false,
  confirmLabel = "Confirm",
}: ConfirmProps & { close: () => void }) {
  const hasExternalLoading = externalLoading !== undefined;
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(Boolean(readLoading(externalLoading)));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!hasExternalLoading) return;
    const interval = setInterval(() => setLoading(readLoading(externalLoading)), 100);
    return () => clearInterval(interval);
  }, [externalLoading, hasExternalLoading]);

  const waitForExternalLoading = async () => {
    const startWait = Date.now();
    let seenLoading = Boolean(readLoading(externalLoading));
    while (!seenLoading && Date.now() - startWait < 800) {
      await sleep(50);
      seenLoading = Boolean(readLoading(externalLoading));
    }
    if (!seenLoading) return;

    while (readLoading(externalLoading)) {
      await sleep(100);
    }
  };

  const handleConfirm = async () => {
    if (loading || isProcessing) return;
    try {
      setIsProcessing(true);
      onConfirmed();
      if (hasExternalLoading) {
        await waitForExternalLoading();
      }
    } finally {
      setIsOpen(false);
      close();
    }
  };

  const handleCancel = () => {
    if (loading || isProcessing) return;
    onCancel?.();
    setIsOpen(false);
    close();
  };
  const disableActions = loading || isProcessing;
  const showSpinner = loading || isProcessing;

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
          {!disableActions && (
            <Button
              // color={isDestructive ? "primary" : "danger"}
              // variant={isDestructive ? "flat" : "light"}
              variant="light"
              onPress={handleCancel}
              isDisabled={disableActions}>
              Cancel
            </Button>
          )}
          <Button color={isDestructive ? "danger" : "primary"} onPress={handleConfirm} isDisabled={disableActions}>
            {showSpinner ? <Spinner color="white" size="sm" /> : confirmLabel}
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
