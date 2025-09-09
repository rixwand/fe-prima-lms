import DashboardNav from "@/components/commons/DashboardNav";
import PageHead from "@/components/commons/PageHead";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children, title }: { title: string; children: ReactNode }) {
  const [foldSidebar, setFoldSidebar] = useState(false);

  return (
    <section>
      <PageHead title={title} />
      <DashboardNav {...{ foldSidebar, setFoldSidebar }} />
      <main
        className={cn([
          inter.className,
          !foldSidebar ? "2xl:ml-72 md:ml-56 " : "md:ml-20",
          " transition-all duration-400 px-6 pt-5",
        ])}>
        {children}
      </main>
    </section>
  );
}
