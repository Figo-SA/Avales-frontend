import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignorar assets internos de Next
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // ====== 1) (Opcional) CORS solo si /api es de Next ======
  if (pathname.startsWith("/api")) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res;
  }

  // ====== 2) Auth (cookie HttpOnly "token") ======
  const token = req.cookies.get("token")?.value;

  const isPublic =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // No autenticado -> solo rutas públicas, todo lo demás a /signin (incluye /fjdsa)
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
  // Atrapa todo (incluye rutas inexistentes) excepto recursos internos
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
