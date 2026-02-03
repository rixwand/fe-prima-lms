import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@heroui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

type ConfirmProps = {
  title: string;
  desc: string;
  onConfirmed: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  isLoading?: boolean;
};

function ConfirmModal({
  title,
  desc,
  onConfirmed,
  close,
  onCancel,
  isLoading: externalLoading = false,
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
        <ModalHeader className="text-lg font-semibold">{title}</ModalHeader>
        <ModalBody className="text-slate-600">
          <p className="whitespace-pre-line">{desc}</p>
        </ModalBody>
        <ModalFooter>
          {!loading && (
            <Button variant="light" onPress={handleCancel} isDisabled={loading}>
              Cancel
            </Button>
          )}
          <Button color="primary" onPress={handleConfirm} isDisabled={loading}>
            {loading ? <Spinner color="white" size="sm" /> : "Confirm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function confirmDialog({ title, desc, onConfirmed, isLoading }: ConfirmProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<ConfirmModal title={title} desc={desc} onConfirmed={onConfirmed} close={close} isLoading={isLoading} />);
}
