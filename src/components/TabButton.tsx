import { motion } from "framer-motion";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  notificationCount?: number;
}

export const TabButton = ({ isActive, onClick, children, notificationCount = 0 }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative px-8 py-2 text-sm font-medium transition-colors"
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {notificationCount > 0 && (
        <motion.span
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 bg-black text-white text-xs rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {notificationCount}
        </motion.span>
      )}
    </button>
  );
};
