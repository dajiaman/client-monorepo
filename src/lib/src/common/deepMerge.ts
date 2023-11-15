export function deepMerge<T extends {}>(source1: T, source2: Partial<T>): T {
  const result = {} as T;
  for (const key in source1) {
    result[key] = source1[key];
  }
  for (const key in source2) {
    const source2Value = source2[key];
    if (
      typeof result[key] === "object" &&
      source2Value &&
      typeof source2Value === "object"
    ) {
      result[key] = deepMerge<any>(result[key], source2Value);
    } else {
      result[key] = source2Value as any;
    }
  }
  return result;
}
