import DashboardNav from "@/components/commons/DashboardNav";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Fragment, ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [foldSidebar, setFoldSidebar] = useState(false);

  return (
    <Fragment>
      <DashboardNav {...{ foldSidebar, setFoldSidebar }} />
      <main
        className={cn([
          inter.className,
          !foldSidebar ? "md:ml-72 " : "md:ml-20",
          " transition-all duration-400 px-6 pt-6",
        ])}>
        {children}
      </main>
    </Fragment>
  );
}
