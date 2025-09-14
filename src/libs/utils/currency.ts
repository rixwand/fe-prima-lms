export const formatRupiah = (n: number): string => {
  const format = (num: number, suffix: string) => `Rp${num.toFixed(1).replace(/\.0$/, "").replace(".", ",")} ${suffix}`;

  if (n >= 1_000_000_000_000) {
    return format(n / 1_000_000_000_000, "T");
  } else if (n >= 1_000_000_000) {
    return format(n / 1_000_000_000, "M");
  } else if (n >= 1_000_000) {
    return format(n / 1_000_000, "jt");
  } else if (n >= 1_000) {
    return format(n / 1_000, "rb");
  } else {
    return `Rp ${n}`;
  }
};
