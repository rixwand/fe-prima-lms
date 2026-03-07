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

export function applyDiscounts(price: number, discounts: Discount[]) {
  let current = price;

  for (const d of discounts) {
    if (!d.isActive) continue;
    if (d.type === "PERCENTAGE") {
      const pct = Math.min(d.value, 100);
      current -= current * (pct / 100);
    } else {
      current -= d.value;
    }

    current = Math.max(0, current);
  }

  return current;
}

export const convertLocal = (num: number) =>
  num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
