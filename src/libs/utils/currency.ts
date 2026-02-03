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

export function finalPrice(price: number, discount: number = 0, type: "PERCENTAGE" | "FIXED" = "PERCENTAGE") {
  let p = price;

  if (type === "PERCENTAGE") {
    const pct = Math.min(Math.max(discount, 0), 100);
    p = price * (1 - pct / 100);
  } else {
    p = Math.max(0, price - discount);
  }

  return p;
}

export const convertLocal = (num: number) =>
  num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
