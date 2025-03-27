import React, { useRef, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageViewProps {
  src: string;
  alt: string;
  smallProps: Omit<ImageProps, "src" | "alt">;
  largeProps: Omit<ImageProps, "src" | "alt">;
  title?: string;
  isOpen?: boolean;
}

export const ImageView = ({
  src,
  alt,
  smallProps,
  largeProps,
  title,
  isOpen = false,
}: ImageViewProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="w-full mt-2 flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <Image src={src} alt={alt} {...smallProps} />
      </div>

      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed z-[3000] inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="relative mx-8 flex flex-col justify-center items-center gap-4 z-50 bg-white p-5 lg:p-7 rounded-lg">
            <div
              className="w-8 h-8 bg-white absolute -top-4 -right-4 text-2xl font-bold text-black text-center rounded-full shadow-lg flex items-center justify-center cursor-pointer"
              onClick={handleClose}
            >
              &times;
            </div>
            <h1 className="text-xl font-bold">{title || "Imagen cargada"}</h1>
            <Image src={src} alt={alt} {...largeProps} />
          </div>
        </div>
      )}
    </>
  );
};
