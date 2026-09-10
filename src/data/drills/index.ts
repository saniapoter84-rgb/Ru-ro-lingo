import { DrillPack } from './types';
import { DRILLS_CH1 } from './ch1';
import { DRILLS_CH2 } from './ch2';
import { DRILLS_CH3 } from './ch3';
import { DRILLS_CH4 } from './ch4';
import { DRILLS_CH5 } from './ch5';
import { DRILLS_CH6 } from './ch6';
import { DRILLS_CH7 } from './ch7';
import { DRILLS_CH8 } from './ch8';
import { DRILLS_CH9 } from './ch9';

export * from './types';

/** Все пачки практики. Ключ пачки совпадает с id урока, к которому она привязана. */
export const DRILL_PACKS: DrillPack[] = [
  ...DRILLS_CH1,
  ...DRILLS_CH2,
  ...DRILLS_CH3,
  ...DRILLS_CH4,
  ...DRILLS_CH5,
  ...DRILLS_CH6,
  ...DRILLS_CH7,
  ...DRILLS_CH8,
  ...DRILLS_CH9,
];

const BY_ID = new Map(DRILL_PACKS.map((pack) => [pack.id, pack]));

export function getDrillPack(lessonId: string): DrillPack | undefined {
  return BY_ID.get(lessonId);
}

export const DRILL_PACK_IDS = DRILL_PACKS.map((pack) => pack.id);
