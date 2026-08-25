export function randomInRangeStep(min: number, max: number, step: number): number {
  const count = Math.floor((max - min) / step) + 1;
  return min + step * Math.floor(Math.random() * count);
}

export const numberOnChange = (onChange: (...event: any[]) => void) => (value: string) =>
  onChange(value === "" ? undefined : Number(value));
