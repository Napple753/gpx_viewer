export function getLocalMinimums<T>(
  list: T[],
  evaluator: (a: T) => number,
  globalMin?: number,
): T[] {
  const THRESHOLD = 1.5;
  const { min, idx } = getMinimum(list, evaluator);

  if (globalMin && evaluator(min) > globalMin * THRESHOLD) {
    return [];
  }
  let prevMins: T[] = [];
  let nextMins: T[] = [];

  for (let i = idx; i < list.length; i++) {
    if (evaluator(list[i]) > evaluator(min) * THRESHOLD) {
      nextMins = getLocalMinimums(
        list.slice(i),
        evaluator,
        globalMin || evaluator(min),
      );
      break;
    }
  }
  for (let i = idx; i >= 0; i--) {
    if (evaluator(list[i]) > evaluator(min) * THRESHOLD) {
      prevMins = getLocalMinimums(
        list.slice(0, i - 1),
        evaluator,
        globalMin || evaluator(min),
      );
      break;
    }
  }
  return [...prevMins, min, ...nextMins];
}

function getMinimum<T>(
  list: T[],
  evaluator: (a: T) => number,
): { min: T; idx: number } {
  let idx = 0;
  let min = list[idx];

  for (let i = 1; i < list.length; i++) {
    if (evaluator(list[i]) < evaluator(min)) {
      min = list[i];
      idx = i;
    }
  }

  return { min, idx };
}
