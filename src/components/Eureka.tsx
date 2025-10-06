import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Eureka.css';

interface EurekaProps {
  top: string;
  left: string;
  onClick: () => void;
  onEnd: () => void;
}

const Eureka: React.FC<EurekaProps> = ({ top, left, onClick, onEnd }) => {
  const [internalKey, setInternalKey] = useState(Date.now());

  useEffect(() => {
    const timer = setTimeout(onEnd, 5000); // Desaparece después de 5 segundos
    return () => clearTimeout(timer);
  }, [onEnd]);

  // Reiniciar la animación cuando la posición cambia
  useEffect(() => {
    setInternalKey(Date.now());
  }, [top, left]);

  return (
    <motion.div
      key={internalKey}
      className="eureka-clickable"
      style={{ top, left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, -10, 10, -10, 0] }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        default: { type: 'spring', stiffness: 120, damping: 15 },
        rotate: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.2, boxShadow: '0 0 40px #feca57' }}
    >
      💡
    </motion.div>
  );
};

export default Eureka;
