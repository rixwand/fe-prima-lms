import { convertLocal, toNumber } from "@/libs/utils/currency";

export default function CheckoutCardDiscountItem({
  discount,
  priceAmount,
}: {
  discount: Discount;
  priceAmount: number | Decimal;
}) {
  if (!discount.isActive) return null;

  const basePrice = toNumber(priceAmount);
  const discountValue = toNumber(discount.value);
  const discountAmount = discount.type === "FIXED" ? discountValue : basePrice * (discountValue / 100);

  return (
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600">
        Diskon {discount.type === "PERCENTAGE" && `${discount.value}%`}
      </span>

      <span className="text-base font-semibold text-emerald-600">
        -{convertLocal(discountAmount)}
      </span>
    </div>
  );
}
