import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SkillItem from './SkillItem';
import './SkillsPanel.css';

interface SkillsPanelProps {
  onClose: () => void;
}

const SkillsPanel: React.FC<SkillsPanelProps> = ({ onClose }) => {
  const { state, dispatch } = useGame();

  const buySkill = (skillId: string) => {
    const skill = state.skills.find(s => s.id === skillId);
    if (skill && state.insight >= skill.cost && skill.currentLevel < skill.maxLevel) {
      if (skill.prerequisite) {
        const prereqSkill = state.skills.find(s => s.id === skill.prerequisite);
        if (!prereqSkill || prereqSkill.currentLevel === 0) {
          return; // No tiene la habilidad prerequisito
        }
      }
      dispatch({ type: 'BUY_SKILL', payload: skillId });
    }
  };

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
            <h2>Árbol de Habilidades</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="skills-grid">
            {state.skills.map(skill => (
              <SkillItem 
                key={skill.id} 
                skillId={skill.id} 
                onClick={buySkill} 
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillsPanel;