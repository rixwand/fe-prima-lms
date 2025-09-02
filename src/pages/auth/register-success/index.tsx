import AuthLayout from "@/components/layouts/AuthLayout";
import RegisterSuccess from "@/components/views/Auth/RegisterSuccess";

export default function RegisterSuccessPage() {
  return (
    <AuthLayout title="Registration Success">
      <RegisterSuccess />
    </AuthLayout>
  );
}
