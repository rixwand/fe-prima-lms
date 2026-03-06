import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";
import Transaction from "@/components/views/Dashboard/Transaction";

export default function CourseSectionPage() {
  return (
    <DashboardLayout title="Prima | Transaksi">
      <Transaction />
    </DashboardLayout>
  );
}
