import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

type InformationDialogType = {
  title: string;
  desc: string;
  onClose?: () => void;
  loaderDelay?: number;
};

const InformationModal = ({ close, desc, title, onClose, loaderDelay }: InformationDialogType & { close: VoidFn }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = async () => {
    if (isClosing) return;

    setIsClosing(true);

    if (loaderDelay && loaderDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, loaderDelay));
    }

    setIsOpen(false);
    close();
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
      isDismissable={!isClosing}
      isKeyboardDismissDisabled={isClosing}>
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">{title}</ModalHeader>

        <ModalBody className="text-slate-600">
          <p className="whitespace-pre-line">{desc}</p>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose} isLoading={isClosing} isDisabled={isClosing}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export function informationDialog(props: InformationDialogType) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<InformationModal close={close} {...props} />);
}
