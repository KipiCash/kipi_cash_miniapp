"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface TriggableModalProps {
  message: string;
  classNameTrigger?: string;
  classNameModal?: React.HTMLAttributes<HTMLDivElement>["className"];
  onClose?: () => void;
  children?: React.ReactNode;
}

export const TriggableModal: React.FC<TriggableModalProps> = ({
  message,
  classNameModal,
  classNameTrigger,
  onClose,
  children,
}: TriggableModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleClose = () => {
    if (onClose) onClose();
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-start gap-4">
      <Card
        className={cn("p-4 cursor-pointer", classNameTrigger)}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {message}
      </Card>
      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed z-[3000] inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            className={cn(
              "relative flex flex-col justify-center items-center gap-4 z-50 bg-white p-5 lg:p-7 rounded-lg",
              classNameModal
            )}
          >
            <div
              className="w-8 h-8 bg-white absolute -top-4 -right-4 text-2xl font-bold text-black text-center rounded-full shadow-lg flex items-center justify-center cursor-pointer"
              onClick={handleClose}
            >
              &times;
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
