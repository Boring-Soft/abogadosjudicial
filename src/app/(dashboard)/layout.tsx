import { DashboardLayoutClient } from "@/components/layouts/dashboard-layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication disabled for frontend design purposes
  // TODO: Re-enable when Supabase is configured

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
