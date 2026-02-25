import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import TextField from "@/components/commons/TextField";
import useCourse from "@/hooks/course/useCourse";
import { useEditCourseContext } from "@/libs/context/EditCourseContext";
import cn from "@/libs/utils/cn";
import { convertLocal, finalPrice } from "@/libs/utils/currency";
import { hasDirty } from "@/libs/utils/rhf";
import { Button, DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { Fragment, useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HiSelector } from "react-icons/hi";
import { LuTrash2, LuUndo2 } from "react-icons/lu";
import Field from "../../CreateCourse/Forms/Field";
import { EditCourseForm } from "./form.type";

export default function PricingPanel({
  discountId,
  courseId,
  publishedValues,
}: {
  discountId?: number;
  courseId: number;
  publishedValues?: { priceAmount: number; discounts: Discount[] };
}) {
  const { showPublished } = useEditCourseContext();
  const {
    control,
    register,
    watch,
    setValue,
    resetField,
    formState: { dirtyFields },
  } = useFormContext<EditCourseForm>();

  const [price, free, discount] = watch(["priceAmount", "isFree", "discount"]);
  const startAt = useRef<HTMLInputElement | null>(null);
  const reset = () => {
    resetField("discount");
    resetField("isFree");
    resetField("priceAmount");
  };

  const { deleteDiscount, isSuccessDeleteDiscount } = useCourse(courseId);

  const removeDiscount = () => {
    confirmDialog({
      title: "Remove Discount?",
      desc: "This action will remove discount",
      onConfirmed: () => {
        if (discountId) deleteDiscount({ id: discountId, courseId });
        if (!discountId || isSuccessDeleteDiscount) setValue("discount", undefined);
      },
    });
  };

  const activeDiscounts = publishedValues?.discounts.filter(d => d.isActive && d.value > 0);

  const { finalPublishedPrice, breakdown } = useMemo(() => {
    let current = price;
    const breakdown = activeDiscounts?.map(d => {
      const amount = d.type === "FIXED" ? d.value : current * (d.value / 100);
      const before = current;
      current = Math.max(0, current - amount);
      return { discount: d, amount, before, after: current };
    });

    return { finalPublishedPrice: current, breakdown };
  }, [price, activeDiscounts]);

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      {/* <label className="flex gap-x-3 items-center flex-row">
        <span className="font-medium text-sm">Free Course</span>
        <Switch {...register("isFree")} size="sm" />
      </label> */}
      {showPublished && !free ? (
        <Fragment>
          {/* Base Price */}
          <TextField
            id="priceAmount"
            value={publishedValues?.priceAmount?.toString() || "0"}
            label="Base Price (Rp)"
            type="number"
            disabled
          />

          {/* Discount Section */}
          {publishedValues?.discounts.map((d, i) => (
            <div className="border bg-slate-50/50 space-y-6 p-5 border-slate-300 rounded-xl relative" key={d.id}>
              <span className="absolute -top-3 left-3 bg-white px-1 text-sm text-slate-700">
                Discount {d.label || i + 1}
              </span>

              <div className="grid grid-cols-1 items-start md:grid-cols-3 gap-5">
                {/* Discount Type */}
                <Field label="Type">
                  <Select
                    isDisabled
                    selectedKeys={[d.type]}
                    aria-label="Select course type"
                    id="discount.type"
                    disableSelectorIconRotation
                    variant="bordered"
                    className="max-w-xs h-10"
                    classNames={{
                      trigger: ["shadow-none border-slate-200 border"],
                    }}
                    placeholder="Select discount type"
                    selectorIcon={<HiSelector />}>
                    <SelectItem key="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem key="FIXED">Fixed</SelectItem>
                  </Select>
                </Field>

                {/* Discount Amount */}
                <TextField
                  disabled
                  id="discount.value"
                  type="number"
                  label="Amount"
                  prefix="Rp"
                  value={d.value.toString()}
                />

                {/* Active Switch */}
                <label className="flex gap-y-2 flex-col">
                  <span className="font-medium text-sm">Active</span>
                  <Switch isSelected={d.isActive} isDisabled size="sm" />
                </label>
              </div>

              {/* Label & Date */}
              <div className="grid grid-cols-1 @7xl:grid-cols-3 gap-5">
                <TextField id="discount.label" value={d.label} disabled label="Label (optional)" />

                <DatePicker
                  className="max-w-full"
                  granularity="second"
                  isDisabled
                  defaultValue={d.startAt ? (parseAbsoluteToLocal(d.startAt) as unknown as CalendarDate) : undefined}
                  labelPlacement="outside"
                  label="Start At (optional)"
                  variant="bordered"
                  classNames={{
                    inputWrapper:
                      "focus-within:border-slate-300 hover:border-slate-300 focus-within:hover:border-slate-300 border-1 shadow-none focus-within:outline-blue-100 focus-within:hover:outline-blue-100 outline-2 outline-transparent",
                  }}
                />

                <DatePicker
                  className="max-w-full"
                  granularity="second"
                  labelPlacement="outside"
                  isDisabled
                  defaultValue={d.endAt ? (parseAbsoluteToLocal(d.endAt) as unknown as CalendarDate) : undefined}
                  label="End At (optional)"
                  variant="bordered"
                  classNames={{
                    inputWrapper:
                      "focus-within:border-slate-300 hover:border-slate-300 focus-within:hover:border-slate-300 border-1 shadow-none focus-within:outline-blue-100 focus-within:hover:outline-blue-100 outline-2 outline-transparent",
                  }}
                />
              </div>
            </div>
          ))}

          {/* Price Summary */}
          <div className="rounded-xl border border-success-200 space-y-2 p-4 bg-success-50">
            {!breakdown ||
              (breakdown.length > 0 && (
                <p className="text-sm text-slate-700 flex justify-between">
                  Base price
                  <span className="font-semibold line-through">{convertLocal(publishedValues?.priceAmount || 0)}</span>
                </p>
              ))}

            {breakdown?.map(({ discount, amount }, _i) => (
              <p key={discount.id} className="text-sm text-slate-700 flex justify-between">
                Discount {discount.label}
                {discount.type === "PERCENTAGE" && ` ${discount.value}%`}
                <span className="font-semibold">-{convertLocal(amount)}</span>
              </p>
            ))}

            <p className="text-sm text-success-700 flex justify-between">
              Final price
              <span className="font-semibold">{convertLocal(finalPublishedPrice)}</span>
            </p>
          </div>
        </Fragment>
      ) : null}

      {showPublished || free ? null : (
        <Fragment>
          <Controller
            control={control}
            name="priceAmount"
            rules={{
              required: "Please input course price",
              min: { value: 1, message: "Price must be greater than 0" },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id="priceAmount"
                error={error?.message}
                placeholder="Rp. 0"
                label="Base Price (Rp)"
                field={field}
                onChange={e => field.onChange(e.target.valueAsNumber)}
                type="number"
              />
            )}
          />
          {discount ? (
            <div className="border space-y-6 p-5 border-slate-300 rounded-xl relative">
              <span className="absolute -top-3 left-3 bg-white px-1 text-sm text-slate-700">Discount</span>
              <button
                onClick={removeDiscount}
                className="absolute cursor-pointer -top-3.5 right-3 px-2 py-1 text-sm text-danger bg-white flex gap-x-1 items-center">
                <LuTrash2 size={16} /> Remove
              </button>
              <div className="grid grid-cols-1 items-start md:grid-cols-3 gap-5">
                <Controller
                  control={control}
                  name="discount.type"
                  render={({ field }) => (
                    <Field label="Type">
                      <Select
                        aria-label="Select course type"
                        {...field}
                        selectedKeys={[field.value]}
                        id="discount.type"
                        disableSelectorIconRotation
                        variant="bordered"
                        className="max-w-xs h-10"
                        classNames={{
                          trigger: ["shadow-none border-slate-200 border"],
                        }}
                        placeholder="Select discount type"
                        selectorIcon={<HiSelector />}>
                        <SelectItem key={"PERCENTAGE"}>Percentage</SelectItem>
                        <SelectItem key={"FIXED"}>Fixed</SelectItem>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="discount.value"
                  rules={{
                    max: discount.type == "PERCENTAGE" ? { value: 100, message: "Cant over 100%" } : undefined,
                    min: { value: 1, message: "Discount must be greater than 0" },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      prefix="Rp"
                      id="discount.value"
                      type="number"
                      error={error?.message}
                      placeholder=""
                      label={`Amount (${watch("discount.type") == "FIXED" ? "Rp" : "%"})`}
                      field={field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />

                <label className="flex gap-y-2 flex-col">
                  <span className="font-medium text-sm">Active</span>
                  <Switch {...register("discount.isActive")} size="sm" />
                </label>
              </div>
              <div className="grid grid-cols-1 @7xl:grid-cols-3 gap-5">
                <Controller
                  control={control}
                  name="discount.label"
                  render={({ field }) => (
                    <TextField
                      id="discount.label"
                      placeholder="e.g Early Sale"
                      label="Label (optional)"
                      field={field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="discount.startAt"
                  render={({ field }) => (
                    <DatePicker
                      inputRef={startAt}
                      key={"startAt"}
                      classNames={{
                        inputWrapper:
                          "focus-within:border-slate-300 hover:border-slate-300 focus-within:hover:border-slate-300 border-1 shadow-none focus-within:outline-blue-100 focus-within:hover:outline-blue-100 outline-2 outline-transparent",
                      }}
                      className="max-w-full"
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
                      classNames={{
                        inputWrapper:
                          "focus-within:border-slate-300 hover:border-slate-300 focus-within:hover:border-slate-300 border-1 shadow-none focus-within:outline-blue-100 focus-within:hover:outline-blue-100 outline-2 outline-transparent",
                      }}
                      className="max-w-full"
                      granularity="second"
                      variant="bordered"
                      labelPlacement="outside"
                      label="End At (optional)"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <Button
              onPress={() => setValue("discount", { type: "PERCENTAGE", value: 0, isActive: true })}
              color="primary"
              size="md"
              className="font-semibold bg-blue-600">
              Add Discount
            </Button>
          )}

          {price > 0 ? (
            <div className="rounded-xl border border-success-200 space-y-2 p-4 bg-success-50">
              {discount && discount.value > 0 && discount?.isActive && (
                <Fragment>
                  <p className="text-sm text-slate-700 flex justify-between">
                    Base price
                    <span className={cn(["font-semibold line-through"])}>
                      {price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-slate-700 flex justify-between">
                    Discount {discount.type == "PERCENTAGE" && discount.value + "%"}
                    <span className="font-semibold">
                      -
                      {(discount.type == "FIXED" ? discount.value : price * (discount.value / 100)).toLocaleString(
                        "id-ID",
                        {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        },
                      )}
                    </span>
                  </p>
                </Fragment>
              )}
              <p className="text-sm text-success-700 flex justify-between">
                Final price
                <span className="font-semibold">
                  {(discount?.isActive && discount.value
                    ? finalPrice(price, discount.value, discount.type)
                    : price
                  ).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
            </div>
          ) : null}
        </Fragment>
      )}
      {(["discount", "priceAmount", "isFree"] as const).some(key => hasDirty(dirtyFields?.[key])) && (
        <Button color="danger" onPress={reset} className="h-9" variant="flat" radius="sm">
          <LuUndo2 /> Reset
        </Button>
      )}
    </div>
  );
}
