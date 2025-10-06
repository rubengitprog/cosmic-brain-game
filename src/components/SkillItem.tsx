import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import './Skills.css';

interface SkillItemProps {
  skillId: string;
  onClick: (skillId: string) => void;
}

const SkillItem: React.FC<SkillItemProps> = ({ skillId, onClick }) => {
  const { state } = useGame();
  const skill = state.skills.find(s => s.id === skillId);

  if (!skill) return null;

  const canAfford = state.insight >= skill.cost;
  const canUpgrade = skill.currentLevel < skill.maxLevel;
  const hasPrerequisite = !skill.prerequisite || 
    (state.skills.find(s => s.id === skill.prerequisite)?.currentLevel ?? 0) > 0;

  return (
    <motion.div
      className={`skill-item ${canAfford && canUpgrade && hasPrerequisite ? 'affordable' : ''} ${!hasPrerequisite ? 'locked' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(skillId)}
      style={{ 
        opacity: !hasPrerequisite ? 0.5 : 1,
        pointerEvents: canAfford && canUpgrade && hasPrerequisite ? 'auto' : 'none'
      }}
    >
      <div className="skill-header">
        <h3>{skill.name} {skill.currentLevel > 0 ? `(${skill.currentLevel}/${skill.maxLevel})` : ''}</h3>
        <span className="skill-cost">{skill.cost} 🧠</span>
      </div>
      <p>{skill.description}</p>
      <div className="skill-progress">
        <div 
          className="skill-progress-bar" 
          style={{ width: `${(skill.currentLevel / skill.maxLevel) * 100}%` }}
        ></div>
      </div>
      {skill.prerequisite && !hasPrerequisite && (
        <div className="prerequisite-notice">Requiere: {state.skills.find(s => s.id === skill.prerequisite)?.name || 'Habilidad Requerida'}</div>
      )}
    </motion.div>
  );
};

export default SkillItem;