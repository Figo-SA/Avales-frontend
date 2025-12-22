import { Gauge, Users, BookOpen, BicepsFlexed, CalendarDays } from "lucide-react";

export const SidebarIcons = {
  dashboard: Gauge,
  deportistas: BicepsFlexed,
  usuarios: Users,
  avales: BookOpen,
  eventos: CalendarDays,
};

export type SidebarIconKey = keyof typeof SidebarIcons;
