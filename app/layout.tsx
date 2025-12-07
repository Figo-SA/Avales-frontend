import "./css/style.css";

import Theme from "./theme-provider";
import AppProvider from "./app-provider";
import { inter } from "./fonts";

export const metadata = {
  title: "Avales Federación",
  description: "Aplicación para gestionar avales de una federación deportiva",
  icons: {
    icon: "images/logoFederacion.png", // Ruta a tu favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
      <body
        className={`${inter.variable} font-inter antialiased bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400`}
      >
        <Theme>
          <AppProvider>{children}</AppProvider>
        </Theme>
      </body>
    </html>
  );
}
