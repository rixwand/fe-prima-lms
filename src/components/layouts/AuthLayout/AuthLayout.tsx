import PageHead from "@/components/commons/PageHead";
import { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

const AuthLayout = ({ title, children }: Props) => {
  return (
    <>
      <PageHead {...{ title }} />
      <section className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_80%_-10%,#dbeafe_10%,#bfdbfe_50%,#eff6ff_100%)] flex items-center justify-center">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
