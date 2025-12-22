import { Gauge, Users, BookOpen, BicepsFlexed } from "lucide-react";

export const SidebarIcons = {
  dashboard: Gauge,
  deportistas: BicepsFlexed,
  usuarios: Users,
  avales: BookOpen,
};

export type SidebarIconKey = keyof typeof SidebarIcons;
