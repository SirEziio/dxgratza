import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DarkModeToggle: FC<DarkModeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div
      className="relative w-16 h-9 bg-gray-800 dark:bg-gray-300 rounded-full cursor-pointer overflow-hidden"
      onClick={toggleTheme}
    >
      <motion.div
        className="absolute top-1 left-1 w-7 h-7 bg-white dark:bg-black flex justify-center items-center shadow-md rounded-full" // Circle icon container
        initial={{ x: 0 }} // Start position of the circle
        animate={{
          x: isDarkMode ? 28 : 0, // Slide to the right or left
        }}
        transition={{
          x: { duration: 0.4, ease: "easeInOut" }, // Smooth slide transition
        }}
      >
        <Image
          src={isDarkMode ? '/icons/moon.svg' : '/icons/sun.svg'}
          alt={isDarkMode ? 'Moon icon' : 'Sun icon'}
          width={24}
          height={24}
          className={`sm:w-[24px] sm:h-[24px] w-[18px] h-[18px] ${isDarkMode ? 'invert' : ''}`}
        />
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
