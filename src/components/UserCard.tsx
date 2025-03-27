"use client";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Options {
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

interface UserCardProps {
  session: Session;
  options: Options[];
}

export const UserCard = ({ session, options }: UserCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !photoRef.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-end group">
      <div
        className="w-16 h-16 rounded-full overflow-hidden relative bg-gray-200 border border-gray-300 shadow"
        onClick={toggleMenu}
        ref={photoRef}
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={`Foto de ${session.user.name}`}
            width={64}
            height={64}
            className="object-cover"
          />
        ) : null}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute -left-1/4 transform -translate-x-1/2 top-full mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-300 w-64 z-[1000]"
        >
          <h3 className="font-bold text-lg text-center" onClick={handleClose}>
            {session.user.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Correo: {session.user.email}
          </p>
          {options.map((option, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { scale: 1 },
                hover: {
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                },
                tap: { scale: 0.98 },
              }}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <button
                onClick={() => {
                  handleClose();
                  if (option.onClick) option.onClick();
                }}
                className="w-full flex flex-row items-center py-2 text-left hover:bg-gray-100"
              >
                <div className="px-4">{option.icon}</div>
                <p className={option.className}>{option.label}</p>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
