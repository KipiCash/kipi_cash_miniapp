"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DinamicCardProps {
  message: string;
  children?: React.ReactNode;
  className?: string;
  messageClassName?: string;
  defaultOpen?: boolean;
}

export const DinamicCard = ({
  message,
  children,
  className,
  messageClassName,
  defaultOpen = false,
}: DinamicCardProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const onClickCard = (event: React.MouseEvent<HTMLDivElement>) => {
    const tgName = (event.target as HTMLElement).tagName;
    if (tgName === "IMG" || tgName === "BUTTON") {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer w-full md:w-1/2",
        !isMobile && "self-end",
        className
      )}
      onClick={onClickCard}
    >
      <p
        className={cn("text-base", !isMobile && "text-right", messageClassName)}
      >
        {message}
      </p>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.3,
                ease: "easeOut",
              },
              opacity: {
                duration: 0.1,
              },
            }}
          >
            <motion.div
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              exit={{ y: -60 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
