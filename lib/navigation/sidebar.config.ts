// lib/navigation/sidebar.config.ts
import type { Role } from "@/types/user";
import type { SidebarIconKey } from "@/components/icons/sidebar-icons";

export type SidebarItem =
  | {
      type: "link";
      label: string;
      href: string;
      segment: string;
      icon?: SidebarIconKey;
      roles?: Role[];
    }
  | {
      type: "group";
      label: string;
      segment: string;
      icon?: SidebarIconKey;
      roles?: Role[];
      children: Array<{
        label: string;
        href: string;
        segment: string;
        icon?: SidebarIconKey;
        roles?: Role[];
      }>;
    };

/**
 * Roles que no ven el sidebar (ej: flujo especial)
 */
export const ROLES_WITHOUT_SIDEBAR: Role[] = [];

/**
 * Configuración de navegación del sidebar por roles
 */
export const SIDEBAR_ITEMS: SidebarItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD - Todos los roles autenticados
  // ═══════════════════════════════════════════════════════════════
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
      "DEPORTISTA",
    ],
    children: [
      {
        label: "Principal",
        href: "/dashboard",
        segment: "dashboard",
        roles: [
          "SUPER_ADMIN",
          "ADMIN",
          "ENTRENADOR",
          "DTM",
          "DTM_EIDE",
          "PDA",
          "FINANCIERO",
          "DEPORTISTA",
        ],
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        segment: "analytics",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ORGANIZACIONES - Solo SUPER_ADMIN
  // ═══════════════════════════════════════════════════════════════
  {
    type: "link",
    label: "Organizaciones",
    href: "/organizaciones",
    segment: "organizaciones",
    icon: "building",
    roles: ["SUPER_ADMIN"],
  },

  // ═══════════════════════════════════════════════════════════════
  // AVALES (Admin) - Ve todos los avales de su organización
  // ═══════════════════════════════════════════════════════════════
  {
    type: "group",
    label: "Avales",
    segment: "avales",
    icon: "fileCheck",
    roles: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        label: "Todos los Avales",
        href: "/avales",
        segment: "avales",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        label: "Pendientes",
        href: "/avales?status=EN_REVISION",
        segment: "avales",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        label: "Aprobados",
        href: "/avales?status=APROBADO",
        segment: "avales",
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MIS AVALES (Entrenador) - Solo sus propios avales
  // ═══════════════════════════════════════════════════════════════
  {
    type: "group",
    label: "Mis Avales",
    segment: "mis-avales",
    icon: "folderOpen",
    roles: ["ENTRENADOR"],
    children: [
      {
        label: "Todos",
        href: "/mis-avales",
        segment: "mis-avales",
        roles: ["ENTRENADOR"],
      },
      {
        label: "Crear Nuevo",
        href: "/mis-avales/nuevo",
        segment: "nuevo",
        icon: "filePlus",
        roles: ["ENTRENADOR"],
      },
      {
        label: "Borradores",
        href: "/mis-avales?status=BORRADOR",
        segment: "mis-avales",
        roles: ["ENTRENADOR"],
      },
      {
        label: "Enviados",
        href: "/mis-avales?status=ENVIADO",
        segment: "mis-avales",
        roles: ["ENTRENADOR"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MIS AVALES (Deportista) - Ve sus avales asignados
  // ═══════════════════════════════════════════════════════════════
  {
    type: "link",
    label: "Mis Avales",
    href: "/mis-avales",
    segment: "mis-avales",
    icon: "fileCheck",
    roles: ["DEPORTISTA"],
  },

  // ═══════════════════════════════════════════════════════════════
  // REVISIÓN (DTM, DTM_EIDE, PDA) - Bandeja de aprobación
  // ═══════════════════════════════════════════════════════════════
  {
    type: "group",
    label: "Revisión",
    segment: "revision",
    icon: "clipboardCheck",
    roles: ["DTM", "DTM_EIDE", "PDA"],
    children: [
      {
        label: "Pendientes",
        href: "/revision",
        segment: "revision",
        roles: ["DTM", "DTM_EIDE", "PDA"],
      },
      {
        label: "Historial",
        href: "/revision/historial",
        segment: "historial",
        icon: "history",
        roles: ["DTM", "DTM_EIDE", "PDA"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // DEPORTISTAS
  // ═══════════════════════════════════════════════════════════════
  {
    type: "link",
    label: "Deportistas",
    href: "/deportistas",
    segment: "deportistas",
    icon: "users",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    type: "link",
    label: "Mis Deportistas",
    href: "/mis-deportistas",
    segment: "mis-deportistas",
    icon: "users",
    roles: ["ENTRENADOR"],
  },

  // ═══════════════════════════════════════════════════════════════
  // USUARIOS - Gestión de usuarios
  // ═══════════════════════════════════════════════════════════════
  {
    type: "link",
    label: "Usuarios",
    href: "/usuarios",
    segment: "usuarios",
    icon: "users",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },

  // ═══════════════════════════════════════════════════════════════
  // REPORTES
  // ═══════════════════════════════════════════════════════════════
  {
    type: "link",
    label: "Reportes",
    href: "/reportes",
    segment: "reportes",
    icon: "chart",
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCIERO"],
  },
];
