import React from 'react';
import { useGame } from '../context/GameContext';
import './InsightDisplay.css';

const InsightDisplay: React.FC = () => {
  const { state } = useGame();

  if (state.insight === 0) return null;

  return (
    <div className="insight-display">
      <span className="insight-icon">🧠</span>
      <span className="insight-amount">{state.insight.toLocaleString()}</span>
      <span className="insight-label">Conocimiento</span>
    </div>
  );
};

export default InsightDisplay;
