import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center shadow-lg"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        🍔
      </motion.div>
      <motion.span
        className="mt-6 text-xl font-bold text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      >
        Welcome to Spice Palace...
      </motion.span>
    </div>
  );
};

export default Loader;
