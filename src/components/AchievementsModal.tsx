import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './AchievementsModal.css';

interface AchievementsModalProps {
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const { state } = useGame();

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          onClick={(e) => e.stopPropagation()} // Evita que el clic se propague al fondo
        >
          <div className="modal-header">
            <h2>Logros</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="achievements-list">
            {state.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`achievement-item ${achievement.unlocked ? 'unlocked' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="achievement-icon">{achievement.unlocked ? '🏆' : '🔒'}</div>
                <div className="achievement-details">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementsModal;
