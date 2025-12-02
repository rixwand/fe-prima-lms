import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { ReactNode, useState } from "react";
import { createRoot } from "react-dom/client";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type SectionsDialogType = {
  content: (close: () => void) => ReactNode;
  title: string;
  isLoading?: boolean;
  onSubmit: () => Promise<void>;
  onCancel?: () => Promise<void>;
  open?: boolean;
};

const ModalBodySections = ({
  content: children,
  isLoading: externalLoading = false,
  close,
  title,
  onSubmit,
  onCancel,
}: SectionsDialogType & { close: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(externalLoading);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onSubmit();
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

  const handleClose = () => {
    setIsOpen(false);
    close();
  };

  return (
    <Modal isDismissable={false} onClose={handleCancel} isKeyboardDismissDisabled={true} isOpen={isOpen}>
      <ModalContent className="bg-gradient-to-br from-gray-50 to-white text-slate-900 max-w-xl">
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody className="">{children(handleClose)}</ModalBody>
        <ModalFooter>
          <Button isDisabled={loading} color="danger" variant="light" onPress={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleConfirm} isDisabled={loading}>
            {loading ? <Spinner color="white" size="sm" /> : "Submit"}
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

export default function AddSectionsDialog<T extends FieldValues>({ formSubscribe, fieldName, ...props }: Props<T>) {
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
          // close();
        }
      },
    });
  }
  root.render(<ModalBodySections close={close} {...props} />);
}
