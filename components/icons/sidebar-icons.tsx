import { LayoutDashboard, Users, Mail, Inbox, Gauge } from "lucide-react";

export const SidebarIcons = {
  dashboard: Gauge,
  users: Users,
  messages: Mail,
  inbox: Inbox,
};

export type SidebarIconKey = keyof typeof SidebarIcons;
