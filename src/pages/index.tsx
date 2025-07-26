import Navbar from "@/components/commons/Navbar";
import MainLayout from "@/components/layouts/MainLayout";
import Home from "@/components/views/Home";

export default function Index() {
  return (
    <MainLayout title="Prima">
      <Navbar />
      <Home />
    </MainLayout>
  );
}
