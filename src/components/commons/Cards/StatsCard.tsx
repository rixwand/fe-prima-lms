export default function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
      <div className="flex items-center gap-3">
        <span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-blue-50 text-blue-700">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
