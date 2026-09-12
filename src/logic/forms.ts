/**
 * Расшифровка формы: что означает конкретный вариант ответа.
 *
 * Принципиально только точное совпадение. Соблазн угадывать по окончанию
 * велик — одна строка объяснила бы сразу все глаголы группы, — но ловушки
 * в заданиях специально сделаны похожими на правду: «plecez» выглядит как
 * форма со вставкой «-ez-», хотя у «a pleca» такой формы нет вовсе. По
 * хвосту слова разбор уверенно назвал бы её правильной, и человек выучил
 * бы ошибку. Поэтому расшифровываются только те формы, которые выписаны
 * руками, а для остальных разбор молчит и показывает общее правило.
 */
export function describeForm(
  form: string,
  forms: Record<string, string> | undefined
): string | undefined {
  if (!forms) return undefined;

  const cleaned = form.trim().toLowerCase();
  if (!cleaned) return undefined;

  for (const [key, meaning] of Object.entries(forms)) {
    if (key.trim().toLowerCase() === cleaned) return meaning;
  }
  return undefined;
}

/** Таблица для карточки правила — в том же порядке, в каком её записали. */
export function formsTable(
  forms: Record<string, string> | undefined
): { form: string; meaning: string }[] | undefined {
  if (!forms) return undefined;
  const rows = Object.entries(forms).map(([form, meaning]) => ({ form, meaning }));
  return rows.length > 0 ? rows : undefined;
}
