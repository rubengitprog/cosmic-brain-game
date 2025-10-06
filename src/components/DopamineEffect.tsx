import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './DopamineEffect.css';

const DopamineEffect: React.FC = () => {
  const { state } = useGame();
  const [levelMilestone, setLevelMilestone] = useState<number | null>(null);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    // Verificar si se alcanzó un hito de nivel
    if (state.level % 10 === 0 && state.level > 0 && state.level <= 40) {
      // Asegurarse de que es un hito nuevo
      const isMilestone = [10, 20, 30, 40].includes(state.level);
      if (isMilestone) {
        setLevelMilestone(state.level);
        setShowEffect(true);
        // Ocultar después de 3 segundos
        const timer = setTimeout(() => setShowEffect(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [state.level]);

  if (!showEffect || levelMilestone === null) return null;

  const getMessage = (level: number) => {
    switch(level) {
      case 10: return "¡Nivel 10! ¡Excelente progreso!";
      case 20: return "¡Nivel 20! ¡Tu cerebro brilla!";
      case 30: return "¡Nivel 30! ¡Un genio en acción!";
      case 40: return "¡Nivel 40! ¡Maestro del cerebro!";
      default: return `¡Nivel ${level}! ¡Increíble!`;
    }
  };

  const getParticleCount = (level: number) => {
    return Math.min(50, level * 3); // Más partículas para niveles más altos
  };

  return (
    <AnimatePresence>
      {showEffect && (
        <motion.div 
          className="dopamine-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="dopamine-message"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>🎉 {getMessage(levelMilestone)} 🧠</h2>
            <p className="level-indicator">¡Has alcanzado el nivel {levelMilestone}!</p>
          </motion.div>
          
          {/* Generar partículas dinámicamente */}
          {Array.from({ length: getParticleCount(levelMilestone) }).map((_, index) => (
            <motion.div
              key={index}
              className="dopamine-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ 
                scale: 0, 
                opacity: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100
              }}
              transition={{ 
                duration: 2,
                delay: Math.random() * 0.5
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DopamineEffect;