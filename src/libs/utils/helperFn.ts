export function randomInRangeStep(min: number, max: number, step: number): number {
  const count = Math.floor((max - min) / step) + 1;
  return min + step * Math.floor(Math.random() * count);
}

console.log(randomInRangeStep(50, 80, 10));
