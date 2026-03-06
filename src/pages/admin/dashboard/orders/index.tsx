import AdminLayout from "@/components/layouts/AdminLayout";
import Orders from "@/components/views/Admin/Orders";

export default function OrdersPage() {
  return (
    <AdminLayout active="Orders">
      <Orders />
    </AdminLayout>
  );
}
