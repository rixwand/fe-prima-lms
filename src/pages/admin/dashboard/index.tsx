import AdminLayout from "@/components/layouts/AdminLayout";
import Overview from "@/components/views/Admin/Overview";

export default function AdminDashboard() {
  return (
    <AdminLayout active="Overview">
      <Overview />
    </AdminLayout>
  );
}
