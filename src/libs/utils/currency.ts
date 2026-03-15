type DecimalLike = number | Decimal | string | null | undefined;

const isDecimalObject = (value: unknown): value is { toNumber: () => number } =>
  typeof value === "object" && value !== null && "toNumber" in value && typeof value.toNumber === "function";

export const toNumber = (value: DecimalLike): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (isDecimalObject(value)) {
    const parsed = value.toNumber();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

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

export function applyDiscounts(
  price: DecimalLike,
  discounts: Discount[],
) {
  let current = toNumber(price);

  for (const d of discounts) {
    if (!d.isActive) continue;
    const discountValue = toNumber(d.value);

    if (d.type === "PERCENTAGE") {
      const pct = Math.min(discountValue, 100);
      current -= current * (pct / 100);
    } else {
      current -= discountValue;
    }

    current = Math.max(0, current);
  }

  return current;
}

export const convertLocal = (num: DecimalLike) =>
  toNumber(num).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
