import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import './Achievements.css';

const Achievements: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="achievements-panel">
      <h2>Logros Desbloqueados</h2>
      <div className="achievements-list">
        {state.achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`achievement-item ${achievement.unlocked ? 'unlocked' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="achievement-icon">{achievement.unlocked ? '🏆' : '🔒'}</div>
            <div className="achievement-details">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
