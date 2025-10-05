export default function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex gap-y-1 flex-col">
      <span className="text-sm font-medium">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
