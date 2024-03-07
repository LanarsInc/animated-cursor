import React, { ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticFramer = ({ children }: { children: ReactNode }) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cursor = document.getElementById('cursor-dot');

  const handleMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();

    //horizontal center point (X-axis) and vertical center point (Y-axis)
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    //the distance between the cursor position (clientX, clientY) and the center of the element
    const offsetX = clientX - centerX;
    const offsetY = clientY - centerY;

    //normalized values of the mouse cursor deviation from the center of the element
    const normalizedX = offsetX / (width / 2);
    const normalizedY = offsetY / (height / 2);

    //these values are scaled by 5 to increase the effect and define new cursor positions
    const middleX = normalizedX * 5;
    const middleY = normalizedY * 5;

    setPosition({ x: middleX, y: middleY });

    //calculate rotation angle based on cursor position
    const angle = Math.atan2(centerY, centerX) * (180 / Math.PI);

    if (cursor) {
      cursor.style.willChange = 'transform';
      cursor.style.transform = `translate(${middleX}px, ${middleY}px) rotate(${angle}deg)`;
      const scaleWidth = 1 - Math.abs(normalizedX) * 0.1;
      const scaleHeight = 1 - Math.abs(normalizedY) * 0.1;
      cursor.style.transform += `scale(${scaleWidth}, ${scaleHeight})`;
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    if (cursor) {
      cursor.style.transform = '';
      cursor.style.willChange = 'auto';
    }
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
