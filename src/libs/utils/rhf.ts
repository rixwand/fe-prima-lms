/* eslint-disable @typescript-eslint/no-explicit-any */
export function getDirtyData<T extends Record<string, any>>(
  dirtyFields: Record<string, boolean | Record<string, any>>,
  allValues: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in dirtyFields) {
    const isDirty = dirtyFields[key];
    const value = allValues[key];

    if (isDirty && typeof isDirty === "object" && !Array.isArray(isDirty)) {
      const nested = getDirtyData(isDirty, value ?? {});
      if (Object.keys(nested).length > 0) {
        (result as any)[key] = nested;
      }
    } else if (isDirty) {
      (result as any)[key] = value;
    }
  }

  return result;
}
