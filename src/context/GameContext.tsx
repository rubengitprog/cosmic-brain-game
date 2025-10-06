import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  value: number;
  count: number;
  type: 'click' | 'auto';
  unlockedAtLevel?: number;
  category: 'basic' | 'advanced' | 'expert';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number; // Costo en insight
  type: 'passive' | 'active';
  effect: string;
  maxLevel: number;
  currentLevel: number;
  prerequisite?: string; // ID de habilidad requerida
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface ActiveEvent {
  type: 'OVERLOAD';
  multiplier: number;
  timeLeft: number;
}

export interface GameState {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  totalClicks: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  justLeveledUp: boolean;
  maxCombo: number;
  rebirths: number;
  prestigeMultiplier: number;
  insight: number;
  upgrades: Upgrade[];
  skills: Skill[];
  achievements: Achievement[];
  activeEvent: ActiveEvent | null;
}

// Acciones del juego
export type GameAction =
  | { type: 'GENERATE_POINTS'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'INCREMENT_CLICKS' }
  | { type: 'UPDATE_MAX_COMBO'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'RESET_LEVEL_UP_FLAG' }
  | { type: 'START_EVENT'; payload: ActiveEvent }
  | { type: 'TICK_EVENT' }
  | { type: 'END_EVENT' }
  | { type: 'GRANT_EUREKA_REWARD' }
  | { type: 'REBIRTH' }
  | { type: 'BUY_UPGRADE'; payload: string }
  | { type: 'BUY_SKILL'; payload: string };
  

