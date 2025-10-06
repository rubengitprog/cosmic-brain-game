import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useGameSound } from './SoundManager';
import TrophyButton from './TrophyButton';
import SkillTreeButton from './SkillTreeButton';
import AchievementNotification from './AchievementNotification';
import LevelBar from './LevelBar';
import EventDisplay from './EventDisplay';
import RebirthButton from './RebirthButton';
import Eureka from './Eureka';
import { Achievement } from '../context/GameContext';
import InsightDisplay from './InsightDisplay';
import DopamineEffect from './DopamineEffect';
import { calculatePointsPerSecond, calculatePointsPerClick } from '../utils/gameCalculations';
import './Game.css';

const Game: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playClickSound, playComboSound, playUpgradeSound, playAchievementSound } = useGameSound();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [clickCombo, setClickCombo] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [buttonScale, setButtonScale] = useState<number>(1);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);
  const [eureka, setEureka] = useState<{ id: number; top: string; left: string } | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- LÓGICA DE EVENTOS Y TEMPORIZADORES ---
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPointsPerSecond = calculatePointsPerSecond(state.upgrades);
      if (currentPointsPerSecond > 0) {
        const skillAutoMultiplier = state.skills.find(s => s.id === 'skill-3')?.currentLevel ? 1 + (0.1 * state.skills.find(s => s.id === 'skill-3')!.currentLevel) : 1;
        const skillUpgradeMultiplier = state.skills.find(s => s.id === 'skill-5')?.currentLevel ? 1 + (0.05 * state.skills.find(s => s.id === 'skill-5')!.currentLevel) : 1;
        
        const finalPassivePoints = currentPointsPerSecond * state.prestigeMultiplier * skillAutoMultiplier * skillUpgradeMultiplier;
        const xpGain = currentPointsPerSecond * (state.skills.find(s => s.id === 'skill-1')?.currentLevel ? 1 + (0.1 * state.skills.find(s => s.id === 'skill-1')!.currentLevel) : 1);
        
        dispatch({ type: 'GENERATE_POINTS', payload: finalPassivePoints });
        dispatch({ type: 'ADD_XP', payload: xpGain });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.upgrades, state.prestigeMultiplier, state.skills, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!eureka && Math.random() < 0.25) {
        const top = `${Math.random() * 50 + 20}%`;
        const left = `${Math.random() * 80 + 10}%`;
        setEureka({ id: Date.now(), top, left });
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [eureka]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.activeEvent && Math.random() < 0.15) {
        dispatch({
          type: 'START_EVENT',
          payload: { type: 'OVERLOAD', multiplier: 5, timeLeft: 5 },
        });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [state.activeEvent, dispatch]);

  useEffect(() => {
    if (!state.activeEvent) return;
    const timer = setInterval(() => {
      if (state.activeEvent && state.activeEvent.timeLeft > 0) {
        dispatch({ type: 'TICK_EVENT' });
      } else {
        dispatch({ type: 'END_EVENT' });
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state.activeEvent, dispatch]);

  useEffect(() => {
    if (clickCombo > state.maxCombo) {
      dispatch({ type: 'UPDATE_MAX_COMBO', payload: clickCombo });
    }

    state.achievements.forEach((achievement) => {
      if (achievement.unlocked) return;
      let conditionMet = false;
      const totalUpgrades = state.upgrades.reduce((sum, u) => sum + u.count, 0);
      const totalSkillsPurchased = state.skills.reduce((sum, skill) => sum + skill.currentLevel, 0);

      switch (achievement.id) {
        case 'points-1': conditionMet = state.points >= 1000; break;
        case 'points-2': conditionMet = state.points >= 100000; break;
        case 'points-3': conditionMet = state.points >= 1000000; break;
        case 'points-4': conditionMet = state.points >= 10000000; break;
        case 'points-5': conditionMet = state.points >= 100000000; break;
        case 'points-6': conditionMet = state.points >= 1000000000; break;
        case 'clicks-1': conditionMet = state.totalClicks >= 1000; break;
        case 'clicks-2': conditionMet = state.totalClicks >= 10000; break;
        case 'clicks-3': conditionMet = state.totalClicks >= 50000; break;
        case 'clicks-4': conditionMet = state.totalClicks >= 100000; break;
        case 'clicks-5': conditionMet = state.totalClicks >= 500000; break;
        case 'upgrade-1': conditionMet = totalUpgrades >= 10; break;
        case 'upgrade-2': conditionMet = totalUpgrades >= 50; break;
        case 'upgrade-3': conditionMet = totalUpgrades >= 100; break;
        case 'upgrade-4': conditionMet = state.upgrades.some(u => u.unlockedAtLevel && u.count > 0); break;
        case 'level-5': conditionMet = state.level >= 5; break;
        case 'level-10': conditionMet = state.level >= 10; break;
        case 'level-15': conditionMet = state.level >= 15; break;
        case 'level-20': conditionMet = state.level >= 20; break;
        case 'level-25': conditionMet = state.level >= 25; break;
        case 'level-30': conditionMet = state.level >= 30; break;
        case 'level-40': conditionMet = state.level >= 40; break;
        case 'combo-10': conditionMet = state.maxCombo >= 10; break;
        case 'combo-25': conditionMet = state.maxCombo >= 25; break;
        case 'combo-50': conditionMet = state.maxCombo >= 50; break;
        case 'combo-100': conditionMet = state.maxCombo >= 100; break;
        case 'pps-1': conditionMet = finalPointsPerSecond >= 1000; break;
        case 'pps-2': conditionMet = finalPointsPerSecond >= 10000; break;
        case 'ppc-1': conditionMet = finalPointsPerClick >= 1000; break;
        case 'ppc-2': conditionMet = finalPointsPerClick >= 10000; break;
        case 'event-1': conditionMet = state.activeEvent !== null; break;
        case 'skill-1': conditionMet = totalSkillsPurchased >= 1; break;
        case 'skill-5': conditionMet = totalSkillsPurchased >= 5; break;
        default: break;
      }

      if (conditionMet) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
        setLastUnlocked(achievement);
        playAchievementSound();
        setTimeout(() => setLastUnlocked(null), 4000);
      }
    });

    if (state.justLeveledUp) {
      console.log(`¡Felicidades! Has subido al nivel ${state.level}!`);
      playAchievementSound();
      dispatch({ type: 'RESET_LEVEL_UP_FLAG' });
    }
  }, [state, dispatch, playAchievementSound, clickCombo]);

  // --- MANEJADORES DE ACCIONES ---
  const handleBrainClick = (e: React.MouseEvent) => {
    const skillClickMultiplier = state.skills.find(s => s.id === 'skill-2')?.currentLevel ? 1 + (0.05 * state.skills.find(s => s.id === 'skill-2')!.currentLevel) : 1;
    const skillUpgradeMultiplier = state.skills.find(s => s.id === 'skill-5')?.currentLevel ? 1 + (0.05 * state.skills.find(s => s.id === 'skill-5')!.currentLevel) : 1;
    const skillXPMultiplier = state.skills.find(s => s.id === 'skill-1')?.currentLevel ? 1 + (0.1 * state.skills.find(s => s.id === 'skill-1')!.currentLevel) : 1;
    
    const clickPower = state.activeEvent?.type === 'OVERLOAD'
      ? currentPointsPerClick * state.activeEvent.multiplier
      : currentPointsPerClick;
      
    const finalClickPower = clickPower * state.prestigeMultiplier * skillClickMultiplier * skillUpgradeMultiplier;
    const xpGain = clickPower * skillXPMultiplier;

    dispatch({ type: 'INCREMENT_CLICKS' });
    dispatch({ type: 'GENERATE_POINTS', payload: finalClickPower });
    dispatch({ type: 'ADD_XP', payload: xpGain });
    playClickSound();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = { id: Date.now(), x, y, color: getRandomColor() };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== newParticle.id)), 1000);

    setButtonScale(0.9);
    setTimeout(() => setButtonScale(1), 100);

    const now = Date.now();
    const newCombo = (now - lastClickTime < 1000) ? clickCombo + 1 : 1;
    setClickCombo(newCombo);
    if (newCombo > 1) playComboSound();
    setLastClickTime(now);

    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => setClickCombo(0), 1000);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    if (upgrade && state.points >= upgrade.cost) {
      playUpgradeSound();
      dispatch({ type: 'BUY_UPGRADE', payload: upgradeId });
    }
  };

  const handleEurekaClick = () => {
    dispatch({ type: 'GRANT_EUREKA_REWARD' });
    playAchievementSound();
    setEureka(null);
  };

  const getRandomColor = (): string => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Cálculo dinámico de estadísticas basadas en mejoras y habilidades
  const currentPointsPerSecond = calculatePointsPerSecond(state.upgrades);
  const currentPointsPerClick = state.pointsPerClick + calculatePointsPerClick(state.upgrades);
  
  // Aplicar efectos de habilidades
  const skillXPMultiplier = state.skills.find(s => s.id === 'skill-1')?.currentLevel ? 1 + (0.1 * state.skills.find(s => s.id === 'skill-1')!.currentLevel) : 1;
  const skillClickMultiplier = state.skills.find(s => s.id === 'skill-2')?.currentLevel ? 1 + (0.05 * state.skills.find(s => s.id === 'skill-2')!.currentLevel) : 1;
  const skillAutoMultiplier = state.skills.find(s => s.id === 'skill-3')?.currentLevel ? 1 + (0.1 * state.skills.find(s => s.id === 'skill-3')!.currentLevel) : 1;
  const skillUpgradeMultiplier = state.skills.find(s => s.id === 'skill-5')?.currentLevel ? 1 + (0.05 * state.skills.find(s => s.id === 'skill-5')!.currentLevel) : 1;
  
  // Aplicar también el efecto del prestigio
  const finalPointsPerSecond = currentPointsPerSecond * skillAutoMultiplier * state.prestigeMultiplier * skillUpgradeMultiplier;
  const finalPointsPerClick = currentPointsPerClick * skillClickMultiplier * state.prestigeMultiplier * skillUpgradeMultiplier;
  
  // Función para comprar habilidad
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
      playUpgradeSound();
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="game-container">
      <TrophyButton />
      <RebirthButton />
      <EventDisplay />

      <AnimatePresence>
        {eureka && (
          <Eureka
            key={eureka.id}
            top={eureka.top}
            left={eureka.left}
            onClick={handleEurekaClick}
            onEnd={() => setEureka(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastUnlocked && (
          <AchievementNotification key={lastUnlocked.id} name={lastUnlocked.name} />
        )}
      </AnimatePresence>

      <div className="top-hud">
        <div className="points-display">
          <h1 className="points">{state.points.toLocaleString()}</h1>
          <p className="points-per-second">+{finalPointsPerSecond.toLocaleString()}/seg</p>
          <p className="points-per-click">+{finalPointsPerClick.toLocaleString()}/clic</p>
        </div>

        <LevelBar />

        <div className="status-displays">
          {state.rebirths > 0 && (
            <div className="prestige-display">
              Bono de Prestigio: +{((state.prestigeMultiplier - 1) * 100).toFixed(0)}%
            </div>
          )}
          <InsightDisplay />
        </div>
      </div>

      <div className="game-area">
        <motion.div
          className="brain-button"
          onClick={handleBrainClick}
          animate={{ scale: buttonScale }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="particle"
                style={{ left: p.x, top: p.y, backgroundColor: p.color }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            ))}
          </AnimatePresence>

          <motion.div
            className="pulse-ring"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />

          <div className="brain-icon">
            <div className="brain-shape">
              <div className="hemisphere left"></div>
              <div className="hemisphere right"></div>
              <div className="connection"></div>
            </div>
          </div>
        </motion.div>

        {clickCombo > 1 && (
          <motion.div
            className="combo-display"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            x{clickCombo} COMBO!
          </motion.div>
        )}
      </div>

      <SkillTreeButton />

      <div className="permanent-upgrades-panel">
        <h2>Mejoras Cerebrales</h2>
        <div className="upgrades-list">
          {state.upgrades
            .filter(u => !u.unlockedAtLevel || state.level >= u.unlockedAtLevel)
            .map(upgrade => (
              <motion.div
                key={upgrade.id}
                className={`upgrade-item ${state.points >= upgrade.cost ? 'affordable' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => buyUpgrade(upgrade.id)}
              >
                <h3>{upgrade.name}</h3>
                <p>{upgrade.description}</p>
                <div className="upgrade-stats">
                  <span>Costo: {upgrade.cost.toLocaleString()}</span>
                  <span>Cantidad: {upgrade.count}</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
      <DopamineEffect />
    </div>
  );
};

export default Game;
