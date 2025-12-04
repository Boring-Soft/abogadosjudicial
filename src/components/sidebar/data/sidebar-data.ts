import {
  Home,
  Users,
  FolderKanban,
  Scale,
  UserCircle,
  FileText,
  Gavel,
} from "lucide-react";
import type { SidebarData } from "../types";
import { UserRole } from "@prisma/client";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sistema Judicial",
      logo: Scale,
      plan: "Professional",
    },
  ],
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Inicio",
          url: "/dashboard",
          icon: Home,
        },
      ],
    },
  ],
};

// Configuración específica para ABOGADO
export const getSidebarDataForAbogado = (user: { name: string; email: string; avatar?: string | null }): SidebarData => ({
  user: {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.jpg",
  },
  teams: [
    {
      name: "Sistema Judicial",
      logo: Scale,
      plan: "Abogado",
    },
  ],
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Inicio",
          url: "/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "Gestión",
      items: [
        {
          title: "Clientes",
          url: "/dashboard/clientes",
          icon: Users,
        },
        {
          title: "Procesos",
          url: "/dashboard/procesos",
          icon: FolderKanban,
        },
      ],
    },
    {
      title: "Cuenta",
      items: [
        {
          title: "Mi Perfil",
          url: "/dashboard/perfil",
          icon: UserCircle,
        },
      ],
    },
  ],
});

// Configuración específica para JUEZ
export const getSidebarDataForJuez = (user: { name: string; email: string; avatar?: string | null }): SidebarData => ({
  user: {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.jpg",
  },
  teams: [
    {
      name: "Sistema Judicial",
      logo: Scale,
      plan: "Juez",
    },
  ],
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Inicio",
          url: "/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "Gestión Judicial",
      items: [
        {
          title: "Demandas",
          url: "/dashboard/juez/demandas",
          icon: FileText,
        },
        {
          title: "Procesos",
          url: "/dashboard/procesos",
          icon: FolderKanban,
        },
      ],
    },
    {
      title: "Cuenta",
      items: [
        {
          title: "Mi Perfil",
          url: "/dashboard/juez/perfil",
          icon: UserCircle,
        },
      ],
    },
  ],
});

// Función helper para obtener datos del sidebar según el rol
export const getSidebarDataByRole = (
  role: UserRole,
  user: { name: string; email: string; avatar?: string | null }
): SidebarData => {
  switch (role) {
    case UserRole.ABOGADO:
      return getSidebarDataForAbogado(user);
    case UserRole.JUEZ:
      return getSidebarDataForJuez(user);
    default:
      return sidebarData;
  }
};
