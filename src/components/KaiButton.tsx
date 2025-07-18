import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface KaiButtonProps {
  className?: string;
}

const KaiButton: React.FC<KaiButtonProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className={`absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2 z-20 ${className}`}
    >
      <Link
        href="/kai-crew"
        className="group relative"
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/50 transition-all duration-300 hover:bg-white hover:shadow-xl"
        >
          <span className="text-sm font-medium text-indigo-700 group-hover:text-indigo-800 transition-colors duration-200">
            Say Hi to Kai
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default KaiButton; 