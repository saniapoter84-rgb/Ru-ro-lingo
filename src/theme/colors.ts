// Тёмная минималистичная тема.
//
// Ориентир — «стеклянные» игровые оверлеи: почти чёрный фон, панели чуть
// светлее фона с тонкой светящейся рамкой, один яркий акцент (фиолетовый)
// и очень сдержанная типографика. Никаких мультяшных цветов: приложение
// должно выглядеть как инструмент, а не как детская игра.

export const colors = {
  // Фон и поверхности
  bg: '#0B0B10',
  bgElevated: '#101017',
  card: '#14141D',
  cardHover: '#1A1A25',
  /** Полупрозрачная плашка поверх карточки — «стекло». */
  glass: 'rgba(255,255,255,0.04)',
  glassStrong: 'rgba(255,255,255,0.07)',

  // Рамки
  border: '#1F1F2B',
  borderBright: '#2A2A3A',

  // Акцент
  primary: '#8B5CF6',
  primaryBright: '#A78BFA',
  primaryDim: 'rgba(139,92,246,0.16)',
  primaryGlow: 'rgba(139,92,246,0.35)',

  // Вторичные акценты
  accent: '#22D3EE',
  accentDim: 'rgba(34,211,238,0.14)',
  pink: '#F472B6',

  // Состояния
  success: '#34D399',
  successDim: 'rgba(52,211,153,0.14)',
  danger: '#FB7185',
  dangerDim: 'rgba(251,113,133,0.14)',
  warning: '#FBBF24',
  warningDim: 'rgba(251,191,36,0.14)',

  // Текст
  text: '#F4F4F7',
  textDim: '#9C9CB0',
  textFaint: '#5E5E72',

  locked: '#1A1A24',
  white: '#FFFFFF',
  black: '#000000',
};

/** Флаги стран — RU родной, RO изучаемый. Смысл названия приложения. */
export const FLAG_NATIVE = '🇷🇺';
export const FLAG_TARGET = '🇷🇴';

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

/** Мягкая тень с фиолетовым отливом — только для активных элементов. */
export const glow = {
  shadowColor: colors.primary,
  shadowOpacity: 0.45,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
};

export const softShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.5,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
};
