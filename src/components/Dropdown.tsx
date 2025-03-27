"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Options {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

interface DropdownProps {
  name: string;
  options: Options[];
  className?: string;
  onClick?: (value: string) => void;
}

export const Dropdown = ({
  name,
  className,
  onClick,
  options,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, triggerRef]);

  return (
    <div className="relative flex flex-col items-end">
      <div
        className="overflow-hidden relative text-black flex cursor-pointer h-auto w-64 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 shadow"
        onClick={toggleMenu}
        ref={triggerRef}
      >
        <span>{name}</span>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-300 w-64 z-[1000]"
        >
          {options.map((option, index) => (
            <motion.div
              key={`${name}-${option.value}-${index}`}
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
                  if (onClick) onClick(option.value);
                }}
                className="w-full flex flex-row items-center py-2 px-4 text-left hover:bg-gray-100"
              >
                {option.icon && <div>{option.icon}</div>}
                <p className={className}>{option.label}</p>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
