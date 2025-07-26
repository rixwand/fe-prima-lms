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
      <section>{children}</section>
    </>
  );
};

export default AuthLayout;
