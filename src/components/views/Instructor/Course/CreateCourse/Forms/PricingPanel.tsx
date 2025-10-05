/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from "@/components/commons/TextField";
import cn from "@/libs/utils/cn";
import { finalPrice } from "@/libs/utils/currency";
import { Button, DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HiSelector } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { CourseForm } from "../CreateCourse";
import Field from "./Field";

export default function PricingPanel() {
  const { control, register, watch, setValue } = useFormContext<CourseForm>();

  const dt = (d?: string | Date) => (d ? new Date(d).toISOString().slice(0, 16) : "");
  const nowLocal = new Date().toISOString().slice(0, 16);

  const [price, free, discount] = watch(["priceAmount", "isFree", "discount"]);

  return (
    <div className="space-y-6">
      {/* <label className="flex gap-x-3 items-center flex-row">
        <span className="font-medium text-sm">Free Course</span>
        <Switch {...register("isFree")} size="sm" />
      </label> */}
      {free ? null : (
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
                onClick={() => setValue("discount", undefined)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                        }
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
    </div>
  );
}
