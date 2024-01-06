"use client";

import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { title } from "process";
import { MouseEventHandler, useState } from "react";

type PopupProps = {
  title?: string;
  text: string;
  onClick?: any;
  className?: string;
  buttonText?: string;
};

export default function Popup({
  title,
  text,
  onClick,
  className,
  buttonText,
}: PopupProps) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Modal
        isOpen={open}
        onOpenChange={() => setOpen(!open)}
        isDismissable={false}
        size="xl"
        className={className}
      >
        <ModalContent>
          {open ? (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="whitespace-pre-line">{text}</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    onClick ? onClick() : setOpen(!open);
                  }}
                >
                  {buttonText ?? "Ok"}
                </Button>
              </ModalFooter>
            </>
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
}
