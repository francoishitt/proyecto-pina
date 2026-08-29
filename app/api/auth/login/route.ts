import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function origenPublico(request: NextRequest) {
  const configurado = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurado) return configurado.replace(/\/$/, "");

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
    || request.headers.get("host")?.split(",")[0]?.trim();

  if (proto && host) return `${proto}://${host}`;
  return request.nextUrl.origin;
}

function volverLogin(request: NextRequest, mensaje: string) {
  const url = new URL("/login", origenPublico(request));
  url.searchParams.set("error", mensaje);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const correo = String(formData.get("correo") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!correo || !password) {
      return volverLogin(request, "Completa correo y contraseña.");
    }

    const usuario = await prisma.usuario.findUnique({ where: { email: correo } });
    if (!usuario) {
      return volverLogin(request, "Correo o contraseña incorrectos.");
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return volverLogin(request, "Correo o contraseña incorrectos.");
    }

    if (!usuario.emailVerificado || !["ADMIN", "SUPERVISOR", "EDITOR"].includes(usuario.rol)) {
      return volverLogin(request, "Esta cuenta no tiene acceso al panel administrativo.");
    }

    // IMPORTANTE: Hostinger ejecuta la app internamente en 0.0.0.0:3000.
    // Nunca construir redirecciones públicas con request.url.
    const response = NextResponse.redirect(new URL("/admin", origenPublico(request)), 303);
    response.cookies.set("admin_session", usuario.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    return volverLogin(request, "No se pudo iniciar sesión. Intenta nuevamente.");
  }
}
