import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/pages/main/admin/AdminSidebar";
import AdminProfileDropdown from "@/components/pages/main/admin/AdminProfileDropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const displayName = profile.full_name || user.email?.split("@")[0] || "Admin";
  const email = user.email || "";

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121212]">
      {/* Admin Topbar */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A] dark:bg-[#0D0D0D] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF5733] flex items-center justify-center">
                <span className="text-white text-sm font-bold font-raleway">F</span>
              </div>
              <span className="font-raleway font-bold text-white text-sm hidden sm:block">
                Fitra Admin
              </span>
            </Link>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <span className="text-[11px] text-white/30 hidden sm:block uppercase tracking-wider font-medium">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white transition-colors font-medium"
            >
              View Site
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <AdminProfileDropdown displayName={displayName} email={email} />
          </div>
        </div>
      </header>

      {/* Admin Hero */}
      <section className="relative bg-[#1A1A1A] dark:bg-[#0D0D0D] pt-8 pb-8 md:pt-10 md:pb-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#FF5733]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF5733]/20 bg-[#FF5733]/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733] animate-pulse" />
            <span className="text-[#FF5733] text-xs font-medium tracking-wide uppercase">
              Admin Panel
            </span>
          </div>
          <h1 className="font-raleway text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Admin <span className="text-[#FF5733]">Dashboard</span>
          </h1>
          <p className="mt-2 text-white/50 text-sm max-w-lg">
            Manage users, races, registrations, and platform settings.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </section>
    </div>
  );
}
