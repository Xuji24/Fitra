import AdminRacesPage from "@/components/pages/main/admin/AdminRaces";
import { getAdminRaces } from "../actions";

export default async function RacesPage() {
  const races = await getAdminRaces();
  return <AdminRacesPage races={races} />;
}
