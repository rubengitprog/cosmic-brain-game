import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './RebirthButton.css';

const RebirthButton: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isConfirming, setIsConfirming] = useState(false);

  const canRebirth = state.level >= 40;
  if (!canRebirth) return null;

  const handleRebirthClick = () => {
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    dispatch({ type: 'REBIRTH' });
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const prestigeBonus = (state.rebirths + 1) * 50;

  return (
    <>
      <motion.button
        className="rebirth-button"
        onClick={handleRebirthClick}
        whileHover={{ scale: 1.1 }}
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: ['0 0 20px #ff9f43', '0 0 40px #ff6b6b', '0 0 20px #ff9f43']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Renacer
      </motion.button>

      {isConfirming && (
        <div className="confirmation-modal-backdrop">
          <motion.div 
            className="confirmation-modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2>Confirmar Renacimiento</h2>
            <p>¿Estás seguro de que quieres renacer?</p>
            <p>Tu progreso (puntos, mejoras, nivel) se reiniciará.</p>
            <p className="bonus-text">A cambio, obtendrás un <strong>+{prestigeBonus}%</strong> de bonus de producción permanente en tu próxima vida.</p>
            <div className="confirmation-buttons">
              <button onClick={handleConfirm} className="confirm-yes">Sí, quiero renacer</button>
              <button onClick={handleCancel} className="confirm-no">No, todavía no</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default RebirthButton;
