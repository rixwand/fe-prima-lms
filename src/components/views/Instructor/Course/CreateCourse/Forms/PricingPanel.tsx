import { formatRupiah } from "@/libs/utils/currency";
import { LuEye, LuShare2 } from "react-icons/lu";
import { PiMoneyWavyLight } from "react-icons/pi";
import Field from "./Field";

export default function PricingPanel({ value, onChange }: { value: Pricing; onChange: (v: Pricing) => void }) {
  const set = (k: keyof Pricing, v: any) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Price">
          <div className="relative">
            <PiMoneyWavyLight size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min={0}
              value={value.price}
              onChange={e => set("price", Number(e.target.value))}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </Field>
        <Field label="Discount %">
          <input
            type="number"
            min={0}
            max={100}
            value={value.discount ?? 0}
            onChange={e => set("discount", Number(e.target.value))}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </Field>
        <Field label="Visibility">
          <select
            value={value.visibility}
            onChange={e => set("visibility", e.target.value as any)}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option>Public</option>
            <option>Unlisted</option>
            <option>Private</option>
          </select>
        </Field>
      </div>

      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
        <p className="text-sm text-slate-700">
          Final price: <span className="font-semibold">{finalPrice(value.price, value.discount)}</span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium mb-2">Share / Preview</p>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
            <LuShare2 className="w-4 h-4" /> Copy Preview Link
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
            <LuEye className="w-4 h-4" /> Student View
          </button>
        </div>
      </div>
    </div>
  );
}

function finalPrice(price: number, discount?: number) {
  const pct = Math.min(Math.max(discount || 0, 0), 100);
  const p = price * (1 - pct / 100);
  return formatRupiah(p);
}
