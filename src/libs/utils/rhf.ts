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

type DirtyField<T> = T extends any[]
  ? DirtyField<T[number]>[]
  : T extends object
    ? { [K in keyof T]?: boolean | DirtyField<T[K]> }
    : boolean;

function hasDirtyField(dirty: any): boolean {
  if (dirty === true) return true;

  if (Array.isArray(dirty)) {
    return dirty.some(hasDirtyField);
  }

  if (typeof dirty === "object" && dirty !== null) {
    return Object.values(dirty).some(hasDirtyField);
  }

  return false;
}

export function extractDirtyFields<T extends { id?: string | number }>(
  data: T[],
  dirtyFields: DirtyField<T>[],
): Partial<T>[] {
  return data.reduce<Partial<T>[]>((acc, item, index) => {
    const dirty = dirtyFields?.[index];

    if (!dirty || !hasDirtyField(dirty)) {
      return acc;
    }

    const result: Partial<T> = {};

    // always include id
    if (item.id !== undefined) {
      result.id = item.id;
    }

    for (const key in dirty) {
      const typedKey = key as keyof T;

      const dirtyValue = (dirty as any)[typedKey];

      if (!hasDirtyField(dirtyValue)) continue;

      const value = item[typedKey];

      if (Array.isArray(value)) {
        result[typedKey] = value as T[keyof T];
        continue;
      }

      result[typedKey] = value;
    }

    acc.push(result);

    return acc;
  }, []);
}
