import React from 'react';
import { motion } from 'framer-motion';
import './AchievementNotification.css';

interface AchievementNotificationProps {
  name: string;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ name }) => {
  return (
    <motion.div
      className="achievement-notification"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      layout
    >
      <div className="icon">🏆</div>
      <div className="text-content">
        <h4>Logro Desbloqueado</h4>
        <p>{name}</p>
      </div>
    </motion.div>
  );
};

export default AchievementNotification;
