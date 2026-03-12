import AdminLayout from "@/components/layouts/AdminLayout";
import Invoices from "@/components/views/Admin/Invoices";

export default function InvoicesPage() {
  return (
    <AdminLayout active="Invoices" navTitle="Invoices">
      <Invoices />
    </AdminLayout>
  );
}
