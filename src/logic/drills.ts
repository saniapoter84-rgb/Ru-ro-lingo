import { DrillPack } from '../data/drills/types';
import { GrammarLesson, GrammarStep, RuleStep } from '../data/course/types';
import { formsTable } from './forms';

/**
 * Проигрывание блока практики.
 *
 * Раньше здесь жил генератор: из одной строки-случая он собирал и выбор
 * формы, и преобразование, и ввод руками. Задания получались корректные, но
 * безголосые — генератор знает форму и не знает, что именно в ней ловит
 * человека. Объяснение ошибки он мог взять только одно на всю тему, а
 * подписи к вариантам — только из общей таблицы форм.
 *
 * Теперь все 37 тем написаны руками, и этот файл ничего не собирает: он
 * отдаёт задания как есть, добавляя к ним карточку правила.
 */

/** Сколько заданий в полном блоке практики после теории. */
export const DRILL_FULL = 20;
/** Сколько — в коротком напоминании, когда тема всплывает позже. */
export const DRILL_SHORT = 5;

/** Детерминированный сдвиг: одна и та же тема в один день — один набор. */
function makeRandom(seed: number): () => number {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 0xffffffff;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Примеры для карточки правила берутся из самих заданий темы.
 *
 * Отдельного списка примеров нет намеренно: пусть человек увидит перед
 * практикой ровно те фразы, которые сейчас будет разбирать.
 */
function ruleExamples(pack: DrillPack): { ro: string; ru: string }[] {
  const out: { ro: string; ru: string }[] = [];
  for (const step of pack.tasks) {
    if (out.length >= 3) break;
    if (step.kind !== 'choice' || !step.ru || !step.prompt.includes('___')) continue;
    out.push({ ro: step.prompt.replace('___', step.options[step.correct]), ru: step.ru });
  }
  return out;
}

/**
 * Карточка правила перед практикой.
 *
 * Двадцать заданий, прилетающих без единого слова объяснения, — это не
 * тренажёр, а угадайка. Поэтому блок всегда открывается напоминанием
 * правила, таблицей форм и парой разобранных примеров.
 */
function ruleCard(pack: DrillPack): RuleStep {
  const examples = ruleExamples(pack);
  return {
    kind: 'rule',
    title: pack.title,
    body: pack.rule,
    table: pack.table ?? formsTable(pack.forms),
    vocabulary: pack.vocabulary,
    examples: examples.length > 0 ? examples : undefined,
  };
}

/** Карточка правила плюс задания темы. */
export function buildDrillSteps(pack: DrillPack, count: number, salt = ''): GrammarStep[] {
  return [ruleCard(pack), ...buildDrillTasks(pack, count, salt)];
}

/**
 * Только задания, без карточки правила.
 *
 * Полный блок идёт ровно так, как его написали. Короткое напоминание берёт
 * срез со сдвигом — чтобы, возвращаясь к теме через неделю, не утыкаться в
 * одни и те же пять заданий.
 */
function buildDrillTasks(pack: DrillPack, count: number, salt = ''): GrammarStep[] {
  const tasks = pack.tasks;
  if (count >= tasks.length) return tasks.slice(0, count);
  const random = makeRandom(hash(pack.id + salt));
  const offset = Math.floor(random() * tasks.length);
  return Array.from({ length: count }, (_, i) => tasks[(offset + i) % tasks.length]);
}

/**
 * Синтетический «урок» из практики — чтобы напоминание проигрывалось тем же
 * экраном, что и обычный урок, со всеми его комбо, разбором и очередью
 * неверных ответов.
 */
export function drillLesson(
  packs: DrillPack[],
  count: number,
  options: { title: string; subtitle: string; emoji: string; salt?: string }
): GrammarLesson {
  const perPack = Math.max(1, Math.round(count / Math.max(1, packs.length)));
  const steps: GrammarStep[] = [];
  for (const pack of packs) {
    steps.push(...buildDrillSteps(pack, perPack, options.salt ?? ''));
  }
  return {
    id: `drill_${packs.map((p) => p.id).join('_')}`,
    title: options.title,
    subtitle: options.subtitle,
    emoji: options.emoji,
    steps,
  };
}
