"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { ProSection } from "./pro-section";
import { sidebarData, getSidebarDataByRole } from "./data/sidebar-data";
import type { NavGroupProps, SidebarData } from "./types";
import { useProfile } from "@/hooks/use-profile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, loading } = useProfile();

  // Obtener datos del sidebar según el rol del usuario
  const data: SidebarData = profile
    ? getSidebarDataByRole(profile.role, {
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Usuario",
        email: profile.email || "",
        avatar: profile.avatarUrl,
      })
    : sidebarData;

  if (loading) {
    return (
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <SidebarHeader>
          <div className="h-10 bg-muted animate-pulse rounded" />
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-2 p-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-8 bg-muted animate-pulse rounded" />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((props: NavGroupProps) => (
          <NavGroup key={props.title} {...props} />
        ))}
        <div className="mt-auto">
          <ProSection />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