// Estado inicial
const initialState: GameState = {
  points: 0,
  pointsPerClick: 1,
  pointsPerSecond: 0,
  totalClicks: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  justLeveledUp: false,
  maxCombo: 0,
  rebirths: 0,
  prestigeMultiplier: 1,
  insight: 0,
  upgrades: [
    { id: 'click-1', name: 'Neuronas Rápidas', description: 'Aumenta puntos por clic en 1', cost: 10, value: 1, count: 0, type: 'click', category: 'basic' },
    { id: 'click-2', name: 'Conexiones Sinápticas', description: 'Aumenta puntos por clic en 5', cost: 50, value: 5, count: 0, type: 'click', category: 'basic' },
    { id: 'click-3', name: 'Activación Cerebral', description: 'Aumenta puntos por clic en 10', cost: 100, value: 10, count: 0, type: 'click', category: 'basic' },
    { id: 'auto-1', name: 'Procesamiento Automático', description: 'Genera 1 punto por segundo', cost: 20, value: 1, count: 0, type: 'auto', category: 'basic' },
    { id: 'auto-2', name: 'Subrutinas Neuronales', description: 'Genera 5 puntos por segundo', cost: 100, value: 5, count: 0, type: 'auto', category: 'basic' },
    { id: 'auto-3', name: 'Redes Cerebrales', description: 'Genera 10 puntos por segundo', cost: 200, value: 10, count: 0, type: 'auto', category: 'basic' },
    { id: 'click-4', name: 'Impulso Neuronal', description: 'Aumenta puntos por clic en 25', cost: 500, value: 25, count: 0, type: 'click', category: 'advanced', unlockedAtLevel: 10 },
    { id: 'click-5', name: 'Explosión Cerebral', description: 'Aumenta puntos por clic en 100', cost: 2000, value: 100, count: 0, type: 'click', category: 'advanced', unlockedAtLevel: 20 },
    { id: 'auto-4', name: 'Mente Autónoma', description: 'Genera 50 puntos por segundo', cost: 1000, value: 50, count: 0, type: 'auto', category: 'advanced', unlockedAtLevel: 15 },
    { id: 'auto-5', name: 'Inteligencia Distribuida', description: 'Genera 200 puntos por segundo', cost: 5000, value: 200, count: 0, type: 'auto', category: 'advanced', unlockedAtLevel: 25 },
    { id: 'click-6', name: 'Iluminación Mental', description: 'Aumenta puntos por clic en 500', cost: 10000, value: 500, count: 0, type: 'click', category: 'expert', unlockedAtLevel: 30 },
    { id: 'auto-6', name: 'Conciencia Cuántica', description: 'Genera 1000 puntos por segundo', cost: 25000, value: 1000, count: 0, type: 'auto', category: 'expert', unlockedAtLevel: 40 },
  ],
  skills: [
    { id: 'skill-1', name: 'Aprendizaje Acelerado', description: 'Aumenta ganancia de XP en 10%', cost: 5, type: 'passive', effect: 'xpMultiplier', maxLevel: 5, currentLevel: 0 },
    { id: 'skill-2', name: 'Memoria Fotográfica', description: 'Aumenta puntos por clic en 5%', cost: 10, type: 'passive', effect: 'clickMultiplier', maxLevel: 10, currentLevel: 0 },
    { id: 'skill-3', name: 'Automatización Cerebral', description: 'Aumenta puntos por segundo en 10%', cost: 15, type: 'passive', effect: 'autoMultiplier', maxLevel: 10, currentLevel: 0 },
    { id: 'skill-4', name: 'Concentración Profunda', description: 'Multiplica todos los puntos durante 10 segundos', cost: 20, type: 'active', effect: 'multiplier', maxLevel: 3, currentLevel: 0 },
    { id: 'skill-5', name: 'Sinergia Neural', description: 'Multiplica efecto de mejoras en 5%', cost: 25, type: 'passive', effect: 'upgradeMultiplier', maxLevel: 5, currentLevel: 0, prerequisite: 'skill-1' },
  ],
  achievements: [
    { id: 'points-1', name: 'Primeros Pasos', description: 'Alcanza 1,000 puntos', unlocked: false },
    { id: 'points-2', name: 'Aprendiz del Cerebro', description: 'Alcanza 100,000 puntos', unlocked: false },
    { id: 'points-3', name: 'Explorador Cerebral', description: 'Alcanza 1,000,000 puntos', unlocked: false },
    { id: 'clicks-1', name: 'Cerebro Activo', description: 'Realiza 1,000 clics', unlocked: false },
    { id: 'clicks-2', name: 'Maestro Clickeador', description: 'Realiza 10,000 clics', unlocked: false },
    { id: 'level-5', name: 'Nivel Intermedio', description: 'Alcanza el nivel 5', unlocked: false },
    { id: 'level-10', name: 'Experto en Cerebro', description: 'Alcanza el nivel 10', unlocked: false },
    { id: 'level-20', name: 'Maestro del Cerebro', description: 'Alcanza el nivel 20', unlocked: false },
    { id: 'level-30', name: 'Legendario Cerebro', description: 'Alcanza el nivel 30', unlocked: false },
    { id: 'upgrade-1', name: 'Primeras Mejoras', description: 'Compra 10 mejoras en total', unlocked: false },
    { id: 'upgrade-2', name: 'Constructor de Cerebros', description: 'Compra 50 mejoras en total', unlocked: false },
    { id: 'combo-10', name: 'Combo Experto', description: 'Alcanza un combo de 10', unlocked: false },
    { id: 'combo-25', name: 'Combos Maestros', description: 'Alcanza un combo de 25', unlocked: false },
    { id: 'skill-1', name: 'Aprendiz de Habilidades', description: 'Compra tu primera habilidad', unlocked: false },
    { id: 'skill-5', name: 'Maestro de Habilidades', description: 'Compra 5 habilidades', unlocked: false },
  ],
  activeEvent: null,
};

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'GENERATE_POINTS':
      return { ...state, points: state.points + action.payload };

    case 'ADD_XP': {
      const newXp = state.xp + action.payload;
      if (newXp >= state.xpToNextLevel) {
        const newLevel = state.level + 1;
        const leftoverXp = newXp - state.xpToNextLevel;
        const newXpToNextLevel = Math.floor(100 * Math.pow(newLevel, 1.5));
        return {
          ...state,
          level: newLevel,
          xp: leftoverXp,
          xpToNextLevel: newXpToNextLevel,
          points: state.points + 1000 * state.level,
          justLeveledUp: true,
        };
      }
      return { ...state, xp: newXp };
    }

    case 'INCREMENT_CLICKS':
      return { ...state, totalClicks: state.totalClicks + 1 };

    case 'UPDATE_MAX_COMBO':
      return action.payload > state.maxCombo
        ? { ...state, maxCombo: action.payload }
        : state;

    case 'UNLOCK_ACHIEVEMENT': {
      const idx = state.achievements.findIndex(a => a.id === action.payload);
      if (idx === -1 || state.achievements[idx].unlocked) return state;
      const newAchievements = [...state.achievements];
      newAchievements[idx] = { ...newAchievements[idx], unlocked: true };
      return { ...state, achievements: newAchievements };
    }

    case 'RESET_LEVEL_UP_FLAG':
      return { ...state, justLeveledUp: false };

    case 'START_EVENT':
      return { ...state, activeEvent: action.payload };

    case 'TICK_EVENT':
      if (!state.activeEvent) return state;
      return {
        ...state,
        activeEvent: {
          ...state.activeEvent,
          timeLeft: state.activeEvent.timeLeft - 1,
        },
      };

    case 'END_EVENT':
      return { ...state, activeEvent: null };

    case 'REBIRTH': {
      if (state.level < 40) return state;
      const newRebirths = state.rebirths + 1;
      const newPrestigeMultiplier = 1 + newRebirths * 0.5;
      const insightGained = Math.floor(state.level / 5);
      const currentSkills = [...state.skills]; // Guardar las habilidades actuales

      return {
        ...initialState,
        rebirths: newRebirths,
        prestigeMultiplier: newPrestigeMultiplier,
        achievements: state.achievements,
        insight: state.insight + insightGained,
        skills: currentSkills.map(skill => ({ ...skill, currentLevel: skill.currentLevel })), // Mantener niveles de habilidades al renacer
      };
    }

    case 'BUY_UPGRADE': {
      const upgradeToBuy = state.upgrades.find(upg => upg.id === action.payload);
      if (!upgradeToBuy || state.points < upgradeToBuy.cost) {
        return state; // No se puede comprar si no hay suficientes puntos
      }
      
      const updatedUpgrades = state.upgrades.map(upg =>
        upg.id === action.payload
          ? {
              ...upg,
              count: upg.count + 1,
              cost: Math.round(upg.cost * 1.25),
            }
          : upg
      );
      
      const pointsAfterPurchase = state.points - upgradeToBuy.cost;
      
      return { ...state, upgrades: updatedUpgrades, points: pointsAfterPurchase };
    }

    case 'BUY_SKILL': {
      const skillToBuy = state.skills.find(s => s.id === action.payload);
      if (!skillToBuy || skillToBuy.currentLevel >= skillToBuy.maxLevel || state.insight < skillToBuy.cost) {
        return state; // No se puede comprar la habilidad
      }
      
      // Verificar si tiene la habilidad prerequisito
      if (skillToBuy.prerequisite) {
        const prereqSkill = state.skills.find(s => s.id === skillToBuy.prerequisite);
        if (!prereqSkill || prereqSkill.currentLevel === 0) {
          return state; // No tiene la habilidad prerequisito
        }
      }
      
      // Actualizar la habilidad
      const updatedSkills = state.skills.map(skill => 
        skill.id === action.payload 
          ? { ...skill, currentLevel: skill.currentLevel + 1 } 
          : skill
      );
      
      // Gastar insight
      const updatedInsight = state.insight - skillToBuy.cost;
      
      // Desbloquear logro si es la primera habilidad comprada
      let updatedAchievements = [...state.achievements];
      const totalSkillsPurchased = updatedSkills.reduce((sum, skill) => sum + skill.currentLevel, 0);
      
      if (totalSkillsPurchased === 1) {
        const skillAchievementIndex = updatedAchievements.findIndex(a => a.id === 'skill-1');
        if (skillAchievementIndex !== -1) {
          updatedAchievements[skillAchievementIndex] = { ...updatedAchievements[skillAchievementIndex], unlocked: true };
        }
      }
      
      if (totalSkillsPurchased >= 5) {
        const skills5AchievementIndex = updatedAchievements.findIndex(a => a.id === 'skill-5');
        if (skills5AchievementIndex !== -1) {
          updatedAchievements[skills5AchievementIndex] = { ...updatedAchievements[skills5AchievementIndex], unlocked: true };
        }
      }
      
      return { ...state, skills: updatedSkills, insight: updatedInsight, achievements: updatedAchievements };
    }

    case 'GRANT_EUREKA_REWARD': {
      const insightGained = 1; // Cada Eureka otorga 1 de insight
      return { ...state, insight: state.insight + insightGained };
    }

    default:
      return state;
  }
};

// Contexto y Proveedor
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
