export const hasTrue = (obj: Record<string, boolean>) => Object.values(obj).some(v => v == true);
