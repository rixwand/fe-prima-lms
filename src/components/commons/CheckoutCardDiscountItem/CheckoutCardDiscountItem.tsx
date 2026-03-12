export default function CheckoutCardDiscountItem({
  discount,
  priceAmount,
}: {
  discount: Discount;
  priceAmount: number;
}) {
  if (!discount.isActive) return null;

  const discountAmount = discount.type === "FIXED" ? Number(discount.value) : priceAmount * (discount.value / 100);

  return (
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600">
        Diskon {discount.type === "PERCENTAGE" && `${discount.value}%`}
      </span>

      <span className="text-base font-semibold text-emerald-600">
        -
        {discountAmount.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}
