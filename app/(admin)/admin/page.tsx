import AdminDashboard from "@/components/pages/main/admin/AdminDashboard";
import { getAdminStats } from "./actions";

export default async function AdminPage() {
  const stats = await getAdminStats();
  return <AdminDashboard stats={stats} />;
}
