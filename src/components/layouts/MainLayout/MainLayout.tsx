import Footer from "@/components/commons/Footer";
import PageHead from "@/components/commons/PageHead";
import { ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

const MainLayout = ({ title, children }: Props) => {
  return (
    <>
      <PageHead {...{ title }} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
