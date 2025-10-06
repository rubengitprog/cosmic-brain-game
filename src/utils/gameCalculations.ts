import { GameState, Upgrade } from '../context/GameContext';

// Función para calcular puntos por segundo basado en mejoras
export const calculatePointsPerSecond = (upgrades: Upgrade[]): number => {
  return upgrades
    .filter(upgrade => upgrade.type === 'auto')
    .reduce((total, upgrade) => total + (upgrade.value * upgrade.count), 0);
};

// Función para calcular puntos por clic basado en mejoras
export const calculatePointsPerClick = (upgrades: Upgrade[]): number => {
  return upgrades
    .filter(upgrade => upgrade.type === 'click')
    .reduce((total, upgrade) => total + (upgrade.value * upgrade.count), 0);
};