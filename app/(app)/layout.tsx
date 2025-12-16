"use client";

import Sidebar from "@/components/layouts/sidebar";
import Header from "@/components/layouts/header";
import { useAuth } from "@/app/providers/auth-provider";
import { NAV, ROLES_WITHOUT_SIDEBAR } from "@/lib/navigation/sidebar.config";
import { canSeeSidebar } from "@/lib/auth/access";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) return null;

  const showSidebar = canSeeSidebar(user, ROLES_WITHOUT_SIDEBAR);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {showSidebar && <Sidebar />}

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow [&>*:first-child]:scroll-mt-16">{children}</main>
      </div>
    </div>
  );
}
