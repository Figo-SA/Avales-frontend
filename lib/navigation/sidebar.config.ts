// lib/navigation/nav.config.ts
import type { Role } from "@/app/types/user";
import { SidebarIconKey } from "@/components/icons/sidebar-icons";

export type SidebarItem =
  | {
      type: "link";
      label: string;
      href: string;
      segment: string;
      icon?: SidebarIconKey; // ← obligatorio
      roles?: Role[];
    }
  | {
      type: "group";
      label: string;
      segment: string;
      icon?: SidebarIconKey; // ← icono del grupo
      roles?: Role[];
      children: Array<{
        label: string;
        href: string;
        segment: string;
        icon?: SidebarIconKey; // ← icono de cada sublink
        roles?: Role[];
      }>;
    };

export const ROLES_WITHOUT_SIDEBAR: Role[] = ["DTM"];

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    type: "group",
    label: "Dashboard",
    segment: "dashboard",
    icon: "dashboard",
    roles: [
      "SUPER_ADMIN",
      "ADMIN",
      "ENTRENADOR",
      "DTM",
      "DTM_EIDE",
      "PDA",
      "FINANCIERO",
    ],
    children: [
      {
        label: "Main",
        href: "/dashboard",
        segment: "dashboard",
        roles: [
          "SUPER_ADMIN",
          "ADMIN",
          "DTM",
          "DTM_EIDE",
          "FINANCIERO",
          "PDA",
          "ENTRENADOR",
        ],
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        segment: "dashboard",
        icon: "dashboard",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    type: "link",
    label: "Usuarios",
    href: "/usuarios",
    segment: "usuarios",
    icon: "users",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];
