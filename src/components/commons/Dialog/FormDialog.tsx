import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { ReactNode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type LoadingSource = boolean | (() => boolean);

type SectionsDialogType = {
  content: ReactNode;
  title: string;
  isLoading?: LoadingSource;
  onSubmit: () => void;
  onCancel?: () => void;
  open?: boolean;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const readLoading = (loading: LoadingSource | undefined) => Boolean(typeof loading === "function" ? loading() : loading);

const ModalBodySections = ({
  content: children,
  isLoading: externalLoading,
  close,
  title,
  onSubmit,
  onCancel,
}: SectionsDialogType & { close: () => void }) => {
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
      onSubmit();
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
    <Modal isDismissable={false} onClose={handleCancel} isKeyboardDismissDisabled={true} isOpen={isOpen}>
      <ModalContent className="bg-gradient-to-br from-gray-50 to-white text-slate-900 max-w-xl">
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody className="">{children}</ModalBody>
        <ModalFooter>
          <Button isDisabled={disableActions} color="danger" variant="light" onPress={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleConfirm} isDisabled={disableActions}>
            {showSpinner ? <Spinner color="white" size="sm" /> : "Submit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type WithSubscribe<T extends FieldValues> = SectionsDialogType & {
  formSubscribe: UseFormReturn<T>["subscribe"];
  fieldName: Path<T>;
};

type WithoutSubscribe = SectionsDialogType & {
  formSubscribe?: never;
  fieldName?: never;
};

type Props<T extends FieldValues> = WithSubscribe<T> | WithoutSubscribe;

export default function FormWrapperDialog<T extends FieldValues>({ formSubscribe, fieldName, ...props }: Props<T>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container, {});
  const close = () => {
    root.unmount();
    container.remove();
  };
  if (formSubscribe && !fieldName) {
    throw new Error("fieldName is required when formSubscribe is provided");
  }
  if (formSubscribe) {
    formSubscribe({
      name: fieldName,
      formState: { values: true },
      callback({ values, isReady }) {
        const val = values[fieldName];
        if (Array.isArray(val) && val.length == 0 && isReady) {
          setTimeout(() => close(), 10);
        }
      },
    });
  }
  root.render(<ModalBodySections close={close} {...props} />);
}
