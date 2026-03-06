"use client";

import { useState } from "react";
import { Mail, Trash2, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { AdminContact } from "@/app/(admin)/admin/actions";
import { updateContactStatus, deleteContact } from "@/app/(admin)/admin/actions";
import CustomSelect from "@/components/ui/custom-select";

interface Props {
  contacts: AdminContact[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  read: "bg-[#FFB800]/10 text-[#FFB800]",
  replied: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export default function AdminContactsPage({ contacts: initialContacts }: Props) {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    const result = await updateContactStatus(contactId, newStatus);
    if (result.success) {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
      );
      toast.success("Status updated.");
    } else {
      toast.error(result.error ?? "Failed to update.");
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Delete this contact submission?")) return;
    const result = await deleteContact(contactId);
    if (result.success) {
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
      toast.success("Contact deleted.");
    } else {
      toast.error(result.error ?? "Failed to delete.");
    }
  };

  const subjectLabels: Record<string, string> = {
    general: "General",
    "race-info": "Race Info",
    partnership: "Partnership",
    technical: "Technical",
    other: "Other",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white font-raleway">
          Contact Submissions ({contacts.length})
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E] text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#1A1A1A]/30 dark:placeholder:text-white/20 border-0 focus:ring-2 focus:ring-[#FF5733] outline-none transition-all font-merriweather-sans w-40"
          />
          <CustomSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: "all", label: "All Status" },
              { value: "new", label: "New" },
              { value: "read", label: "Read" },
              { value: "replied", label: "Replied" },
            ]}
            className="w-36"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden transition-all"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#1A1A1A] dark:text-white truncate">
                    {contact.name}
                  </p>
                  <p className="text-[11px] text-[#1A1A1A]/40 dark:text-white/30 truncate">
                    {contact.email} &middot; {subjectLabels[contact.subject] ?? contact.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[contact.status] ?? ""}`}>
                  {contact.status}
                </span>
                <CustomSelect
                  value={contact.status}
                  onChange={(val) => handleStatusChange(contact.id, val)}
                  options={[
                    { value: "new", label: "New" },
                    { value: "read", label: "Read" },
                    { value: "replied", label: "Replied" },
                  ]}
                  size="sm"
                  className="w-24"
                />
                <button
                  onClick={() =>
                    setExpanded((prev) => (prev === contact.id ? null : contact.id))
                  }
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1A1A1A]/40 dark:text-white/30 cursor-pointer"
                  title="View message"
                >
                  {expanded === contact.id ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#1A1A1A]/30 dark:text-white/30 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expanded === contact.id && (
              <div className="px-5 pb-4 border-t border-black/5 dark:border-white/5 pt-3">
                <p className="text-sm text-[#1A1A1A]/70 dark:text-white/60 whitespace-pre-wrap">
                  {contact.message}
                </p>
                <p className="text-[10px] text-[#1A1A1A]/30 dark:text-white/20 mt-3">
                  Submitted{" "}
                  {new Date(contact.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/5 dark:border-white/5 p-10 text-center text-[#1A1A1A]/40 dark:text-white/30">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No contact submissions found.
          </div>
        )}
      </div>
    </div>
  );
}
