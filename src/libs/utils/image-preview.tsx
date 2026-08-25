import { Image, Modal, ModalBody, ModalContent } from "@heroui/react";
import NextImage from "next/image";
import { useState } from "react";
import { createRoot } from "react-dom/client";

type PreviewImageProps = {
  src: string;
  alt?: string;
};

function ImagePreviewModal({ src, alt, close }: PreviewImageProps & { close: () => void }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl" backdrop="blur" placement="center" hideCloseButton>
      <ModalContent className="shadow-none rounded-none bg-transparent w-fit h-fit sm:mx-0 sm:my-0">
        <ModalBody className="p-0 items-center justify-center">
          <Image
            radius="none"
            src={src}
            alt={alt ?? "Preview image"}
            fill
            unoptimized
            classNames={{
              img: "h-full! max-h-full w-auto! relative!",
            }}
            as={NextImage}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function previewImage(props: PreviewImageProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };

  root.render(<ImagePreviewModal {...props} close={close} />);
}
