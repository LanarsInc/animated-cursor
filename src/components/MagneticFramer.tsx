import React, { ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticFramer = ({ children }: { children: ReactNode }) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const offsetX = clientX - centerX;
    const offsetY = clientY - centerY;
    const normalizedX = offsetX / (width / 2);
    const normalizedY = offsetY / (height / 2);
    const middleX = normalizedX * 5;
    const middleY = normalizedY * 5;

    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      animate={{ x, y }}
      className="magnetic-framer"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: 'spring', stiffness: 150, damping: 50, mass: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticFramer;

