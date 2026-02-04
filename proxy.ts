import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignorar assets internos de Next
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // (Opcional) Ignorar rutas públicas estáticas comunes
  // if (pathname.startsWith("/images") || pathname.startsWith("/public")) {
  //   return NextResponse.next();
  // }

  // ====== Auth (cookie HttpOnly "token") ======
  const token = req.cookies.get("token")?.value;

  const isPublic =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // No autenticado -> solo rutas públicas
  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Autenticado -> evitar volver a /signin
  if (token && pathname.startsWith("/signin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Atrapa todo excepto recursos internos
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
