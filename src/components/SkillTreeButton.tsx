import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SkillsPanel from './SkillsPanel';
import './SkillTreeButton.css';

const SkillTreeButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.button
        className="skilltree-button"
        onClick={openModal}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        🧠
      </motion.button>
      {isModalOpen && <SkillsPanel onClose={closeModal} />}
    </>
  );
};

export default SkillTreeButton;