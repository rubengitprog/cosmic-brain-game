import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './EventDisplay.css';

const EventDisplay: React.FC = () => {
  const { state } = useGame();

  return (
    <AnimatePresence>
      {state.activeEvent && (
        <motion.div
          className="event-display-container"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <h3>¡Sobrecarga Neuronal!</h3>
          <p>Poder de clic x{state.activeEvent.multiplier}</p>
          <div className="timer-bar-background">
            <motion.div
              className="timer-bar-foreground"
              initial={{ width: '100%' }}
              animate={{ width: `${(state.activeEvent.timeLeft / 10) * 100}%` }} // Asumiendo 10s de duración
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDisplay;
