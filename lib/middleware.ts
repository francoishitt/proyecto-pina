import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function origenPublico(request: NextRequest) {
  const configurado = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurado) return configurado.replace(/\/$/, "");

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
    || request.headers.get("host")?.split(",")[0]?.trim();

  if (proto && host) return `${proto}://${host}`;
  return request.nextUrl.origin;
}

export function middleware(request: NextRequest) {
  const cookieSesion = request.cookies.get("admin_session")?.value;
  const urlActual = request.nextUrl.pathname;

  if (urlActual.startsWith("/admin") && !cookieSesion) {
    return NextResponse.redirect(new URL("/login", origenPublico(request)));
  }

  const response = NextResponse.next();

  if (urlActual.startsWith("/admin")) {
    if (cookieSesion) {
      response.cookies.set("admin_session", cookieSesion, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 60,
      });
    }

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
