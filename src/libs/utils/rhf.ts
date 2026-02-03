/* eslint-disable @typescript-eslint/no-explicit-any */
// export function getDirtyData<T extends Record<string, any>>(
//   dirtyFields: Record<string, boolean | Record<string, any>>,
//   allValues: T
// ): Partial<T> {
//   const result: Partial<T> = {};

//   for (const key in dirtyFields) {
//     const isDirty = dirtyFields[key];
//     const value = allValues[key];

//     if (isDirty && typeof isDirty === "object" && !Array.isArray(isDirty)) {
//       const nested = getDirtyData(isDirty, value ?? {});
//       if (Object.keys(nested).length > 0) {
//         (result as any)[key] = nested;
//       }
//     } else if (isDirty) {
//       (result as any)[key] = value;
//     }
//   }

//   return result;
// }

export function getDirtyData<T extends Record<string, any>>(dirtyFields: any, allValues: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in dirtyFields) {
    const dirty = dirtyFields[key];
    const value = allValues[key];

    if (Array.isArray(dirty) && Array.isArray(value)) {
      const filtered = value.filter((_, index) => hasDirty(dirty[index]));

      if (filtered.length > 0) {
        (result as any)[key] = filtered as any;
      }
      continue;
    }

    if (hasDirty(dirty)) {
      (result as any)[key] = value;
    }
  }

  return result;
}

export function hasDirty(dirty: any): boolean {
  if (dirty === true) return true;

  if (Array.isArray(dirty)) {
    return dirty.some(hasDirty);
  }

  if (dirty && typeof dirty === "object") {
    return Object.values(dirty).some(hasDirty);
  }

  return false;
}
