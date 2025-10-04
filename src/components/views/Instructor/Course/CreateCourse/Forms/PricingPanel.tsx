/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from "@/components/commons/TextField";
import { DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import { HiSelector } from "react-icons/hi";
import { CourseForm } from "../CreateCourse";

function finalPrice(price: number, discount: number = 0, type: "PERCENTAGE" | "FIXED" = "PERCENTAGE") {
  let p = price;

  if (type === "PERCENTAGE") {
    const pct = Math.min(Math.max(discount, 0), 100);
    p = price * (1 - pct / 100);
  } else {
    p = Math.max(0, price - discount);
  }

  return p;
}

export default function PricingPanel() {
  const { control, register, setValue, watch } = useFormContext<CourseForm>();

  const dt = (d?: string | Date) => (d ? new Date(d).toISOString().slice(0, 16) : "");
  const nowLocal = new Date().toISOString().slice(0, 16);

  const [type, discount, price] = watch(["discount.type", "discount.value", "priceAmount"]);

  return (
    <div className="space-y-6">
      <Controller
        control={control}
        name="priceAmount"
        render={({ field }) => <TextField id="priceAmount" placeholder="Rp. 0" label="Base Price (Rp)" field={field} />}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Controller
          control={control}
          name="discount.type"
          render={({ field }) => (
            <Select
              {...field}
              selectedKeys={[field.value]}
              id="discount.type"
              disableSelectorIconRotation
              variant="bordered"
              className="max-w-xs"
              label="Discount Type"
              labelPlacement="outside"
              placeholder="Select discount type"
              selectorIcon={<HiSelector />}>
              <SelectItem key={"PERCENTAGE"}>Percentage</SelectItem>
              <SelectItem key={"FIXED"}>Fixed</SelectItem>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="discount.value"
          render={({ field }) => (
            <TextField
              prefix="Rp"
              id="discount.value"
              type="number"
              placeholder=""
              label={`Amount (${watch("discount.type") == "FIXED" ? "Rp" : "%"})`}
              field={field}
            />
          )}
        />

        <label className="flex gap-y-2 flex-col">
          <span className="font-medium text-sm">Active</span>
          <Switch {...register("discount.isActive")} size="sm" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Controller
          control={control}
          name="discount.label"
          render={({ field }) => (
            <TextField id="discount.label" placeholder="e.g Early Sale" label="Label (optional)" field={field} />
          )}
        />
        <Controller
          control={control}
          name="discount.startAt"
          render={({ field }) => (
            <DatePicker
              key={"startAt"}
              classNames={{
                inputWrapper: ":outline-primary",
              }}
              className="max-w-md"
              granularity="second"
              labelPlacement="outside"
              label="Start At (optional)"
              variant="bordered"
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="discount.endAt"
          render={({ field }) => (
            <DatePicker
              key={"endAt"}
              className="max-w-md"
              granularity="second"
              variant="bordered"
              labelPlacement="outside"
              label="End At (optional)"
              {...field}
            />
          )}
        />
      </div>
      <div className="rounded-xl border border-success-200 p-4 bg-success-50">
        <p className="text-sm text-success-700">
          Final price:{" "}
          <span className="font-semibold">
            {finalPrice(price, discount, type).toLocaleString(undefined, {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </span>
        </p>
      </div>
    </div>
  );
}
