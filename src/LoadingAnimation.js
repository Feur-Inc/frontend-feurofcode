import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="text-3d"
        animate={{
          rotateX: [20, 0, 20],
          rotateY: [-20, 0, -20],
          z: [0, 50, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Feur
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;