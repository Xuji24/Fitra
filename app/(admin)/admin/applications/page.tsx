import AdminApplicationsPage from "@/components/pages/main/admin/AdminApplications";
import { getAdminApplications } from "../actions";

export default async function ApplicationsPage() {
  const applications = await getAdminApplications();
  return <AdminApplicationsPage applications={applications} />;
}
