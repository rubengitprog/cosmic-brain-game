import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './LevelBar.css';

const LevelBar: React.FC = () => {
  const { state } = useGame();
  const progress = (state.xp / state.xpToNextLevel) * 100;

  return (
    <div className="level-container">
      <div className="level-display">NIVEL {state.level}</div>
      <div className="xp-bar-background">
        <motion.div
          className="xp-bar-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <div className="xp-text">{`${state.xp.toLocaleString()} / ${state.xpToNextLevel.toLocaleString()} XP`}</div>
    </div>
  );
};

export default LevelBar;
