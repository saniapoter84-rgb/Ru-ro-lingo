import { DrillPack } from '../data/drills/types';
import { ChoiceStep, GrammarLesson, GrammarStep, RuleStep } from '../data/course/types';
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
 * Теперь все темы написаны руками, и этот файл ничего не собирает: он
 * отдаёт готовые задания, добавляя к ним карточку правила. Единственное,
 * что здесь решается, — порядок: какие задания попадут в короткое
 * напоминание и в какой последовательности пойдёт полный блок.
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
 * практикой ровно те фразы, которые сейчас будет разбирать. Но не те, что
 * идут сразу за карточкой: раньше примерами были первые три задания, и
 * ответы на них читались с карточки за секунду до вопроса. Поэтому сначала
 * берутся фразы, которых в этом заходе нет вовсе, а если заход — полный
 * блок и не сыграно ничего не останется, то те, что стоят дальше всего
 * от карточки.
 */
function ruleExamples(pack: DrillPack, played: GrammarStep[]): { ro: string; ru: string }[] {
  const isExample = (step: GrammarStep): step is ChoiceStep =>
    step.kind === 'choice' && !!step.ru && step.prompt.includes('___');
  const playedSet = new Set(played);
  const fresh = pack.tasks.filter(isExample).filter((step) => !playedSet.has(step));
  const late = [...played].reverse().filter(isExample);
  return [...fresh, ...late].slice(0, 3).map((step: ChoiceStep) => ({
    ro: step.prompt.replace('___', step.options[step.correct]),
    ru: step.ru ?? '',
  }));
}

/**
 * Карточка правила перед практикой.
 *
 * Двадцать заданий, прилетающих без единого слова объяснения, — это не
 * тренажёр, а угадайка. Поэтому блок всегда открывается напоминанием
 * правила, таблицей форм и парой разобранных примеров.
 */
function ruleCard(pack: DrillPack, played: GrammarStep[]): RuleStep {
  const examples = ruleExamples(pack, played);
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
  const tasks = buildDrillTasks(pack, count, salt);
  return [ruleCard(pack, tasks), ...tasks];
}

/**
 * Только задания, без карточки правила.
 *
 * Задания темы записаны группами по типу: сначала выбор формы, потом
 * сборка и ввод, в конце сопоставление, поиск ошибки и аудирование. Это
 * путь от узнавания к воспроизведению, и ломать его нельзя. А вот порядок
 * внутри группы ничего не значит, и его перемешиваем: иначе полный блок
 * при повторном заходе проигрывается слово в слово и запоминается как
 * последовательность, а не как правило.
 *
 * Короткое напоминание берёт задания с равным шагом по всему блоку, со
 * сдвигом от даты. Раньше это был подряд идущий срез, и в него попадали
 * пять заданий одного типа: либо один сплошной выбор, либо один сплошной
 * ввод. Теперь в пяти заданиях есть и то и другое.
 */
export function buildDrillTasks(pack: DrillPack, count: number, salt = ''): GrammarStep[] {
  const tasks = pack.tasks;
  const random = makeRandom(hash(pack.id + salt));
  if (count >= tasks.length) return shuffleWithinKinds(tasks, random);
  const offset = Math.floor(random() * tasks.length);
  const stride = tasks.length / count;
  return Array.from(
    { length: count },
    (_, i) => tasks[Math.floor(offset + i * stride) % tasks.length]
  );
}

/** Перемешивает задания, не смешивая соседние группы одного типа. */
function shuffleWithinKinds(tasks: GrammarStep[], random: () => number): GrammarStep[] {
  const out: GrammarStep[] = [];
  let group: GrammarStep[] = [];
  const flush = () => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
    out.push(...group);
    group = [];
  };
  for (const task of tasks) {
    if (group.length > 0 && group[0].kind !== task.kind) flush();
    group.push(task);
  }
  flush();
  return out;
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
