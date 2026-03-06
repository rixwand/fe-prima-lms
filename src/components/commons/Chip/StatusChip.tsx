import { Chip } from "@heroui/react";

export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

interface StatusChipProps {
  status: PaymentStatus;
}
export function StatusChip({ status }: StatusChipProps) {
  const config: Record<PaymentStatus, { color: "default" | "success" | "warning" | "danger"; label: string }> = {
    PENDING: {
      color: "warning",
      label: "Pending",
    },
    PAID: {
      color: "success",
      label: "Paid",
    },
    EXPIRED: {
      color: "default",
      label: "Expired",
    },
    FAILED: {
      color: "danger",
      label: "Failed",
    },
  };

  const { color, label } = config[status];

  return (
    <Chip color={color} variant="flat" size="sm" className="uppercase">
      {label}
    </Chip>
  );
}
