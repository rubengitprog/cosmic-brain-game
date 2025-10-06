import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementsModal from './AchievementsModal';
import './TrophyButton.css';

const TrophyButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.button
        className="trophy-button"
        onClick={openModal}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        🏆
      </motion.button>
      {isModalOpen && <AchievementsModal onClose={closeModal} />}
    </>
  );
};

export default TrophyButton;
