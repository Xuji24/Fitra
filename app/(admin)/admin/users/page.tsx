import AdminUsersPage from "@/components/pages/main/admin/AdminUsers";
import { getAdminUsers } from "../actions";

export default async function UsersPage() {
  const users = await getAdminUsers();
  return <AdminUsersPage users={users} />;
}
