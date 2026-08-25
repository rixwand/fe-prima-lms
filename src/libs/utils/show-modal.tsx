import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

type ShowModalProps = {
  title: string;
  children: React.FC;
  onClose?: () => void;
};

const MessageModal = ({ close, title, children: Children, onClose }: ShowModalProps & { close: VoidFn }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    close();
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" backdrop="blur" size="lg">
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">{title}</ModalHeader>

        <ModalBody className="text-slate-600">
          <Children />
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export function showModal(props: ShowModalProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<MessageModal close={close} {...props} />);
}
