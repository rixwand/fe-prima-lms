import { ReactNode } from "react";

export default function ForumLayout({ children }: { children: ReactNode }) {
  return <div className="flex">{children}</div>;
}
