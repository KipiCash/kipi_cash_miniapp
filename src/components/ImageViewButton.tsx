import React, { useRef, useState } from "react";
import Image, { ImageProps } from "next/image";
import { ButtonAnimated } from "./ButtonAnimated";

interface ImageViewButtonProps {
  src: string;
  alt: string;
  imageProps: Omit<ImageProps, "src" | "alt">;
  title?: string;
  buttonClassName?: string; // Permite estilos personalizados para el botón
  buttonText?: string; // Texto opcional para el botón
}

export const ImageViewButton = ({
  src,
  alt,
  imageProps,
  title,
  buttonClassName = "",
  buttonText = "Ver Imagen",
}: ImageViewButtonProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ButtonAnimated
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${buttonClassName}`}
        onClick={() => setIsModalOpen(true)}
        text={buttonText}
        variant="default"
      />
      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed z-[3000] inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="relative mx-8 flex flex-col justify-center items-center gap-4 z-50 bg-white p-5 lg:p-7 rounded-lg">
            <button
              className="w-8 h-8 bg-white absolute -top-4 -right-4 text-2xl font-bold text-black text-center rounded-full shadow-lg flex items-center justify-center cursor-pointer"
              onClick={handleClose}
            >
              &times;
            </button>
            <h1 className="text-xl font-bold">{title || "Imagen cargada"}</h1>
            <Image src={src} alt={alt} {...imageProps} />
          </div>
        </div>
      )}
    </>
  );
};
