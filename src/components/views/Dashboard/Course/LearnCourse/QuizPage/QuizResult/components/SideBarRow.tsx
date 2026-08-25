interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

export default function SidebarRow({ icon, label, value, last }: SummaryRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between",
        "px-6 py-4 min-w-sm",
        !last && "border-b border-default-200 text-sm",
      ]
        .filter(Boolean)
        .join(" ")}>
      <div className="flex items-center gap-4">
        <span className="text-xl text-default-400">{icon}</span>

        <span className="text-default-600">{label}</span>
      </div>

      <div className="text-right font-medium">{value}</div>
    </div>
  );
}
