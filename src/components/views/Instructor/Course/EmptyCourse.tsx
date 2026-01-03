import { LuBookOpen, LuPlus } from "react-icons/lu";

export default function EmptyCourses({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 grid place-items-center bg-white text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto">
          <LuBookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold">You have no courses (yet)</h3>
        <p className="text-slate-600 text-sm">
          Start by creating your first course. You can save it as a draft and publish later when it’s ready.
        </p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700">
          <LuPlus className="w-4 h-4" /> Create Course
        </button>
      </div>
    </div>
  );
}
