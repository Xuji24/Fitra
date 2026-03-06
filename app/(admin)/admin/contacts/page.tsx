import AdminContactsPage from "@/components/pages/main/admin/AdminContacts";
import { getAdminContacts } from "../actions";

export default async function ContactsPage() {
  const contacts = await getAdminContacts();
  return <AdminContactsPage contacts={contacts} />;
}
