import "./css/style.css";

import Theme from "./providers/theme-provider";
import AppProvider from "./providers/app-provider";
import { AuthProvider } from "./providers/auth-provider";

export const metadata = {
  title: "Avales - Federación Deportiva Provincial de Loja",
  description: "Sistema de gestión de avales deportivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-inter antialiased bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
        <Theme>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}
