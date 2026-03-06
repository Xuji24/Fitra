import AdminSponsorsPage from "@/components/pages/main/admin/AdminSponsors";
import { getAdminSponsors } from "../actions";

export default async function SponsorsPage() {
  const sponsors = await getAdminSponsors();
  return <AdminSponsorsPage sponsors={sponsors} />;
}
