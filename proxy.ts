import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { nextUrl, method } = request;
  const token = request.cookies.get("token")?.value;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isHome = nextUrl.pathname === "/";
  const isProtected = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = nextUrl.pathname.startsWith("/signin");

  // ---------------------------------------------------
  // 1) CORS solo para /api/*
  // ---------------------------------------------------
  if (isApiRoute) {
    // Preflight OPTIONS
    if (method === "OPTIONS") {
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

  // ---------------------------------------------------
  // 2) Lógica de autenticación (front)
  // ---------------------------------------------------

  // Si entra a "/" decidimos según el token
  if (isHome) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Rutas protegidas (ej. /dashboard, /dashboard/lo-que-sea)
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Si ya tiene token y va a /signin, lo mandamos al dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si nada de lo anterior aplica, dejamos pasar la request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*", // CORS
    "/", // Home: decide /signin o /dashboard según cookie
    "/dashboard/:path*", // Rutas protegidas
    "/signin", // Redirigir si ya está logueado
  ],
};
