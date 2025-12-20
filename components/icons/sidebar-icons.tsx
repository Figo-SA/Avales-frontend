import {
  Gauge,
  Users,
  Mail,
  Inbox,
  FileCheck,
  ClipboardCheck,
  Building2,
  BarChart3,
  UserCircle,
  FolderOpen,
  History,
  FilePlus,
  Settings,
} from "lucide-react";

export const SidebarIcons = {
  // General
  dashboard: Gauge,
  users: Users,
  messages: Mail,
  inbox: Inbox,
  settings: Settings,

  // Avales
  fileCheck: FileCheck,
  clipboardCheck: ClipboardCheck,
  folderOpen: FolderOpen,
  filePlus: FilePlus,
  history: History,

  // Organizaciones
  building: Building2,

  // Reportes
  chart: BarChart3,

  // Perfil
  profile: UserCircle,
};

export type SidebarIconKey = keyof typeof SidebarIcons;
