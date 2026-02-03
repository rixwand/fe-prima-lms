import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

type InformationDialogType = {
  title: string;
  desc: string;
};

const InformationModal = ({ close, desc, title }: InformationDialogType & { close: VoidFn }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    close();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" backdrop="blur" size="lg">
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">{title}</ModalHeader>
        <ModalBody className="text-slate-600">
          <p className="whitespace-pre-line">{desc}</p>
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
