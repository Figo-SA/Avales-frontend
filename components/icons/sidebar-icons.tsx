import { LayoutDashboard, Users, Mail, Inbox, Gauge, Book } from "lucide-react";

export const SidebarIcons = {
  dashboard: Gauge,
  users: Users,
  inbox: Inbox,
  aval: Book,
};

export type SidebarIconKey = keyof typeof SidebarIcons;
