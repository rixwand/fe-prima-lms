import PageHead from "@/components/commons/PageHead";
import { inter } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { ReactNode } from "react";

export default function LearnLayout({ children, title }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHead {...{ title }} />
      <section
        className={cn(
          inter.className,
          "relative min-h-screen w-full ",
          // "bg-[radial-gradient(1200px_600px_at_80%_-10%,#dbeafe_10%,#bfdbfe_50%,#eff6ff_100%)]",
          "bg-[#eff6ff]",
        )}>
        {children}
      </section>
    </>
  );
}
