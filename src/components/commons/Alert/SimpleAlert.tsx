import { ReactNode } from "react";
import { LuTriangleAlert } from "react-icons/lu";

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-danger-50 py-3 px-5 rounded-lg flex items-center gap-x-3 text-danger font-medium text-sm">
      <LuTriangleAlert size={20} />
      <span>{children}</span>
    </div>
  );
}
