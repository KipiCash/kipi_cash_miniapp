import { motion } from "framer-motion";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  tap: { scale: 0.98 },
};

export const ButtonAnimated = ({
  text,
  variant,
  className,
  onClick,
}: {
  text: string;
  variant: "link" | "outline" | "default" | "destructive";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="w-full"
      >
        <Button
          variant={variant}
          className={cn([
            className,
            "w-full font-medium",
            variant === "destructive" ? "bg-red-800 hover:bg-red-700" : "",
          ])}
          onClick={onClick}
        >
          {text}
        </Button>
      </motion.div>
    </motion.div>
  );
};
